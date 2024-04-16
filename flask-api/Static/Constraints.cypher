CREATE CONSTRAINT unique_legal_entity_and_name
FOR (b:Bank)
REQUIRE (b.legal_entity, b.name) IS NODE KEY;

CREATE CONSTRAINT unique_bank_uuid_and_dpi_uuid
FOR (b:Client)
REQUIRE (b.bank_uuid, b.dpi_uuid) IS NODE KEY;

CREATE CONSTRAINT unique_bank_uuid_and_dpi_uuid_employee
FOR (b:Employee)
REQUIRE (b.bank_uuid, b.dpi_uuid) IS NODE KEY;
