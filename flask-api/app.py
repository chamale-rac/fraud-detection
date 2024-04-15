"""
@file app.py
@author Samuel Chamalé
@date 4/12/2024
@brief This file contains the main application (API).
"""

from flask import Flask
from flask_cors import CORS

from Models.Bank import api as bank_api
from Models.Client import api as client_api
from Models.Account import api as account_api
from Models.Employee import api as employee_api

app = Flask(__name__)
app.config['CORS_HEADERS'] = 'Content-Type'


cors = CORS(app)
app.register_blueprint(bank_api, url_prefix='/bank')
app.register_blueprint(client_api, url_prefix='/client')
app.register_blueprint(account_api, url_prefix='/account')
app.register_blueprint(employee_api, url_prefix='/employee')


@app.route('/zzz', methods=['GET'])
def zzz():
    return 'Connection successful', 200


if __name__ == '__main__':
    app.run(debug=True)
