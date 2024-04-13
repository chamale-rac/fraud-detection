"""
@file Client.py
@author Samuel Chamalé
@date 4/12/2024
@brief This file contains the Client model and its methods.
"""

from flask import Blueprint, request, jsonify
from flask_cors import CORS
from utils import Node, Relationship, propChecker, propFilter, node2Dict

api = Blueprint("client", __name__)
cors = CORS(api)

createClientProperties = {
    "name": (str, "Name of the client", True),
    "surname": (str, "Surname of the client", True),
    "password": (str, "Password of the client", True),
    "birthday": (str, "Birthday of the client", True),
    "genre": (str, "Genre of the client", True),

    "phone": (str, "Phone number of the client", True),

    "email": (str, "Email of the client", True),

    "dpi": (str, "DPI of the client", True),

    "street": (str, "Street of the client", True),
    "city": (str, "City of the client", True),
    "state": (str, "State of the client", True),
    "country": (str, "Country of the client", True),
    "postal_code": (str, "Postal code of the client", True),

    "bank_uuid": (str, "UUID of the bank of the client", True),
}


@api.route("/zzz", methods=["GET"])
def client():
    return jsonify({
        "message": "Response from Client model"
    }), 200


@api.route("/create", methods=["POST"])
def createClient():
    data = request.get_json()

    valid, message = propChecker(createClientProperties, data)

    if not valid:
        return jsonify({
            "message": message
        }), 400

    thisClient = Node("Client", propFilter(
        data, ["name", "surname", "password", "birthday", "genre"]
    ))

    thisPhone = Node("Phone", propFilter(
        data, ["phone"]
    ))

    thisEmail = Node("Email", propFilter(
        data, ["email"]
    ))

    thisDPI = Node("DPI", propFilter(
        data, ["email"]
    ))

    thisAddress = Node("Address", propFilter(
        data, ["street", "city", "state", "country", "postal_code"]
    ))

    thisBank = Node("Bank", {
        "uuid": data["bank_uuid"]
    })
    thisBank.uuid = data["bank_uuid"]

    # First create the client
    thisClient.create()

    # Then merge the phone, email, dpi, address
    thisPhone.merge()
    thisEmail.merge()
    thisDPI.merge()
    thisAddress.merge()

    # Now create a relationship between the client and the phone, email, dpi, address, and bank
    try:
        Relationship(thisClient, thisPhone, "HAS_PHONE").create()
        Relationship(thisClient, thisEmail, "HAS_EMAIL").create()
        Relationship(thisClient, thisDPI, "HAS_DPI").create()
        Relationship(thisClient, thisAddress, "HAS_ADDRESS").create()
        Relationship(thisClient, thisBank, "HAS_BANK").create()
    except Exception as e:
        return str(e), 500

    return jsonify({
        "message": "Client created successfully",
        "uuid": thisClient.uuid
    }), 201


@api.route("/login", methods=["POST"])
def loginClient():
    data = request.get_json()

    valid, message = propChecker({
        "uuid": (str, "UUID of the client", True),
        "password": (str, "Password of the client", True)
    }, data)

    if not valid:
        return jsonify({
            "message": message
        }), 400

    thisClient = Node("Client", {
        "uuid": data["uuid"],
        "password": data["password"]
    })

    response = thisClient.match()

    if not response["success"]:
        return jsonify({
            "message": f"Client not found: {response['message']}",
            "match": False
        }), 404

    user = [node2Dict(record["n"]) for record in response["response"]]
    # Remove password from the response
    user[0].pop("password")

    return jsonify({
        "message": "Client found",
        "uuid": data["uuid"],
        "match": True,
        "user": user
    }), 200
