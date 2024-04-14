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
        query = f"MATCH (n:{self.label} {dict2Cypher(self.properties)}) DELETE n"
        return conn.run(query)

    def getAll(self):
        query = f"MATCH (n:{self.label}) RETURN n"
        return conn.run(query)

    # REQUIREMENT: Operación que permita agregar 1 o más propiedades a un nodo
    # REQUIREMENT: Operación que permita agregar 1 o más propiedades a múltiples nodos al mismo tiempo
    def addProperties(self, properties: dict):
        query = f"MATCH (n:{self.label} {dict2Cypher(self.properties)}) SET n += {dict2Cypher(properties)} RETURN n"
        return conn.run(query)

    # REQUIREMENT: Operación que permita realizar la actualización de 1 o más propiedades de un nodo
    # REQUIREMENT: Operación que permita realizar la actualización de 1 o más propiedades de múltiples nodos al mismo tiempo
    def updateProperties(self, properties: dict):
        # Hace lo mismo que addProperties, pues si la propiedad ya existe, la actualiza
        return self.addProperties(properties)

    # REQUIREMENT: Operación que permita eliminar 1 o mas propiedades de un nodo
    # REQUIREMENT: Operación que permita eliminar 1 o más propiedades de múltiples nodos al mismo tiempo
    def deleteProperties(self, properties: list):
        query = f"MATCH (n:{self.label} {dict2Cypher(self.properties)}) REMOVE n.{', n.'.join(properties)} RETURN n"
        return conn.run(query)

    # REQUIREMENT: Eliminación de nodos
    # REQUIREMENT: Operación que permita eliminar 1 nodo
    # REQUIREMENT: Operación que permita eliminar múltiples nodos al mismo tiempo
    def delete(self):
        query = f"MATCH (n:{self.label} {dict2Cypher(self.properties)}) DELETE n"
        return conn.run(query)
