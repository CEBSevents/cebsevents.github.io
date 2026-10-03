import pandas as pd

# Create a Pandas Excel writer for the raw data
writer = pd.ExcelWriter('Detailed_Raw_Club_Budgets.xlsx', engine='openpyxl')

# 1. SAMAVAYA CENTRAL (Raw, unedited from 2026-27 proposal)
samavaya_data = {
    'Specification': ['Hall Booking', 'Rental Sound and Lights', 'Photography / Videography', 'Decoration', 'Food / Refreshments (Gala Dinner)', 'Pro-show', 'Miscellaneous', 'TOTAL'],
    '2023-24 (INR)': [25000, 60000, 65000, 20000, 10000, 45000, 15000, 240000],
    '2024-25 (INR)': [20000, 60000, 50000, 50000, 150000, 26430, 10000, 366430],
    '2025-26 (INR)': [20000, 60000, 50000, 30000, 150000, 50000, 10000, 370000], # Approved budget
    '2026-27 (INR)': [22000, 90000, 88500, 70000, 210000, 40000, 50000, 570500]  # Raw proposed budget
}
pd.DataFrame(samavaya_data).to_excel(writer, sheet_name='Samavaya Central', index=False)

# 2. ART CLUB (Raw, includes Fashion Show)
art_data = {
    'Specification': ['Craft Equipment', 'Decoration (Fests and Festivals)', 'Pre-event / IICM Fashion Design / Selection', 'Workshop', 'Gifts / Prizes / Snacks', 'Club Events / Pixel Art', 'Replenishment of Art Supplies', 'Costumes / Set Designing', 'Banners and Posters', 'Miscellaneous', 'TOTAL'],
    '2023-24 (INR)': [70550, 40000, 35000, 0, 10000, 0, 0, 20000, 5000, 10000, 190550],
    '2024-25 (INR)': [60000, 0, 0, 15000, 10000, 0, 0, 0, 0, 5000, 90000],
    '2025-26 (INR)': [35000, 8000, 0, 35000, 6000, 6000, 10000, 0, 0, 0, 100000],
    '2026-27 (INR)': [35000, 8000, 50000, 0, 6000, 8000, 10000, 0, 0, 3000, 117000]
}
pd.DataFrame(art_data).to_excel(writer, sheet_name='Art Club', index=False)

# 3. CINEMATOGRAPHY (Raw, includes IICM Film)
cinemato_data = {
    'Specification': ['Equipment (Lights, Mic, Screen, SSD)', 'SAMAVĀYA Film (Props, Costumes, Travel, Snacks)', 'Workshop / Masterclass', 'Competition Awards / Club Events', 'IICM - Film Requirements', 'Miscellaneous (Festivals, etc.)', 'TOTAL'],
    '2023-24 (INR)': [0, 0, 0, 0, 0, 0, 0],
    '2024-25 (INR)': [33000, 21000, 0, 0, 0, 0, 54000],
    '2025-26 (INR)': [13000, 7000, 2500, 2000, 5000, 5500, 35000],
    '2026-27 (INR)': [18000, 16000, 7500, 0, 6000, 3500, 51000]
}
pd.DataFrame(cinemato_data).to_excel(writer, sheet_name='Cinematography', index=False)

# 4. DANCE (Raw, includes Coach)
dance_data = {
    'Specification': ['Costumes (SAMAVAYA + IINCICM)', 'Accessories & Makeup', 'Professional Coaches (IINCICM)', 'Workshop', 'Miscellaneous & Event Logistics', 'TOTAL'],
    '2023-24 (INR)': [40000, 4000, 0, 0, 0, 44000],
    '2024-25 (INR)': [30000, 20000, 0, 40000, 5000, 95000],
    '2025-26 (INR)': [23000, 12000, 0, 30000, 0, 65000],
    '2026-27 (INR)': [35000, 33000, 68000, 0, 5000, 141000]
}
pd.DataFrame(dance_data).to_excel(writer, sheet_name='Dance Club', index=False)

# 5. E-GAME (Unchanged)
egame_data = {
    'Specification': ['Equipment (HDMI, USB, Strips, Controllers, HDD, etc.)', 'Board Games', 'Snacks', 'Trophies and Prizes', 'Club T-Shirts', 'Miscellaneous', 'TOTAL'],
    '2023-24 (INR)': [0, 0, 0, 0, 0, 0, 0],
    '2024-25 (INR)': [14440, 16490, 2000, 2000, 9000, 1000, 44930],
    '2025-26 (INR)': [4600, 5400, 850, 2000, 0, 16150, 29000],
    '2026-27 (INR)': [10578, 12350, 0, 2000, 14527, 6000, 45455]
}
pd.DataFrame(egame_data).to_excel(writer, sheet_name='E-Game', index=False)

