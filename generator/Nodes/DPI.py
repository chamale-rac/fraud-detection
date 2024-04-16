"""
@file DPI.py
@author Samuel Chamalé
@date 4/12/2024
@brief This file contains the DPI fake data generator.
@execution python DPI.py outputfile numrows
"""

import csv
from faker import Faker

SAVE_PATH = "./generated_data/fake_dpi.csv"
AMOUNT = 1500

fake = Faker()

"""
<id>: 10
dpi: "1234567890122"
uuid: "6c344a64-ec29-4fcb-8549-c821d8c86fc8"
"""

fieldnames = ['dpi', 'uuid']

with open(SAVE_PATH, 'w', newline='') as csvfile:
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

    writer.writeheader()
    for _ in range(AMOUNT):
        writer.writerow({
            'dpi': fake.unique.random_int(min=1000000000000, max=9999999999999),
            'uuid': fake.uuid4()
        })
