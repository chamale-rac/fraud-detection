CREATE CONSTRAINT unique_legal_entity_and_name
FOR (b:Bank)
REQUIRE (b.legal_entity, b.name) IS NODE KEY;
