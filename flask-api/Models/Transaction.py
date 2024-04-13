"""
@file Transaction.py
@author Samuel Chamalé
@date 4/12/2024
@brief This file contains the Transaction model and its methods.
"""

from flask import Blueprint, request
from flask_cors import CORS
from utils import Node, checker

api = Blueprint("transaction", __name__)
cors = CORS(api)

CashInTransactionProperties = {
    "amount": (float, "Amount of the transaction", True),
    "fraud": (bool, "Fraud status of the transaction", True),
    "date": (str, "Date of the transaction", True),
}
