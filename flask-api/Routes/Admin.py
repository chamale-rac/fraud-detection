"""
@file Admin.py
@author Samuel Chamalé
@date 4/12/2024
@brief This file contains the Bank model and its methods.
"""

from flask import Blueprint, request, jsonify
from flask_cors import CORS
from Generics import cur
from utils import propChecker

api = Blueprint("admin", __name__)
cors = CORS(api)
conn = cur.cur


@api.route("/zzz", methods=["GET"])
def admin():
    return jsonify({
        "message": "Response from Admin model"
    }), 200


@api.route('/gen_shared_data', methods=['GET'])
def shared_data():
    query = """
    MATCH (c1:Client)-[:HAS_EMAIL|:HAS_PHONE|:HAS_DPI] ->(n)<- [:HAS_EMAIL|:HAS_PHONE|:HAS_DPI]-(c2:Client)
    WHERE id(c1) < id(c2)
    WITH c1, c2, count(*) as cnt
    MERGE (c1) - [:SHARED_DATA {count: cnt}] -> (c2);
    """

    response = conn.run(query)

    if not response["success"]:
        return jsonify({
            'message': f'Failed to create shared data relationships with error: {response["message"]}'
        }), 400

    query = """
    MATCH p = (:Client) - [s:SHARED_DATA] -> (:Client) 
    WHERE s.count >= 2
    RETURN count(p) AS x
    """

    response = conn.run(query)
    if not response["success"]:
        return jsonify({
            'message': f'Failed to get shared data relationships with error: {response["message"]}'
        }), 400

    return jsonify({
        'message': 'Shared data relationships created successfully or updated successfully',
        'count': response["response"][0]["x"]
    }), 200


'''
Get Types of Tx and its percentage
'''


@api.route("/transaction_summary", methods=["GET"])
def getTypes():
    query = """
    MATCH (t:Transaction)
    WITH count(t) AS globalCnt
    UNWIND ['CashIn', 'CashOut', 'Transfer'] AS txType
    CALL apoc.cypher.run('MATCH (t:' + txType + ')
        RETURN count(t) AS txCnt', {})
    YIELD value
    RETURN txType, value.txCnt AS NumberOfTransactions,
    round(toFloat(value.txCnt)/toFloat(globalCnt), 2) AS `%Transactions`
    ORDER BY `%Transactions` DESC;
    """

    response = conn.run(query)

    if response["success"]:
        return jsonify({
            "message": "Transaction types",
            "types": response["response"]
        }), 200

    return jsonify({
        "message": f"Failed to get transaction types with error: {response['message']}"
    }), 400


deleteProperties = {
    "group_size": (int, "Group size", True)
}


@api.route("/delete_fraud_clients", methods=["POST"])
def deleteFraudClients():
    data = request.get_json()

    valid, message = propChecker(deleteProperties, data)

    if not valid:
        return jsonify({
            "message": message
        }), 400

    group_size = data["group_size"]

    group_size = data["group_size"]

    query = f"""
    CALL gds.graph.drop('wcc')
    YIELD graphName;

    CALL gds.graph.project('wcc',
      {{
        Client: {{
          label: 'Client'
        }}
      }},
      {{
        SHARED_IDENTIFIERS:{{
          type: 'SHARED_IDENTIFIERS',
          orientation: 'UNDIRECTED',
          properties: {{
            count: {{
              property: 'count'
            }}
          }}
        }}
      }}
    ) YIELD graphName,nodeCount,relationshipCount,projectMillis;

    CALL gds.wcc.stream('wcc',
      {{
        nodeLabels: ['Client'],
        relationshipTypes: ['SHARED_IDENTIFIERS'],
        consecutiveIds: true
      }}
    )
    YIELD componentId, nodeId
    WITH componentId AS cluster, gds.util.asNode(nodeId) AS client
    WITH cluster, collect(client.uuid) AS clients
    WITH cluster, clients, size(clients) AS clusterSize WHERE clusterSize > 1
    UNWIND clients AS client
    MATCH (c:Client) WHERE c.uuid = client
    SET c.firstPartyFraudGroup=cluster;


    // Match the clients based on group criteria

    MATCH (c:Client)
    WITH c.firstPartyFraudGroup AS fpGroupID, collect(c.uuid) AS fGroup
    WITH *, size(fGroup) AS groupSize WHERE groupSize >= {group_size}
    WITH collect(fpGroupID) AS fraudRings

    // Count the nodes to be deleted
    MATCH (c:Client)
    WHERE c.firstPartyFraudGroup IN fraudRings
    WITH fraudRings, count(c) AS nodesToDelete

    // Perform the deletion
    MATCH (c:Client)
    WHERE c.firstPartyFraudGroup IN fraudRings
    OPTIONAL MATCH (c)-[r]-()
    DELETE r, c

    // Return the count of deleted nodes
    RETURN nodesToDelete;
    """

    response = conn.run(query)

    if response["success"]:
        if len(response["response"]) == 0:
            return jsonify({
                "message": "No fraud clients deleted"
            }), 200

        return jsonify({
            "message": "Fraud clients deleted",
            "count": response["response"][0]["nodesToDelete"]
        }), 200

    return jsonify({
        "message": f"Failed to delete fraud clients with error: {response['message']}"
    }), 400
