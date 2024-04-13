from n4jconn import n4jconn
import uuid

conn = n4jconn()


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


class Relationship:
    def __init__(self, start_node, end_node, relationship_type, properties=None):
        self.start_node = start_node
        self.end_node = end_node
        self.relationship_type = relationship_type
        self.properties = properties if properties else {}

    def create(self):
        query = f"MATCH (a:{self.start_node.label} {{uuid: '{self.start_node.uuid}'}}), (b:{self.end_node.label} {{uuid: '{self.end_node.uuid}'}}) CREATE (a)-[r:{self.relationship_type} {self.properties}]->(b) RETURN r"
        return conn.run(query)

    def match(self):
        query = f"MATCH (a:{self.start_node.label} {{uuid: '{self.start_node.uuid}'}})-[r:{self.relationship_type}]->(b:{self.end_node.label} {{uuid: '{self.end_node.uuid}'}}) RETURN r"
        return conn.run(query)

    def delete(self):
        query = f"MATCH (a:{self.start_node.label} {{uuid: '{self.start_node.uuid}'}})-[r:{self.relationship_type}]->(b:{self.end_node.label} {{uuid: '{self.end_node.uuid}'}}) DELETE r"
        return conn.run(query)


def propChecker(fields: dict, data: dict):
    for key, value in fields.items():
        expected_type, description, required = value
        if key not in data.keys():
            if required:
                return False, f"Missing required key: {key}, which is the {description}"
        else:
            if not isinstance(data[key], expected_type):
                return False, f"Incorrect type for key {key} ({description}): Expected {expected_type.__name__}, got {type(data[key]).__name__}"
    return True, "All properties are valid"


def propFilter(fields: dict, filter: list):
    return {k: v for k, v in fields.items() if k in filter}


def dict2Cypher(properties: dict):
    return '{' + ', '.join(f"{k}: '{v}'" for k, v in properties.items()) + '}'


def node2Dict(node):
    node_dict = {prop: node[prop] for prop in node.keys()}
    node_dict['labels'] = list(node.labels)
    return node_dict
