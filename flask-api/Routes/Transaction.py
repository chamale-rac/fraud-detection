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
- Transfer: Client transfers money to another client's account
- Cash Out: Client withdraws money from their account

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


@api.route("/cash_in", methods=["POST"])
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
            "message": "Account does not belong to the client or does not exist"
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
        WITH nt, t, a
        // Apply both relationship conditions in one WITH block
        FOREACH(ignoreMe IN CASE WHEN t IS NULL THEN [1] ELSE [] END |
            CREATE (a)-[:FIRST_TRANSACTION]->(nt)
        )
        FOREACH(ignoreMe IN CASE WHEN t IS NOT NULL THEN [1] ELSE [] END |
            CREATE (t)-[:NEXT]->(nt)
        )
        WITH nt, a
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


'''
Transfer Transaction
'''
TransferProperties = {
    "from_uuid": (str, "UUID of the account that will transfer the money", True),
    "to_uuid": (str, "UUID of the account that will receive the money", True),

    "amount": (float, "Amount of money that will be transferred", True),
    "description": (str, "Description of the transaction", True),
}


@api.route("/transfer", methods=["POST"])
def transfer():
    data = request.get_json()

    valid, message = propChecker(TransferProperties, data)
    if not valid:
        return jsonify({
            "message": message
        }), 400

    fromAccountNode = Node("Account", {"uuid": data["from_uuid"]})
    fromAccountNode.uuid = data["from_uuid"]
    fromAccountExists = fromAccountNode.match()
    if not fromAccountExists["success"] or len(fromAccountExists["response"]) == 0:
        return jsonify({
            "message": "From Account does not exist: Check the provided UUID"
        }), 400
    fromAccount = [node2Dict(record["n"])
                   for record in fromAccountExists["response"]][0]

    toAccountNode = Node("Account", {"uuid": data["to_uuid"]})
    toAccountNode.uuid = data["to_uuid"]
    toAccountExists = toAccountNode.match()
    if not toAccountExists["success"] or len(toAccountExists["response"]) == 0:
        return jsonify({
            "message": "To Account does not exist: Check the provided UUID"
        }), 400

    if fromAccount["balance"] < data["amount"]:
        return jsonify({
            "message": "Insufficient balance in From Account"
        }), 400

    # Determine if the transaction is internal or external (same bank or different bank) verifying both have the same bank
    # bankNode->HAS_ACCOUNT->AccountNode
    bankNode = Node("Bank", {})

    # From Account
    bankFromAccount = Relationship(bankNode, fromAccountNode, "HAS_ACCOUNT")
    bankFromAccountExists = bankFromAccount.matchReturnB()

    # To Account
    bankToAccount = Relationship(bankNode, toAccountNode, "HAS_ACCOUNT")
    bankToAccountExists = bankToAccount.matchReturnB()

    print(bankFromAccountExists)
    if not bankFromAccountExists["success"] or len(bankFromAccountExists["response"]) == 0:
        return jsonify({
            "message": "From Account does not belong to any bank"
        }), 400

    if not bankToAccountExists["success"] or len(bankToAccountExists["response"]) == 0:
        return jsonify({
            "message": "To Account does not belong to any bank"
        }), 400

    fromBank = [node2Dict(record["b"])
                for record in bankFromAccountExists["response"]][0]
    toBank = [node2Dict(record["b"])
              for record in bankToAccountExists["response"]][0]

    transactionType = "Internal" if fromBank["uuid"] == toBank["uuid"] else "External"

    data["transaction_type"] = transactionType

    # Get the current date and time
    now = datetime.now()

    data["date"] = now

    data["status"] = "Floating"
    transactionNode = Node("Transaction:Transfer", propFilter(data, [
        "amount", "description", "date", "status", "transaction_type"]))
    transactionNode.create()

    newTransactionUUID = transactionNode.uuid
    fromAccountUUID = fromAccountNode.uuid
    toAccountUUID = toAccountNode.uuid

    # QUERY
    query = f"""
        MATCH (fa:Account {{uuid: "{fromAccountUUID}"}})
        OPTIONAL MATCH (fa)-[r:LAST_TRANSACTION]->(t:Transaction)
        WITH fa, r, t, CASE WHEN t IS NULL THEN 1 ELSE t.step + 1 END AS step
        DELETE r
        WITH fa, step, t
        MATCH (nt:Transaction {{uuid: "{newTransactionUUID}"}})
        SET nt.step = step
        SET nt.balance = fa.balance - nt.amount
        SET nt.status = "Pending"
        CREATE (fa)-[:LAST_TRANSACTION]->(nt)
        WITH nt, t, fa
        FOREACH (ignoreMe IN CASE WHEN t IS NULL THEN [1] ELSE [] END |
            CREATE (fa)-[:FIRST_TRANSACTION]->(nt)
        )
        FOREACH (ignoreMe IN CASE WHEN t IS NOT NULL THEN [1] ELSE [] END |
            CREATE (t)-[:NEXT]->(nt)
        )
        WITH nt, fa
        MATCH (ta:Account {{uuid: "{toAccountUUID}"}})
        CREATE (fa)-[:TO]->(nt)
        CREATE (nt)-[:TO]->(ta)
        SET fa.balance = fa.balance - nt.amount
        SET ta.balance = ta.balance + nt.amount
        SET nt.status = "Completed"
    """

    response = conn.run(query)

    if response["success"]:
        return jsonify({
            "message": "Transfer transaction created successfully",
            "uuid": newTransactionUUID
        }), 201

    return jsonify({
        "message": f"Failed to create transfer transaction with error: {response['message']}"
    }), 400


