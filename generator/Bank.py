"""
@file Bank.py
@author Samuel Chamalé
@date 4/12/2024
@brief This file contains the Bank fake data generator.
@execution python Bank.py outputfile numrows
"""

import csv
from faker import Faker

SAVE_PATH = "./generated_data/fake_bank.csv"
AMOUNT = 100

fake = Faker()

fieldnames = ['uuid', 'name', 'country', 'estimated_value',
            'established', 'category', 'legal_entity']

with open(SAVE_PATH, 'w', newline='') as csvfile:
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

    writer.writeheader()
    for _ in range(AMOUNT):
        writer.writerow({
            'uuid': fake.uuid4(),
            'name': fake.company(),
            'country': fake.country(),
            'estimated_value': fake.random_int(min=1000000, max=100000000),
            'established': fake.year(),
            'category': fake.job(),
            'legal_entity': fake.company_suffix()
        })