# 6. LITERATURE (Unchanged)
lit_data = {
    'Specification': ['Books for Inventory', 'Newsletter / Maintenance / Printing', 'Prizes / Literary Events Award', 'Club Activities / Snacks', 'Miscellaneous', 'TOTAL'],
    '2023-24 (INR)': [0, 0, 15000, 0, 43000, 58000],
    '2024-25 (INR)': [25000, 20000, 10000, 5000, 2000, 62000],
    '2025-26 (INR)': [20000, 5000, 10000, 5000, 17000, 57000],
    '2026-27 (INR)': [20000, 0, 3000, 21000, 18000, 62000]
}
pd.DataFrame(lit_data).to_excel(writer, sheet_name='Literature', index=False)

# 7. MUSIC (Unchanged)
music_data = {
    'Specification': ['New Instruments (Keyboard, Amplifier, Harmonium, etc.)', 'Repairs', 'Cables (XLR, AUX)', 'Wireless Mic with Receiver', 'Workshop', 'Miscellaneous', 'TOTAL'],
    '2023-24 (INR)': [35000, 18000, 0, 0, 0, 10000, 63000],
    '2024-25 (INR)': [43000, 16000, 4000, 4000, 20000, 12000, 99000],
    '2025-26 (INR)': [45000, 20000, 2000, 16000, 2000, 8000, 93000],
    '2026-27 (INR)': [51500, 0, 5000, 0, 10000, 33700, 100200]
}
pd.DataFrame(music_data).to_excel(writer, sheet_name='Music', index=False)

# 8. THEATRE (Raw, includes IINCICM Coach, Costume, Sets)
theatre_data = {
    'Specification': ['Coach Appointment (IINCICM)', 'Costume (IINCICM + SAMAVAYA)', 'Workshop', 'Stage Plays / Skits / Competitions', 'Set Designing (IINCICM + SAMAVAYA)', 'Makeup and Jewellery (IINCICM + SAMAVAYA)', 'Miscellaneous', 'TOTAL'],
    '2023-24 (INR)': [0, 0, 0, 0, 0, 0, 0, 0],
    '2024-25 (INR)': [0, 10000, 10000, 23000, 5000, 4000, 3000, 55000],
    '2025-26 (INR)': [0, 10000, 10000, 0, 10000, 5000, -15000, 20000], # Balancing to the 20k comparative total
    '2026-27 (INR)': [40000, 20000, 10000, 0, 10000, 10000, 3700, 93700] 
}
pd.DataFrame(theatre_data).to_excel(writer, sheet_name='Theatre', index=False)

# 9. IINCICM (Raw from PDF)
iincicm_data = {
    'Specification': ['Train Tickets (Ongoing & Return)', 'Meals / Breakfast on Train', 'Bus Fare', 'Team Jersey', 'Short Film Expenses', 'Music / Canvas Painting Accessories', 'Theatre Costumes and Set Design', 'Dance Costumes and Makeup', 'Fashion Design', 'Coaches (Dance, Theatre)', 'Registration', 'Room Rent', 'Food', 'Contingency', 'TOTAL'],
    '2023-24 (INR)': [190000, 0, 0, 0, 0, 75000, 65000, 0, 0, 110000, 200000, 36000, 36000, 5000, 717000],
    '2024-25 (INR)': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    '2025-26 (INR)': [108000, 42000, 30000, 0, 0, 0, 20000, 0, 50000, 40000, 250000, 48000, 72000, 10000, 670000],
    '2026-27 (INR)': [108000, 42000, 30000, 60000, 6000, 10000, 20000, 20000, 40000, 108000, 300000, 96000, 120000, 10000, 970000]
}
pd.DataFrame(iincicm_data).to_excel(writer, sheet_name='IINCICM', index=False)

# 10. IISM / SPORTS (Unchanged)
iism_data = {
    'Specification': ['Sports Equipment', 'Sports Jersey', 'Coaching Fee', 'Travel Expenditure', 'Registration & Accommodation', 'Medical Equipment', 'Ragnarok', 'Contingencies / Upgd', 'TOTAL'],
    '2023-24 (INR)': [170000, 150000, 122000, 175000, 310000, 0, 30000, 5000, 962000],
    '2024-25 (INR)': [65000, 125000, 0, 50000, 510000, 0, 15000, 5000, 770000],
    '2025-26 (INR)': [0, 0, 0, 0, 950000, 0, 0, 0, 950000],
    '2026-27 (INR)': [60620, 110000, 60000, 170000, 600000, 12000, 10000, 15000, 1037620]
}
pd.DataFrame(iism_data).to_excel(writer, sheet_name='Sports & IISM', index=False)

# 11. SCIENCE & E-CELL (Unchanged)
science_data = {
    'Specification': ['Science Club', 'E-Cell', 'TOTAL'],
    '2023-24 (INR)': [55000, 0, 55000],
    '2024-25 (INR)': [55000, 0, 55000],
    '2025-26 (INR)': [50000, 0, 50000],
    '2026-27 (INR)': [74000, 62993, 136993]
}
pd.DataFrame(science_data).to_excel(writer, sheet_name='Science & E-Cell', index=False)

writer.close()