'''
Cash Out Transaction
'''
CashOutProperties = {
    "client_uuid": (str, "UUID of the client that will withdraw the money", True),
    "employee_uuid": (str, "UUID of the employee that will process the withdrawal", True),
    "account_uuid": (str, "UUID of the account where the money will be withdrawn from", True),

    "amount": (float, "Amount of money that will be withdrawn", True),
    "description": (str, "Description of the transaction", True),
}


@api.route("/cash_out", methods=["POST"])
def cashOut():
    data = request.get_json()

    # Checking Validity of the Model
    valid, message = propChecker(CashOutProperties, data)

    if not valid:
        return jsonify({
            "message": message
        }), 400

    # Similar checks for client, employee, bank, and account as in cashIn function...
    clientNode = Node("Client", {"uuid": data["client_uuid"]})
    clientNode.uuid = data["client_uuid"]
    clientExists = clientNode.match()
    if not clientExists["success"] or len(clientExists["response"]) == 0:
        return jsonify({
            "message": "Client does not exist: Check the provided UUID"
        }), 400
    client = [node2Dict(record["n"]) for record in clientExists["response"]][0]

    # Check if the account balance is sufficient
    accountNode = Node("Account", {"uuid": data["account_uuid"]})
    accountNode.uuid = data["account_uuid"]
    accountExists = accountNode.match()
    if not accountExists["success"] or len(accountExists["response"]) == 0:
        return jsonify({
            "message": "Account does not exist: Check the provided UUID"
        }), 400
    account = [node2Dict(record["n"])
               for record in accountExists["response"]][0]

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
    if account["balance"] < data["amount"]:
        return jsonify({
            "message": "Insufficient balance in the account"
        }), 400

    # Get the current date and time
    now = datetime.now()

    data["date"] = now

    # Employee-TO->Transaction
    # Transaction-TO->Account

    data["status"] = "Floating"
    transactionNode = Node("Transaction:CashOut", propFilter(data, [
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
        SET nt.balance = a.balance - nt.amount
        SET nt.status = "Pending"
        CREATE (a)-[:LAST_TRANSACTION]->(nt)
        WITH nt, t, a
        // Apply both relationship conditions in one WITH block
        FOREACH(ignoreMe IN CASE WHEN t IS NULL THEN [1] ELSE [] END |
            CREATE (a)-[:FIRST_TRANSACTION]->(nt)
        )
        FOREACH(ignoreMe IN CASE WHEN t IS NOT NULL THEN [1] ELSE [] END |
            CREATE (t)-[:NEXT]->(nt)
        )
        WITH nt, a
        MATCH (e:Employee {{uuid: "{employeeBankUUID}"}})
        CREATE (a)-[:TO]->(nt)
        CREATE (nt)-[:TO]->(e)
        SET a.balance = a.balance - nt.amount
        SET nt.status = "Completed"
    """

    response = conn.run(query)

    if response["success"]:
        return jsonify({
            "message": "Cash Out transaction created successfully",
            "uuid": newTransactionUUID
        }), 201

    return jsonify({
        "message": f"Failed to create cash out transaction with error: {response['message']}"
    }), 400


@api.route("/transactions_history", methods=["POST"])
def transactions_history():
    data = request.get_json()

    valid, message = propChecker({
        "account_uuid": (str, "UUID of the account", True),
    }, data)

    if not valid:
        return jsonify({
            "message": message
        }), 400

    accountNode = Node("Account", {"uuid": data["account_uuid"]})
    accountNode.uuid = data["account_uuid"]
    accountExists = accountNode.match()
    if not accountExists["success"] or len(accountExists["response"]) == 0:
        return jsonify({
            "message": "Account does not exist: Check the provided UUID"
        }), 400

    # query = f"""
    #     MATCH (account:Account {{uuid: "{data["account_uuid"]}"}})-[:FIRST_TRANSACTION]->(firstTransaction:Transaction)
    #     WITH firstTransaction
    #     MATCH path = (firstTransaction)-[:NEXT*]->(nextTransaction:Transaction)
    #     RETURN nodes(path) AS transactions
    #     ORDER BY length(path) DESC
    #     LIMIT 1
    # """
    query = f"""
    MATCH (account:Account {{uuid: "{data['account_uuid']}"}})-[:FIRST_TRANSACTION]->(firstTransaction:Transaction)
    OPTIONAL MATCH path = (firstTransaction)-[:NEXT*]->(nextTransaction:Transaction)
    RETURN CASE 
        WHEN path IS NULL THEN [firstTransaction] 
        ELSE nodes(path) 
    END AS transactions
    ORDER BY length(path) DESC
    LIMIT 1
    """

    response = conn.run(query)

    if not response["success"] or len(response["response"]) == 0:
        return jsonify({
            "message": "No transactions found"
        }), 404

    print(response["response"])
    transactions = [[node2Dict(node) for node in record["transactions"]]
                    for record in response["response"]][0]

    return jsonify({
        "message": "Transactions found",
        "transactions": transactions
    }), 200
