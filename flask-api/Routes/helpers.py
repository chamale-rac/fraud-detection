"""
@file helpers.py
@author Samuel Chamalé
@date 4/16/2024
@brief This file contains helper functions for the API.
"""

from flask import Blueprint, request, jsonify
from flask_cors import CORS
from Generics import cur
from utils import propFilter, propChecker, node2Dict

conn = cur.cur

api = Blueprint("helpers", __name__)
cors = CORS(api)


@api.route("/zzz", methods=["GET"])
def helpers():
    return jsonify({
        "message": "Response from helpers"
    }), 200


@api.route("/simple_search", methods=["POST"])
def simpleSearch():
    data = request.get_json()

    valid, message = propChecker({
        "property": (str, "Property to search", True),
        "value": (str, "Value to search", True),
        "node_type": (str, "Type of the node to search", True)
    }, data)

    if not valid:
        return jsonify({
            "message": message
        }), 400

    query = f"""
    MATCH (n:{data["node_type"]})
    WHERE n.{data["property"]} CONTAINS '{data["value"]}'
    RETURN n
    """

    response = conn.run(query)

    if not response["success"] or len(response["response"]) == 0:
        return jsonify({
            "message": f"Client not found: {response['message']}"
        }), 404

    return jsonify({
        "message": "Found",
        "nodes": [node2Dict(record["n"]) for record in response["response"]]
    }), 200
