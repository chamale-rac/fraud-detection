"""
@file Transaction.py
@author Samuel Chamalé
@date 4/12/2024
@brief This file contains the Transaction model and its methods.
"""

from flask import Blueprint, request, jsonify
from flask_cors import CORS
from Generics import Node, Relationship, cur
from utils import propFilter, propChecker, node2Dict


from datetime import datetime

Node = Node.Node
Relationship = Relationship.Relationship
conn = cur.cur

api = Blueprint("transaction", __name__)
cors = CORS(api)


@api.route("/zzz", methods=["GET"])
def transaction():
    return jsonify({
        "message": "Response from Transaction model"
    }), 200


'''
Transaction Types:
- Cash In: Employee deposits money to a client's account
- Cash Out: Client withdraws money from his account
- Transfer: Client transfers money to another client's account
- Payment: Client pays a service or product to a company

Transaction Node Label
- Transaction:<type> (e.g. Transaction:CashIn)
'''

'''
Cash In Transaction
'''
CashInProperties = {
    "client_uuid": (str, "UUID of the client that will receive the money", True),
    "employee_uuid": (str, "UUID of the employee that will deposit the money", True),
    "account_uuid": (str, "UUID of the account where the money will be deposited", True),

    "amount": (float, "Amount of money that will be deposited", True),
    "description": (str, "Description of the transaction", True),
}


@api.route("/cash-in", methods=["POST"])
def cashIn():
    data = request.get_json()

    # Checking Validity of the Model

    valid, message = propChecker(CashInProperties, data)

    if not valid:
        return jsonify({
            "message": message
        }), 400

    clientNode = Node("Client", {"uuid": data["client_uuid"]})
    clientNode.uuid = data["client_uuid"]
    clientExists = clientNode.match()
    if not clientExists["success"] or len(clientExists["response"]) == 0:
        return jsonify({
            "message": "Client does not exist: Check the provided UUID"
        }), 400
    client = [node2Dict(record["n"]) for record in clientExists["response"]][0]

    employeeNode = Node("Employee", {"uuid": data["employee_uuid"]})
    employeeNode.uuid = data["employee_uuid"]
    employeeExists = employeeNode.match()
    if not employeeExists["success"] or len(employeeExists["response"]) == 0:
        return jsonify({
            "message": "Employee does not exist: Check the provided UUID"
        }), 400

    bankNode = Node("Bank", {"uuid": client["bank_uuid"]})
    bankNode.uuid = client["bank_uuid"]
    bankExists = bankNode.match()
    if not bankExists["success"] or len(bankExists["response"]) == 0:
        return jsonify({
            "message": "Bank does not exist: Check the provided UUID"
        }), 400

    # Check if the employee belongs to the bank
    employeeBank = Relationship(bankNode, employeeNode, "HAS_EMPLOYEE")
    employeeBankExists = employeeBank.match()
    if not employeeBankExists["success"] or len(employeeBankExists["response"]) == 0:
        return jsonify({
            "message": "Employee does not belong to the bank"
        }), 400

    accountNode = Node("Account", {"uuid": data["account_uuid"]})
    accountNode.uuid = data["account_uuid"]

    # Check if the account belongs to the client
    accountClient = Relationship(clientNode, accountNode, "OWNS_ACCOUNT")
    accountClientExists = accountClient.match()
    if not accountClientExists["success"] or len(accountClientExists["response"]) == 0:
        return jsonify({
            "message": "Account does not belong to the client"
        }), 400

    # Get the current date and time
    now = datetime.now()

    data["date"] = now

    # Employee-TO->Transaction
    # Transaction-TO->Account

    data["status"] = "Floating"
    transactionNode = Node("Transaction:CashIn", propFilter(data, [
        "amount", "description", "date", "status"]))
    transactionNode.create()

    newTransactionUUID = transactionNode.uuid
    bankAccountUUID = accountNode.uuid
    employeeBankUUID = employeeNode.uuid

    # QUERY
    query = f"""
        MATCH (a:Account {{uuid: "{bankAccountUUID}"}})
        OPTIONAL MATCH (a)-[r:LAST_TRANSACTION]->(t:Transaction)
        WITH a, r, t, CASE WHEN t IS NULL THEN 1 ELSE t.step + 1 END AS step
        DELETE r
        WITH a, step, t
        MATCH (nt:Transaction {{uuid: "{newTransactionUUID}"}})
        SET nt.step = step
        SET nt.balance = a.balance + nt.amount
        SET nt.status = "Pending"
        CREATE (a)-[:LAST_TRANSACTION]->(nt)
        WITH nt, t
        CASE WHEN t IS NOT NULL THEN CREATE (t)-[:NEXT]->(nt) END
        CASE WHEN t IS NULL THEN CREATE (a)-[:FIRST_TRANSACTION]->(nt) END
        WITH nt
        MATCH (e:Employee {{uuid: "{employeeBankUUID}"}})
        CREATE (e)-[:TO]->(nt)
        CREATE (nt)-[:TO]->(a)
        SET a.balance = a.balance + nt.amount
        SET nt.status = "Completed"
    """

    response = conn.run(query)

    if response["success"]:
        return jsonify({
            "message": "Cash In transaction created successfully",
            "uuid": newTransactionUUID
        }), 201

    return jsonify({
        "message": f"Failed to create cash in transaction with error: {response['message']}"
    }), 400


@api.route("/cash-out", methods=["POST"])
def cashOut():
    return jsonify({
        "message": "Response from Transaction model"
    }), 200


@api.route("/transfer", methods=["POST"])
def transfer():
    return jsonify({
        "message": "Response from Transaction model"
    }), 200


@api.route("/payment", methods=["POST"])
def payment():
    return jsonify({
        "message": "Response from Transaction model"
    }), 200
