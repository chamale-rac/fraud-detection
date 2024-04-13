import os
import logging
from dotenv import load_dotenv
from neo4j import GraphDatabase


class Neo4jConnection:
    def __init__(self):
        load_dotenv(".env")

        self._uri = os.getenv("NEO4J_URI")
        self._username = os.getenv("NEO4J_USER")
        self._password = os.getenv("NEO4J_PASSWORD")

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
        if self._driver:
            self._driver.close()
            logging.info("Driver closed.")

    def query(self, query, parameters=None, db="neo4j"):
        if self._driver is None:
            raise RuntimeError("Driver not initialized, query cannot be run.")

        response = None
        try:
            with self._driver.session(database=db) as session:
                response = list(session.run(query, parameters))
        except Exception as e:
            logging.error(f"Query failed: {e}")
            raise

        return response
