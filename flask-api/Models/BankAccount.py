"""
@file BankAccount.py
@author Samuel Chamalé
@date 4/12/2024
@brief This file contains the BankAccount model and its methods.
"""

from flask import Blueprint, request, jsonify
from flask_cors import CORS
from utils import propChecker, propFilter, node2Dict, convertDate
from Generics import Node, Relationship
from datetime import datetime

Node = Node.Node
Relationship = Relationship.Relationship

api = Blueprint("bank_account", __name__)
cors = CORS(api)

BankAccountProperties = {
    "account_type": (str, "Type of the bank account [Saving, Checking]", True),
    "status": (str, "Current status of the account [Active, Closed, Frozen]", True),
    "interest_rate": (float, "Interest rate of the account", True),
    "currency": (str, "Currency of the account [USD, EUR, etc.]", True),
    "balance": (float, "Current balance of the account", True),
    "user_uuid": (str, "UUID of the account owner", True),
    "bank_uuid": (str, "UUID of the bank of the account", True),
}


@api.route("/zzz", methods=["GET"])
def bank_account():
    return jsonify({
        "message": "Response from BankAccount model"
    }), 200


@api.route("/create", methods=["POST"])
def createBankAccount():
    data = request.get_json()

    valid, message = propChecker(BankAccountProperties, data)

    if not valid:
        return jsonify({
            "message": message
        }), 400

    userNode = Node("Client", {"uuid": data["user_uuid"]})
    userNode.uuid = data["user_uuid"]
    userNodeExists = userNode.match()
    if not userNodeExists["success"] or len(userNodeExists["response"]) == 0:
        return jsonify({
            "message": "User does not exist: Check the provided UUID"
        }), 400

    bankNode = Node("Bank", {"uuid": data["bank_uuid"]})
    bankNode.uuid = data["bank_uuid"]
    bankNodeExists = bankNode.match()
    if not bankNodeExists["success"] or len(bankNodeExists["response"]) == 0:
        return jsonify({
            "message": "Bank does not exist: Check the provided UUID"
        }), 400

    # Status: Active, Closed, Frozen
    if data["status"] not in ["Active", "Closed", "Frozen"]:
        return jsonify({
            "message": "Invalid status, expected Active, Closed, or Frozen"
        }), 400

    # Account type: Saving, Checking
    if data["account_type"] not in ["Saving", "Checking"]:
        return jsonify({
            "message": "Invalid account type, expected Saving, Checking, or Business"
        }), 400

    # Get the current date and time
    now = datetime.now()

    data["open_date"] = now

    # REQUIREMENT 3.2: Creación de nodos con 2+ labels
    # REQUIREMENT 3.3: Creación de nodos con propiedades
    accountNode = Node(f"BankAccount:{data['account_type']}", propFilter(data, [
                       "account_type", "open_date", "status", "interest_rate", "currency", "balance"]))

    accountNode.create()

    try:
        Relationship(userNode, accountNode, "OWNS").create()
        Relationship(bankNode, accountNode, "HAS").create()
    except Exception as e:
        return jsonify({
            "message": f"Failed to create relationship with error: {str(e)}"
        }), 400

    return jsonify({
        "message": "Bank account created successfully",
        "uuid": accountNode.uuid
    }), 201
