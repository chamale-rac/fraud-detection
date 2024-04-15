from .cur import cur as conn
from utils import dict2Cypher


class Relationship:
    def __init__(self, start_node, end_node, relationship_type, properties=None):
        self.start_node = start_node
        self.end_node = end_node
        self.relationship_type = relationship_type
        self.properties = dict2Cypher(properties) if properties else {}

    # REQUIREMENT: Creación de relación con propiedades
    # REQUIREMENT: Operación CREATE que cree una relación entre 2 nodos ya existentes
    # REQUIREMENT: La operación deberá incluir el tipo de la relación y mínimo 3 propiedades
    def create(self):
        query = f"MATCH (a:{self.start_node.label} {{uuid: '{self.start_node.uuid}'}}), (b:{self.end_node.label} {{uuid: '{self.end_node.uuid}'}}) CREATE (a)-[r:{self.relationship_type} {self.properties}]->(b) RETURN r"
        return conn.run(query)

    def match(self):
        query = f"MATCH (a:{self.start_node.label} {{uuid: '{self.start_node.uuid}'}})-[r:{self.relationship_type}]->(b:{self.end_node.label} {{uuid: '{self.end_node.uuid}'}}) RETURN r"
        return conn.run(query)

    def matchReturnB(self):
        query = f"MATCH (a:{self.start_node.label} {{uuid: '{self.start_node.uuid}'}})-[r:{self.relationship_type}]->(b:{self.end_node.label}) RETURN b"
        return conn.run(query)

    # REQUIREMENT: Eliminación de relaciones
    # REQUIREMENT: Operación que permita eliminar 1 relación
    def delete(self):
        query = f"MATCH (a:{self.start_node.label} {{uuid: '{self.start_node.uuid}'}})-[r:{self.relationship_type}]->(b:{self.end_node.label} {{uuid: '{self.end_node.uuid}'}}) DELETE r"
        return conn.run(query)

    # REQUIREMENT: Operación que permita eliminar múltiples relaciones al mismo tiempo
    def deleteMultiple(self, properties: dict):
        # This means not using the uuids, but some other properties
        query = f"MATCH (a:{self.start_node.label} {dict2Cypher(self.start_node.properties)}), (b:{self.end_node.label} {dict2Cypher(self.end_node.properties)}) WHERE r = {dict2Cypher(properties)} DELETE r"
        return conn.run(query)

    # REQUIREMENT: Gestión de relaciones (dirección, nodos y/o propiedades)
    # REQUIREMENT: Operación que permita agregar 1 o más propiedades a una relación
    # REQUIREMENT: Operación que permita agregar 1 o más propiedades a múltiples relaciones al mismo tiempo
    def addProperties(self, properties: dict):
        # This means not using the uuids, but some other properties
        query = f"MATCH (a:{self.start_node.label} {dict2Cypher(self.start_node.properties)}), (b:{self.end_node.label} {dict2Cypher(self.end_node.properties)}) WHERE r = {dict2Cypher(properties)} SET r += {dict2Cypher(properties)} RETURN r"
        return conn.run(query)

    # REQUIREMENT: Operación que permita realizar la actualización de 1 o más propiedades de la relación
    # REQUIREMENT: Operación que permita realizar la actualización de 1 o más propiedades de múltiples relaciones al mismo tiempo
    def updateProperties(self, properties: dict):
        # This does the same as addProperties, pues si la propiedad ya existe, la actualiza
        return self.addProperties(properties)

    # REQUIREMENT: Operación que permita eliminar 1 o más propiedades de una relación
    # REQUIREMENT: Operación que permita eliminar 1 o más propiedades de múltiples relaciones al mismo tiempo
    def deleteProperties(self, properties: list):
        # This means not using the uuids, but some other properties
        query = f"MATCH (a:{self.start_node.label} {dict2Cypher(self.start_node.properties)}), (b:{self.end_node.label} {dict2Cypher(self.end_node.properties)}) WHERE r = {dict2Cypher(properties)} REMOVE r.{', r.'.join(properties)} RETURN r"
        return conn.run(query)
