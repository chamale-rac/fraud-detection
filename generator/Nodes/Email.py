"""
@file Email.py
@author Samuel Chamalé
@date 4/12/2024
@brief This file contains the Email fake data generator.
@execution python Email.py outputfile numrows
"""

import csv
from faker import Faker

SAVE_PATH = "./generated_data/fake_email.csv"
AMOUNT = 100

fake = Faker()

"""
<id>: 3
uuid: "b0b7d061-8d56-40d5-8957-562a380afb8d"
email: "john.doe@example.com"
"""

fieldnames = ['email', 'uuid']

with open(SAVE_PATH, 'w', newline='') as csvfile:
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

    writer.writeheader()
    for _ in range(AMOUNT):
        writer.writerow({
            'email': f"fake_email{_}@fake.com",
            'uuid': fake.uuid4()
        })
