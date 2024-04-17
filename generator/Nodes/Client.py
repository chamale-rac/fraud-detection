import csv
from faker import Faker
import random
import uuid
import pandas as pd

# Read the banks CSV file into a DataFrame
banks_df = pd.read_csv("./generated_data/fake_bank.csv")
banks_uuids = banks_df['uuid'].tolist()

employees_df = pd.read_csv("./generated_data/fake_employees.csv")
employees_uuids = employees_df['uuid'].tolist()

SAVE_PATH = "./generated_data/fake_clients.csv"
NUM_ROWS = 2000

fake = Faker()

fieldnames = ['uuid', 'name', 'surname', 'password', 'birthday', 'genre', 'phone', 'email', 'dpi', 'street', 'city', 'state', 'country', 'postal_code', 'bank_uuid', 'employee_uuid', 'work_related_tags', 'declared_income']

with open(SAVE_PATH, 'w', newline='') as csvfile:
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

    writer.writeheader()
    for _ in range(NUM_ROWS):
        writer.writerow({
            'uuid': str(uuid.uuid4()),  # Generate a UUID in the format specified
            'name': fake.first_name(),
            'surname': fake.last_name(),
            'password': 'password123',
            'birthday': fake.date_of_birth(minimum_age=18, maximum_age=90).strftime('%Y-%m-%d'),
            'genre': random.choice(['Male', 'Female']),
            'phone': fake.phone_number(),
            'email': fake.email(),
            'dpi': fake.random_number(digits=9),
            'street': fake.street_address(),
            'city': fake.city(),
            'state': fake.state(),
            'country': fake.country(),
            'postal_code': fake.postcode(),
            'bank_uuid': random.choice(banks_uuids),
            'employee_uuid': random.choice(employees_uuids),
            'work_related_tags': random.sample(["agriculture", "textile", "finance", "education", "technology"], k=random.randint(1, 3)),
            'declared_income': round(random.uniform(100, 10000), 2)
        })
