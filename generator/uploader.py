from n4jconn import n4jconn

uploadBank = """
LOAD CSV WITH HEADERS FROM 'https://raw.githubusercontent.com/chamale-rac/fraud-detection/main/generator/generated_data/fake_bank.csv' AS row
CREATE (b:Bank {
    uuid: row.uuid,
    name: row.name,
    country: row.country,
    estimated_value: toInteger(row.estimated_value),
    established: row.established,
    category: row.category,
    legal_entity: row.legal_entity
})
"""

uploadEmployee = """
LOAD CSV WITH HEADERS FROM 'https://raw.githubusercontent.com/chamale-rac/fraud-detection/main/generator/generated_data/fake_employees.csv' AS row
MATCH (b:Bank {uuid: row.bank_uuid})
CREATE (e:Employee {
    uuid: row.uuid,
    name: row.name,
    surname: row.surname,
    password: row.password,
    birthday: row.birthday,
    genre: row.genre,
    phone: row.phone,
    email: row.email,
    dpi: row.dpi,
    street: row.street,
    city: row.city,
    state: row.state,
    country: row.country,
    postal_code: row.postal_code
})<-[:HAS_EMPLOYEE {position: row.position, salary: toFloat(row.salary), since: row.since}]-(b)
"""

uploadClient = """
LOAD CSV WITH HEADERS FROM 'https://raw.githubusercontent.com/chamale-rac/fraud-detection/main/generator/generated_data/fake_clients.csv' AS row
MATCH (b:Bank {uuid: row.bank_uuid}), (e:Employee {uuid: row.employee_uuid})
CREATE (c:Client {
    uuid: row.uuid,
    name: row.name,
    surname: row.surname,
    password: row.password,
    birthday: row.birthday,
    genre: row.genre,
    phone: row.phone,
    email: row.email,
    dpi: row.dpi,
    street: row.street,
    city: row.city,
    state: row.state,
    country: row.country,
    postal_code: row.postal_code,
    work_related_tags: split(row.work_related_tags, ","),
    declared_income: toFloat(row.declared_income),
    active: true
})<-[:HAS_CLIENT]-(b),
   (e)-[:REGISTER_CLIENT]->(c)
"""

uploadAccount = """
LOAD CSV WITH HEADERS FROM 'https://raw.githubusercontent.com/chamale-rac/fraud-detection/main/generator/generated_data/fake_accounts.csv' AS row
MATCH (b:Bank {uuid: row.bank_uuid}), (c:Client {uuid: row.user_uuid})
CREATE (a:Account {
  account_type: row.account_type,
  currency: row.currency,
  nickname: row.nickname,
  interest_rate: toFloat(row.interest_rate),
  status: row.status,
  open_date: row.open_date,
  balance: toFloat(row.balance)
})<-[:OWNS_ACCOUNT]-(c),
   (b)-[:HAS_ACCOUNT]->(a)
"""

uploadSomeRelationsClients = """
LOAD CSV WITH HEADERS FROM 'https://raw.githubusercontent.com/chamale-rac/fraud-detection/main/generator/generated_data/fake_clients.csv' AS row
MATCH (c:Client {uuid: row.uuid})
MERGE (d:DPI {value: row.dpi})
MERGE (e:Email {value: row.email})
MERGE (p:Phone {value: row.phone})
MERGE (a:Address {street: row.street, city: row.city, state: row.state, country: row.country, postal_code: row.postal_code})
CREATE (c)-[:HAS_DPI]->(d)
CREATE (c)-[:HAS_EMAIL]->(e)
CREATE (c)-[:HAS_PHONE]->(p)
CREATE (c)-[:HAS_ADDRESS]->(a)
"""

uploadSomeRelationsEmployees = """
LOAD CSV WITH HEADERS FROM 'https://raw.githubusercontent.com/chamale-rac/fraud-detection/main/generator/generated_data/fake_employees.csv' AS row
MATCH (emp:Employee {uuid: row.uuid})
MERGE (d:DPI {value: row.dpi})
MERGE (e:Email {value: row.email})
MERGE (p:Phone {value: row.phone})
MERGE (a:Address {street: row.street, city: row.city, state: row.state, country: row.country, postal_code: row.postal_code})
CREATE (emp)-[:HAS_DPI]->(d)
CREATE (emp)-[:HAS_EMAIL]->(e)
CREATE (emp)-[:HAS_PHONE]->(p)
CREATE (emp)-[:HAS_ADDRESS]->(a)
"""

conn = n4jconn()


def uploadData():
    print("Uploading data...")
    print("This may take a while...")
    print("Uploading banks...")
    conn.run(uploadBank)
    print("Uploading employees...")
    conn.run(uploadEmployee)
    print("Uploading clients...")
    conn.run(uploadClient)
    print("Uploading accounts...")
    conn.run(uploadAccount)
    print("Uploading some relations...")
    conn.run(uploadSomeRelationsClients)
    conn.run(uploadSomeRelationsEmployees)


uploadData()
