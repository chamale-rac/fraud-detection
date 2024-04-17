import csv
from faker import Faker
import random
import uuid
import pandas as pd

SAVE_PATH = "./generated_data/fake_accounts.csv"
NUM_ROWS = 2000

# Read the banks CSV file into a DataFrame
banks_df = pd.read_csv("./generated_data/fake_bank.csv")
banks_uuids = banks_df['uuid'].tolist()

clients_df = pd.read_csv("./generated_data/fake_clients.csv")
clients_uuids = clients_df['uuid'].tolist()

fake = Faker()

fieldnames = ['account_type', 'currency', 'user_uuid', 'bank_uuid', 'nickname', 'interest_rate', 'status', 'open_date', 'balance']

with open(SAVE_PATH, 'w', newline='') as csvfile:
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

    writer.writeheader()
    for _ in range(NUM_ROWS):

        accountType = random.choice(['Saving', 'Checking'])

        writer.writerow({
            'account_type': accountType,
            'currency': random.choice(['USD', 'EUR', 'GBP']),
            'user_uuid': random.choice(clients_uuids),  # Generate a UUID for the user
            'bank_uuid': random.choice(banks_uuids),
            'nickname': fake.word(),
            'interest_rate': fake.random_int(min=1, max=10) / 100,
            'status': random.choice(['Active', 'Inactive']),
            'open_date': fake.date_time_between(start_date='-1y', end_date='now'),
            'balance': fake.random_int(min=10, max=100000),
        })
