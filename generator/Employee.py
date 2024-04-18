import csv
from faker import Faker
import random
import uuid
import pandas as pd

# Read the banks CSV file into a DataFrame
banks_df = pd.read_csv("./generated_data/fake_bank.csv")
bank_uuids = banks_df['uuid'].tolist()

SAVE_PATH = "./generated_data/fake_employees.csv"
NUM_ROWS = 1000

fake = Faker()

fieldnames = ['uuid', 'name', 'surname', 'password', 'birthday', 'genre', 'phone', 'email', 'dpi', 'street', 'city', 'state', 'country', 'postal_code', 'bank_uuid', 'position', 'salary', 'since']

with open(SAVE_PATH, 'w', newline='') as csvfile:
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

    writer.writeheader()
    for _ in range(NUM_ROWS):
        writer.writerow({
            'name': fake.first_name(),
            'surname': fake.last_name(),
            'password': 'password123',
            'birthday': fake.date_of_birth(minimum_age=18, maximum_age=90).strftime('%Y-%m-%d'),
            'genre': random.choice(['Male', 'Female']),
            'phone': fake.phone_number(),
            'email': fake.email(),
            'dpi': fake.random_number(digits=13),
            'street': fake.street_address(),
            'city': fake.city(),
            'state': fake.state(),
            'country': fake.country(),
            'postal_code': fake.postcode(),
            'bank_uuid': random.choice(bank_uuids),
            'position': fake.job(),
            'salary': round(random.uniform(2000, 10000), 2),
            'since': fake.date_between(start_date='-10y', end_date='today').strftime('%Y-%m-%d'),
            'uuid': str(uuid.uuid4())  # Generate a UUID for the employee
        })
