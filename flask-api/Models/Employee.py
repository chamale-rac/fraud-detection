"""
@file Employee.py
@author Samuel Chamalé
@date 4/12/2024
@brief This file contains the Client model and its methods.
"""

from flask import Blueprint, request, jsonify
from flask_cors import CORS
from utils import propChecker, propFilter, node2Dict
from Generics import Node, Relationship
import uuid

Node = Node.Node
Relationship = Relationship.Relationship

api = Blueprint("employee", __name__)
cors = CORS(api)

createEmployeeProperties = {
    "name": (str, "Name of the bank employee", True),
    "surname": (str, "Surname of the bank employee", True),
    "password": (str, "Password of the bank employee", True),
    "birthday": (str, "Birthday of the bank employee", True),
    "genre": (str, "Genre of the bank employee", True),
    "phone": (str, "Phone number of the bank employee", True),
    "email": (str, "Email of the bank employee", True),
    "dpi": (str, "DPI of the bank employee", True),
    "street": (str, "Street of the bank employee", True),
    "city": (str, "City of the bank employee", True),
    "state": (str, "State of the bank employee", True),
    "country": (str, "Country of the bank employee", True),
    "postal_code": (str, "Postal code of the bank employee", True),
    "bank_uuid": (str, "UUID of the bank of the bank employee", True),
    "position": (str, "Position of the bank employee", True),
    "salary": (float, "Salary of the bank employee", True),
    "since": (str, "Date since the bank employee works at the bank", True)
}


@api.route("/zzz", methods=["GET"])
def client():
    return jsonify({
        "message": "Response from Employee model"
    }), 200


@api.route("/create", methods=["POST"])
def createEmployee():
    data = request.get_json()

    valid, message = propChecker(createEmployeeProperties, data)

    if not valid:
        return jsonify({
            "message": message
        }), 400

    thisBank = Node("Bank", {
        "uuid": data["bank_uuid"]
    })
    thisBank.uuid = data["bank_uuid"]

    bankExists = thisBank.match()
    if not bankExists["success"] or len(bankExists["response"]) == 0:
        return jsonify({
            "message": f"Bank not found: Check the UUID provided"
        }), 404

    data["pin"] = str(uuid.uuid4())

    thisDPI = Node("DPI", propFilter(
        data, ["dpi"]
    ))

    # Add work active
    data["active"] = True

    thisEmployee = Node("Employee", propFilter(
        data, ["name", "surname", "password", "birthday", "genre",
               "pin", "active"]
    ))

    thisDPI.merge()

    thisEmployee.properties["dpi_uuid"] = thisDPI.uuid
    thisEmployee.properties["bank_uuid"] = thisBank.uuid

    response = thisEmployee.create()
    if not response["success"]:
        return jsonify({
            "message": f"Failed to create bank employee with error: {response['message']}"
        }), 400

    thisPhone = Node("Phone", propFilter(
        data, ["phone"]
    ))

    thisEmail = Node("Email", propFilter(
        data, ["email"]
    ))

    thisAddress = Node("Address", propFilter(
        data, ["street", "city", "state", "country", "postal_code"]
    ))

    thisPhone.merge()
    thisEmail.merge()
    thisAddress.merge()

    try:
        Relationship(thisEmployee, thisPhone, "HAS_PHONE").create()
        Relationship(thisEmployee, thisEmail, "HAS_EMAIL").create()
        Relationship(thisEmployee, thisDPI, "HAS_DPI").create()
        Relationship(thisEmployee, thisAddress, "HAS_ADDRESS").create()
        Relationship(thisEmployee, thisBank, "WORKS_AT", propFilter(
            data, ["position", "salary", "since"])).create()
    except Exception as e:
        return str(e), 500

    return jsonify({
        "message": "Bank employee created successfully",
        "pin": data["pin"],
        "uuid": thisEmployee.uuid
    }), 201


@api.route("/login", methods=["POST"])
def loginEmployee():
    data = request.get_json()

    valid, message = propChecker({
        "pin": (str, "PIN of the bank employee", True),
        "password": (str, "Password of the bank employee", True)
    }, data)

    if not valid:
        return jsonify({
            "message": message
        }), 400

    thisEmployee = Node("Employee", {
        "pin": data["pin"],
        "password": data["password"]
    })

    response = thisEmployee.match()

    if not response["success"] or len(response["response"]) == 0:
        return jsonify({
            "message": f"Bank employee not found: {response['message']}",
            "match": False
        }), 404

    user = [node2Dict(record["n"]) for record in response["response"]][0]

    # Check active
    if user["active"] != True:
        return jsonify({
            "message": "Bank employee is not active",
            "match": False
        }), 401

    user.pop("password")
    user.pop("pin")

    return jsonify({
        "message": "Bank employee found",
        "uuid": user["uuid"],
        "match": True,
        "user": user
    }), 200
