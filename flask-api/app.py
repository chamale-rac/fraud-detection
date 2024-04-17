"""
@file app.py
@author Samuel Chamalé
@date 4/12/2024
@brief This file contains the main application (API).
"""

from flask import Flask
from flask_cors import CORS

from Routes.Bank import api as bank_api
from Routes.Client import api as client_api
from Routes.Account import api as account_api
from Routes.Employee import api as employee_api
from Routes.Transaction import api as transaction_api
from Routes.helpers import api as helpers_api
from Routes.Admin import api as admin_api

app = Flask(__name__)
app.config['CORS_HEADERS'] = 'Content-Type'


cors = CORS(app)
app.register_blueprint(bank_api, url_prefix='/bank')
app.register_blueprint(client_api, url_prefix='/client')
app.register_blueprint(account_api, url_prefix='/account')
app.register_blueprint(employee_api, url_prefix='/employee')
app.register_blueprint(transaction_api, url_prefix='/transaction')
app.register_blueprint(helpers_api, url_prefix='/helpers')
app.register_blueprint(admin_api, url_prefix='/admin')


@app.route('/zzz', methods=['GET'])
def zzz():
    return 'Connection successful', 200


if __name__ == '__main__':
    app.run(debug=True)
