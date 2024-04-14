from .cur import cur as conn
from utils import dict2Cypher
import uuid


class Node:
    def __init__(self, label, properties: dict):
        self.label = label
        self.properties = properties
        self.uuid = str(uuid.uuid4())

    def create(self):
        properties = self.properties
        properties['uuid'] = self.uuid
        query = f"CREATE (n:{self.label} {dict2Cypher(properties)})"
        return conn.run(query)

    def merge(self):
        query = f"""
        MERGE (n:{self.label} {dict2Cypher(self.properties)})
        ON CREATE SET n.uuid = '{self.uuid}'
        RETURN n.uuid as uuid
        """
        response = conn.run(query)
        self.uuid = response["response"][0]['uuid']
        return response

    def match(self):
        query = f"MATCH (n:{self.label} {dict2Cypher(self.properties)}) RETURN n"
        return conn.run(query)

    def delete(self):
        query = f"MATCH (n:{self.label} {self.properties}) DELETE n"
        return conn.run(query)

    def getAll(self):
        query = f"MATCH (n:{self.label}) RETURN n"
        return conn.run(query)
