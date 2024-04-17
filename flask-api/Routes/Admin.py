"""
@file Admin.py
@author Samuel Chamalé
@date 4/12/2024
@brief This file contains the Bank model and its methods.
"""

from flask import Blueprint, request, jsonify
from flask_cors import CORS
from Generics import cur


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
