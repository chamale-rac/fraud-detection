"""
@file Bank.py
@author Samuel Chamalé
@date 4/12/2024
@brief This file contains the Bank model and its methods.
"""
from flask import Blueprint, request, jsonify
from flask_cors import CORS
from utils import propChecker, node2Dict
from Generics import Node, Relationship

Node = Node.Node
Relationship = Relationship.Relationship

api = Blueprint("bank", __name__)
cors = CORS(api)

createBankProperties = {
    'name': (str, 'Name of the bank', True),
    'country':  (str, 'Country of the bank', True),
    'estimated_value':  (int, 'Estimated value of the bank', True),
    'established':  (int, 'Year the bank was established', True),
    'category':  (str, 'Category of the bank', True),
    'legal_entity':  (str, 'Legal entity of the bank', True),
}


@api.route('/zzz', methods=['GET'])
def bank():
    return jsonify({
        'message': 'Response from Bank model'
    }), 200


@api.route('/create', methods=['POST'])
def createBank():
    data = request.get_json()

    valid, message = propChecker(createBankProperties, data)

    if not valid:
        return jsonify({
            'message': message
        }), 400

    newBank = Node("Bank", data)

    response = newBank.create()

    if not response["success"]:
        return jsonify({
            'message': f'Failed to create bank with error: {response["message"]}'
        }), 400

    return jsonify({
        'message': 'Bank created successfully',
        'uuid': newBank.uuid
    }), 201

# Get all banks


@api.route('/get_all', methods=['GET'])
def allBanks():
    allBanks = Node("Bank", {})
    response = allBanks.getAll()

    if not response["success"]:
        return jsonify({
            'message': f'Failed to get all banks with error: {response["message"]}'
        }), 400

    banks = [node2Dict(record['n']) for record in response["response"]]

    return jsonify({
        'message': 'All banks',
        'banks': banks
    }), 200
