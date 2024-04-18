"""
@file n4jconn.py
@author Samuel Chamalé
@date 4/12/2024
@brief This file contains the class n4jconn, which is used to connect to the Neo4j database.
"""

import os
import logging
from dotenv import load_dotenv
from neo4j import GraphDatabase
from neo4j.exceptions import ConstraintError


class n4jconn:
    """
    @class Neo4jConnection
    @brief This class is used to connect to the Neo4j database.
    """

    def __init__(self):
        load_dotenv(".env")

        self._uri = os.getenv("FRAUD_DATABASE_URI")
        self._username = os.getenv("FRAUD_DATABASE_USER")
        self._password = os.getenv("FRAUD_DATABASE_PASSWORD")

        if not all([self._uri, self._username, self._password]):
            raise ValueError("Missing necessary environment variables.")

        self._driver = None
        try:
            self._driver = GraphDatabase.driver(
                self._uri, auth=(self._username, self._password))
            logging.info("Driver created.")
        except Exception as e:
            logging.error(f"Failed to create the driver: {e}")
            raise

    def close(self):
        """
        @fn close
        @brief This function closes the driver.
        """
        if self._driver:
            self._driver.close()
            logging.info("Driver closed.")

    from neo4j.exceptions import ConstraintError

    def run(self, query, parameters=None, db="neo4j"):
        """
        @fn query
        @brief This function runs a query on the database.
        @param query The query to run.
        @param parameters The parameters to pass to the query.
        @param db The database to run the query on.
        """
        if self._driver is None:
            raise RuntimeError("Driver not initialized, query cannot be run.")

        success = True
        message = "Query executed successfully"
        response = None
        try:
            with self._driver.session(database=db) as session:
                response = list(session.run(query, parameters))
        except ConstraintError as e:
            success = False
            message = "ConstraintError: " + str(e)
            logging.error(f"Query failed: {e}")
        except Exception as e:
            success = False
            message = "An error occurred: " + str(e)
            logging.error(f"Query failed: {e}")

        return {"success": success, "message": message, "response": response}

    def transaction(self, queries, db="neo4j"):
        """
        @fn transaction
        @brief This function runs a transaction on the database.
        @param queries The queries to run.
        @param db The database to run the transaction on.
        """
        if self._driver is None:
            raise RuntimeError(
                "Driver not initialized, transaction cannot be run.")

        success = True
        message = "Transaction executed successfully"
        response = None
        try:
            with self._driver.session(database=db) as session:
                response = session.write_transaction(
                    lambda tx: [tx.run(query) for query in queries])
        except ConstraintError as e:
            success = False
            message = "ConstraintError: " + str(e)
            logging.error(f"Transaction failed: {e}")
        except Exception as e:
            success = False
            message = "An error occurred: " + str(e)
            logging.error(f"Transaction failed: {e}")

        return {"success": success, "message": message, "response": response}
