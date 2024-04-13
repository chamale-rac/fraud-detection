"""
@file Bank.py
@author Samuel Chamalé
@date 4/12/2024
@brief This file contains the Bank model and its methods.
"""
from flask import Blueprint, request
from flask_cors import CORS
from utils import Node, checker

api = Blueprint("bank", __name__)
cors = CORS(api)

BankProperties = {
    'name': (str, 'Name of the bank', True),
    'country':  (str, 'Country of the bank', True),
    'estimated_value':  (int, 'Estimated value of the bank', True),
    'established':  (int, 'Year the bank was established', True),
    'category':  (str, 'Category of the bank', True),
}


@api.route('/zzz', methods=['GET'])
def bank():
    return 'Response from Bank model'


@api.route('/new', methods=['POST'])
def createBank():
    data = request.get_json()

    valid, message = checker(BankProperties, data)

    if not valid:
        return message, 400

    newBank = Node('Bank', data)

    creation = newBank.create()

    if not creation:
        return 'Failed to create bank', 500

    return 'Bank created successfully', 201
