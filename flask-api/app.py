"""
@file app.py
@author Samuel Chamalé
@date 4/12/2024
@brief This file contains the main application (API).
"""

from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
app.config['CORS_HEADERS'] = 'Content-Type'

cors = CORS(app)


@app.route('/zzz', methods=['GET'])
def zzz():
    return 'Hello, World!'


if __name__ == '__main__':
    app.run(debug=True)