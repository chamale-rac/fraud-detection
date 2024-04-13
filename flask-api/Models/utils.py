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
        query = f"CREATE (n:{self.label} {self.properties})"
        return conn.run(query)

    def merge(self):
        query = f"MERGE (n:{self.label} {self.properties})"
        return conn.run(query)

    def match(self):
        query = f"MATCH (n:{self.label} {self.properties}) RETURN n"
        return conn.run(query)

    def delete(self):
        query = f"MATCH (n:{self.label} {self.properties}) DELETE n"
        return conn.run(query)


def checker(requiredFields: dict, data: dict):
    for key, value in requiredFields.items():
        expected_type, description, required = value
        if key not in data.keys():
            if required:
                return f"Missing required key: {key}, which is the {description}"
        else:
            if not isinstance(data[key], expected_type):
                return f"Incorrect type for key {key} ({description}): Expected {expected_type.__name__}, got {type(data[key]).__name__}"
    return True
