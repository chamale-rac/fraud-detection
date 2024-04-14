from .cur import cur as conn
from utils import dict2Cypher


class Relationship:
    def __init__(self, start_node, end_node, relationship_type, properties=None):
        self.start_node = start_node
        self.end_node = end_node
        self.relationship_type = relationship_type
        self.properties = dict2Cypher(properties) if properties else {}

    def create(self):
        query = f"MATCH (a:{self.start_node.label} {{uuid: '{self.start_node.uuid}'}}), (b:{self.end_node.label} {{uuid: '{self.end_node.uuid}'}}) CREATE (a)-[r:{self.relationship_type} {self.properties}]->(b) RETURN r"
        return conn.run(query)

    def match(self):
        query = f"MATCH (a:{self.start_node.label} {{uuid: '{self.start_node.uuid}'}})-[r:{self.relationship_type}]->(b:{self.end_node.label} {{uuid: '{self.end_node.uuid}'}}) RETURN r"
        return conn.run(query)

    def delete(self):
        query = f"MATCH (a:{self.start_node.label} {{uuid: '{self.start_node.uuid}'}})-[r:{self.relationship_type}]->(b:{self.end_node.label} {{uuid: '{self.end_node.uuid}'}}) DELETE r"
        return conn.run(query)
