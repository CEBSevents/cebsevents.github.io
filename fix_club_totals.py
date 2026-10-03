import re
import os

files = [
    r"c:\Users\Legion\Website\Samavaya and Cultural Clubs 2026-27.html",
    r"c:\Users\Legion\Website\BUDGET2026-27.html"
]

def update_samavaya(content):
    # Overall comparison table 25-26 and 26-27 modifications
    content = content.replace(
        '<tr><td>&nbsp;&nbsp;Hall Booking</td><td class="num">25,000</td><td class="num">20,000</td><td class="num">20,000</td><td class="num">22,000</td></tr>',
        '<tr><td>&nbsp;&nbsp;Hall Booking</td><td class="num">25,000</td><td class="num">20,000</td><td class="num">20,000</td><td class="num">22,000</td></tr>'
    )
    content = content.replace(
        '<tr><td>&nbsp;&nbsp;Rental Sound and Lights</td><td class="num">60,000</td><td class="num">60,000</td><td class="num">90,000</td><td class="num">90,000</td></tr>',
        '<tr><td>&nbsp;&nbsp;Rental Sound and Lights</td><td class="num">60,000</td><td class="num">60,000</td><td class="num">60,000</td><td class="num">66,000</td></tr>'
    )
    content = content.replace(
        '<tr><td>&nbsp;&nbsp;Decoration</td><td class="num">20,000</td><td class="num">50,000</td><td class="num">70,000</td><td class="num">70,000</td></tr>',
        '<tr><td>&nbsp;&nbsp;Decoration</td><td class="num">20,000</td><td class="num">50,000</td><td class="num">30,000</td><td class="num">33,000</td></tr>'
    )
    content = content.replace(
        '<tr><td>&nbsp;&nbsp;Gala Dinner</td><td class="num">1,60,000</td><td class="num">1,50,000</td><td class="num">2,10,000</td><td class="num">2,10,000</td></tr>',
        '<tr><td>&nbsp;&nbsp;Food / Refreshments / Dinner (Gala Dinner)</td><td class="num">1,60,000</td><td class="num">1,50,000</td><td class="num">1,50,000</td><td class="num">1,65,000</td></tr>'
    ) # check if Gala Dinner string exists
    content = content.replace(
        '<tr><td>&nbsp;&nbsp;Food / Refreshments / Dinner (Gala Dinner)</td><td class="num">1,60,000</td><td class="num">1,50,000</td><td class="num">2,10,000</td><td class="num">2,10,000</td></tr>',
        '<tr><td>&nbsp;&nbsp;Food / Refreshments / Dinner (Gala Dinner)</td><td class="num">1,60,000</td><td class="num">1,50,000</td><td class="num">1,50,000</td><td class="num">1,65,000</td></tr>'
    )
    content = content.replace(
        '<tr><td>&nbsp;&nbsp;Pro-show</td><td class="num">45,000</td><td class="num">26,430</td><td class="num">40,000</td><td class="num">40,000</td></tr>',
        '<tr><td>&nbsp;&nbsp;Pro-show</td><td class="num">45,000</td><td class="num">26,430</td><td class="num">50,000</td><td class="num">55,000</td></tr>'
    )
    content = content.replace(
        '<tr><td>&nbsp;&nbsp;Filming</td><td class="num">65,000</td><td class="num">50,000</td><td class="num">88,500</td><td class="num">88,500</td></tr>',
        '<tr><td>&nbsp;&nbsp;Filming</td><td class="num">65,000</td><td class="num">50,000</td><td class="num">50,000</td><td class="num">55,000</td></tr>'
    )
    content = content.replace(
        '<tr><td>&nbsp;&nbsp;Miscellaneous</td><td class="num">15,000</td><td class="num">10,000</td><td class="num">51,000</td><td class="num">50,000</td></tr>',
        '<tr><td>&nbsp;&nbsp;Miscellaneous</td><td class="num">15,000</td><td class="num">10,000</td><td class="num">10,000</td><td class="num">11,000</td></tr>'
    )
    
    # Detailed Samavaya Central Table
    content = content.replace(
        '<tr><td>Rental Sound and Lights</td><td class="num">60,000</td><td class="num">60,000</td><td class="num">60,000</td><td class="num">90,000</td></tr>',
        '<tr><td>Rental Sound and Lights</td><td class="num">60,000</td><td class="num">60,000</td><td class="num">60,000</td><td class="num">66,000</td></tr>'
    )
    content = content.replace(
        '<tr><td>Rental Sound and Lights</td><td class="num">60,000</td><td class="num">60,000</td><td class="num">90,000</td><td class="num">90,000</td></tr>',
        '<tr><td>Rental Sound and Lights</td><td class="num">60,000</td><td class="num">60,000</td><td class="num">60,000</td><td class="num">66,000</td></tr>'
    )
    content = content.replace(
        '<tr><td>Photography / Videography / Camera</td><td class="num">65,000</td><td class="num">50,000</td><td class="num">50,000</td><td class="num">88,500</td></tr>',
        '<tr><td>Photography / Videography / Camera</td><td class="num">65,000</td><td class="num">50,000</td><td class="num">50,000</td><td class="num">55,000</td></tr>'
    )
    content = content.replace(
        '<tr><td>Decoration</td><td class="num">20,000</td><td class="num">50,000</td><td class="num">30,000</td><td class="num">70,000</td></tr>',
        '<tr><td>Decoration</td><td class="num">20,000</td><td class="num">50,000</td><td class="num">30,000</td><td class="num">33,000</td></tr>'
    )
    content = content.replace(
        '<tr><td>Decoration</td><td class="num">20,000</td><td class="num">50,000</td><td class="num">70,000</td><td class="num">70,000</td></tr>',
        '<tr><td>Decoration</td><td class="num">20,000</td><td class="num">50,000</td><td class="num">30,000</td><td class="num">33,000</td></tr>'
    )
    content = content.replace(
        '<tr><td>Food / Refreshments / Dinner</td><td class="num">10,000</td><td class="num">1,50,000</td><td class="num">1,50,000</td><td class="num">2,10,000</td></tr>',
        '<tr><td>Food / Refreshments / Dinner</td><td class="num">10,000</td><td class="num">1,50,000</td><td class="num">1,50,000</td><td class="num">1,65,000</td></tr>'
    )
    content = content.replace(
        '<tr><td>Pro-Show / Guest Performers</td><td class="num">45,000</td><td class="num">26,430</td><td class="num">50,000</td><td class="num">40,000</td></tr>',
        '<tr><td>Pro-Show / Guest Performers</td><td class="num">45,000</td><td class="num">26,430</td><td class="num">50,000</td><td class="num">55,000</td></tr>'
    )
    content = content.replace(
        '<tr><td>Pro-Show / Guest Performers</td><td class="num">45,000</td><td class="num">26,430</td><td class="num">40,000</td><td class="num">40,000</td></tr>',
        '<tr><td>Pro-Show / Guest Performers</td><td class="num">45,000</td><td class="num">26,430</td><td class="num">50,000</td><td class="num">55,000</td></tr>'
    )
    content = content.replace(
        '<tr><td>Miscellaneous</td><td class="num">15,000</td><td class="num">10,000</td><td class="num">10,000</td><td class="num">50,000</td></tr>',
        '<tr><td>Miscellaneous</td><td class="num">15,000</td><td class="num">10,000</td><td class="num">10,000</td><td class="num">11,000</td></tr>'
    )
    
    # Detailed 2026-27 Samavaya Central items
    content = content.replace(
        '<tr><td>Rental Sound and Lights</td><td>Sound system and stage lights for SAMAV&#256;YA</td><td class="num">90,000</td></tr>',
        '<tr><td>Rental Sound and Lights</td><td>Sound system and stage lights for SAMAV&#256;YA</td><td class="num">66,000</td></tr>'
    )
    content = content.replace(
        '<tr><td>Photography and Videography</td><td>Professional coverage including after-movie</td><td class="num">88,500</td></tr>',
        '<tr><td>Photography and Videography</td><td>Professional coverage including after-movie</td><td class="num">55,000</td></tr>'
    )
    content = content.replace(
        '<tr><td>Decoration</td><td>Flowers, rangoli, stage decor</td><td class="num">70,000</td></tr>',
        '<tr><td>Decoration</td><td>Flowers, rangoli, stage decor</td><td class="num">33,000</td></tr>'
    )
    content = content.replace(
        '<tr><td>Gala Dinner</td><td>Food and refreshments for the fest</td><td class="num">2,10,000</td></tr>',
        '<tr><td>Gala Dinner</td><td>Food and refreshments for the fest</td><td class="num">1,65,000</td></tr>'
    )
    content = content.replace(
        '<tr><td>Pro-show</td><td>Guest artist / band performance</td><td class="num">40,000</td></tr>',
        '<tr><td>Pro-show</td><td>Guest artist / band performance</td><td class="num">55,000</td></tr>'
    )
    content = content.replace(
        '<tr><td>Miscellaneous</td><td>Water, tea, transportation, contingencies</td><td class="num">50,000</td></tr>',
        '<tr><td>Miscellaneous</td><td>Water, tea, transportation, contingencies</td><td class="num">11,000</td></tr>'
    )
    content = content.replace(
        '<td class="num"><b>5,70,500</b></td>',
        '<td class="num"><b>4,07,000</b></td>'
    )
    content = content.replace(
        'miscellaneous fund of &#8377;50,000 has been included',
        'miscellaneous fund of &#8377;11,000 has been included'
    )

    # Cultural Clubs 26-27 modifications
    # ART
    content = content.replace(
        '<tr><td>Pre-event / IICM Fashion Design / Selection</td><td class="num">35,000</td><td class="num">&ndash;</td><td class="num">&ndash;</td><td class="num">50,000</td></tr>',
        '<tr><td>Pre-event (Removed: Fashion Design moved to IINCICM)</td><td class="num">35,000</td><td class="num">&ndash;</td><td class="num">&ndash;</td><td class="num">&ndash;</td></tr>'
    )
    content = content.replace(
        '<tr><td>Fashion Show (IICM) / Selection</td><td>Costumes, props, and design selection</td><td class="num">50,000</td></tr>',
        '<!-- Moved to IINCICM -->'
    )
    content = content.replace(
        '<td class="num"><b>1,17,000</b></td>',
        '<td class="num"><b>67,000</b></td>'
    )
    
    # CINEMATO
    content = content.replace(
        '<tr><td>IICM &ndash; Film Requirements</td><td class="num">&ndash;</td><td class="num">&ndash;</td><td class="num">5,000</td><td class="num">6,000</td></tr>',
        '<tr><td>IICM &ndash; Film Requirements</td><td class="num">&ndash;</td><td class="num">&ndash;</td><td class="num">5,000</td><td class="num">&ndash;</td></tr>'
    )
    content = content.replace(
        '<tr><td>IICM - Film Requirements</td><td>Props and logistics for IICM film</td><td class="num">6,000</td></tr>',
        '<!-- Moved to IINCICM -->'
    )
    content = content.replace(
        '<td class="num"><b>51,000</b></td>',
        '<td class="num"><b>45,000</b></td>'
    )
    
    # DANCE
    content = content.replace(
        '<tr><td>Professional Coaches &ndash; IINCICM</td><td class="num">&ndash;</td><td class="num">&ndash;</td><td class="num">&ndash;</td><td class="num">68,000</td></tr>',
        '<tr><td>Professional Coaches &ndash; IINCICM</td><td class="num">&ndash;</td><td class="num">&ndash;</td><td class="num">&ndash;</td><td class="num">&ndash;</td></tr>'
    )
    content = content.replace(
        '<tr><td>Professional Coaches (IINCICM)</td><td>Choreography &amp; Training</td><td class="num">68,000</td></tr>',
        '<!-- Moved to IINCICM -->'
    )
    content = content.replace(
        '<td class="num"><b>1,41,000</b></td>',
        '<td class="num"><b>73,000</b></td>'
    )

    # THEATRE
    content = content.replace(
        '<tr><td>Coach Appointment (IINCICM)</td><td class="num">&ndash;</td><td class="num">&ndash;</td><td class="num">40,000</td><td class="num">40,000</td></tr>',
        '<tr><td>Coach Appointment (IINCICM)</td><td class="num">&ndash;</td><td class="num">&ndash;</td><td class="num">40,000</td><td class="num">&ndash;</td></tr>'
    )
    content = content.replace(
        '<tr><td>Coach Appointment (IINCICM)</td><td>Professional directing and coaching</td><td class="num">40,000</td></tr>',
        '<!-- Moved to IINCICM -->'
    )
    content = content.replace(
        '<tr><td>Costume (IINCICM + SAMAV&#256;YA)</td><td class="num">&ndash;</td><td class="num">10,000</td><td class="num">10,000</td><td class="num">20,000</td></tr>',
        '<tr><td>Costume (SAMAV&#256;YA only)</td><td class="num">&ndash;</td><td class="num">10,000</td><td class="num">10,000</td><td class="num">10,000</td></tr>'
    )
    content = content.replace(
        '<tr><td>Costume</td><td class="num">&ndash;</td><td class="num">10,000</td><td class="num">10,000</td><td class="num">10,000</td></tr>',
        '<tr><td>Costume (SAMAV&#256;YA only)</td><td class="num">&ndash;</td><td class="num">10,000</td><td class="num">10,000</td><td class="num">10,000</td></tr>'
    )
    content = content.replace(
        '<tr><td>Costume</td><td>For IINCICM and SAMAV&#256;YA performances</td><td class="num">20,000</td></tr>',
        '<tr><td>Costume</td><td>For SAMAV&#256;YA performances</td><td class="num">10,000</td></tr>'
    )
    content = content.replace(
        '<tr><td>Makeup and Jewellery (IINCICM + SAMAV&#256;YA)</td><td class="num">&ndash;</td><td class="num">4,000</td><td class="num">5,000</td><td class="num">10,000</td></tr>',
        '<tr><td>Makeup and Jewellery (SAMAV&#256;YA only)</td><td class="num">&ndash;</td><td class="num">4,000</td><td class="num">5,000</td><td class="num">5,000</td></tr>'
    )
    content = content.replace(
        '<tr><td>Makeup and Jewellery</td><td class="num">&ndash;</td><td class="num">4,000</td><td class="num">5,000</td><td class="num">5,000</td></tr>',
        '<tr><td>Makeup and Jewellery (SAMAV&#256;YA only)</td><td class="num">&ndash;</td><td class="num">4,000</td><td class="num">5,000</td><td class="num">5,000</td></tr>'
    )
    content = content.replace(
        '<tr><td>Makeup and Jewellery</td><td>For IINCICM and SAMAV&#256;YA</td><td class="num">10,000</td></tr>',
        '<tr><td>Makeup and Jewellery</td><td>For SAMAV&#256;YA</td><td class="num">5,000</td></tr>'
    )
    content = content.replace(
        '<tr><td>Set Designing (IINCICM + SAMAV&#256;YA)</td><td class="num">&ndash;</td><td class="num">5,000</td><td class="num">10,000</td><td class="num">10,000</td></tr>',
        '<tr><td>Set Designing (SAMAV&#256;YA only)</td><td class="num">&ndash;</td><td class="num">5,000</td><td class="num">10,000</td><td class="num">5,000</td></tr>'
    )
    content = content.replace(
        '<tr><td>Set Designing</td><td class="num">&ndash;</td><td class="num">5,000</td><td class="num">10,000</td><td class="num">5,000</td></tr>',
        '<tr><td>Set Designing (SAMAV&#256;YA only)</td><td class="num">&ndash;</td><td class="num">5,000</td><td class="num">10,000</td><td class="num">5,000</td></tr>'
    )
    content = content.replace(
        '<tr><td>Set Designing</td><td>Props and sets for plays</td><td class="num">10,000</td></tr>',
        '<tr><td>Set Designing</td><td>Props and sets for SAMAV&#256;YA play</td><td class="num">5,000</td></tr>'
    )
    content = content.replace(
        '<td class="num"><b>93,700</b></td>',
        '<td class="num"><b>33,700</b></td>'
    )

    # Grand totals update in the overview table
    content = content.replace(
        '<tr><td><b>Samavaya Central Total</b></td><td class="num"><b>2,40,000</b></td><td class="num"><b>3,66,430</b></td><td class="num"><b>5,69,500</b></td><td class="num"><b>5,70,500</b></td></tr>',
        '<tr><td><b>Samavaya Central Total</b></td><td class="num"><b>2,40,000</b></td><td class="num"><b>3,66,430</b></td><td class="num"><b>3,70,000</b></td><td class="num"><b>4,07,000</b></td></tr>'
    )
    content = content.replace(
        '<tr><td><b>Cultural Clubs Total</b></td><td class="num"><b>1,73,000</b></td><td class="num"><b>4,11,930</b></td><td class="num"><b>3,94,500</b></td><td class="num"><b>6,51,355</b></td></tr>',
        '<tr><td><b>Cultural Clubs Total</b></td><td class="num"><b>1,73,000</b></td><td class="num"><b>4,11,930</b></td><td class="num"><b>3,94,500</b></td><td class="num"><b>4,26,355</b></td></tr>'
    )
    content = content.replace(
        '<tr><td><b>Samavaya Central Total</b></td><td class="num"><b>2,40,000</b></td><td class="num"><b>3,66,430</b></td><td class="num"><b>3,70,000</b></td><td class="num"><b>5,70,500</b></td></tr>',
        '<tr><td><b>Samavaya Central Total</b></td><td class="num"><b>2,40,000</b></td><td class="num"><b>3,66,430</b></td><td class="num"><b>3,70,000</b></td><td class="num"><b>4,07,000</b></td></tr>'
    )
    
    # Final total replacement
    content = content.replace(
        '<td class="num"><b>12,21,855</b></td>',
        '<td class="num"><b>8,33,355</b></td>'
    )
    content = content.replace(
        '<td class="num"><b>10,44,855</b></td>', # just in case
        '<td class="num"><b>8,33,355</b></td>'
    )
    content = content.replace(
        'estimated total expenditure for Samavaya and Cultural Clubs for this year is <b>&#8377;10,44,855/-</b>',
        'estimated total expenditure for Samavaya and Cultural Clubs for this year is <b>&#8377;8,33,355/-</b>'
    )
    content = content.replace(
        'estimated total expenditure for Samavaya and Cultural Clubs for this year is <b>&#8377;12,21,855/-</b>',
        'estimated total expenditure for Samavaya and Cultural Clubs for this year is <b>&#8377;8,33,355/-</b>'
    )

    # E-Game Coordinator
    content = content.replace(
        'Harsh Nagpal, Rajeshwar Sahu<br>Student Coordinators<br>E-Game Club',
        'Tanishq Chavda<br>Student Coordinator<br>E-Game Club'
    )
    
    return content

for file_path in files:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    content = update_samavaya(content)
    
    # Grand Budget replacements (only for BUDGET2026-27.html)
    if 'BUDGET2026-27.html' in file_path:
        content = content.replace(
            '<tr><td>Samavaya and Cultural Clubs</td><td class="num">4,13,000</td><td class="num">7,78,360</td><td class="num">9,64,000</td><td class="num">12,21,855</td></tr>',
            '<tr><td>Samavaya and Cultural Clubs</td><td class="num">4,13,000</td><td class="num">7,78,360</td><td class="num">7,64,500</td><td class="num">8,33,355</td></tr>'
        )
        content = content.replace(
            '<tr><td>Samavaya and Cultural Clubs</td><td class="num">4,13,000</td><td class="num">7,78,360</td><td class="num">7,64,500</td><td class="num">10,44,855</td></tr>',
            '<tr><td>Samavaya and Cultural Clubs</td><td class="num">4,13,000</td><td class="num">7,78,360</td><td class="num">7,64,500</td><td class="num">8,33,355</td></tr>'
        )
        content = content.replace(
            '<tr><td>IINCICM</td><td class="num">7,00,000</td><td class="num">&ndash;</td><td class="num">6,70,000</td><td class="num">9,70,000</td></tr>',
            '<tr><td>IINCICM</td><td class="num">7,00,000</td><td class="num">&ndash;</td><td class="num">6,70,000</td><td class="num">9,80,000</td></tr>'
        )
        content = content.replace(
            '<td class="num"><b>33,88,813 &ndash; 34,10,813</b></td>',
            '<td class="num"><b>32,06,593 &ndash; 32,28,593</b></td>'
        )
        content = content.replace(
            '<td class="num"><b>34,01,113 &ndash; 34,23,113</b></td>', # check if different initial total
            '<td class="num"><b>32,06,593 &ndash; 32,28,593</b></td>'
        )
        
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"Updated {file_path}")

# Fix IINCICM
iincicm_file = r"c:\Users\Legion\Website\IINCICM 2026-27.html"
with open(iincicm_file, 'r', encoding='utf-8') as f:
    iincicm_content = f.read()

iincicm_content = iincicm_content.replace(
    '<tr><td>Fashion Design</td><td>&ndash;</td><td class="num">&ndash;</td><td class="num">50,000</td><td class="num">40,000</td></tr>',
    '<tr><td>Fashion Design &amp; Selection</td><td>&ndash;</td><td class="num">&ndash;</td><td class="num">50,000</td><td class="num">50,000</td></tr>'
)
iincicm_content = iincicm_content.replace(
    '<tr><td>Fashion Design</td><td>&ndash;</td><td class="num">&ndash;</td><td class="num">&ndash;</td><td class="num">50,000</td><td class="num">40,000</td></tr>',
    '<tr><td>Fashion Design &amp; Selection</td><td>&ndash;</td><td class="num">&ndash;</td><td class="num">&ndash;</td><td class="num">50,000</td><td class="num">50,000</td></tr>'
)
iincicm_content = iincicm_content.replace(
    '<tr><td>Fashion Design</td><td>Props, makeup and logistics for the fashion show</td><td class="num">40,000</td></tr>',
    '<tr><td>Fashion Design &amp; Selection</td><td>Props, makeup, logistics, and selection events</td><td class="num">50,000</td></tr>'
)
iincicm_content = iincicm_content.replace(
    '<td class="num"><b>9,70,000</b></td>',
    '<td class="num"><b>9,80,000</b></td>'
)
iincicm_content = iincicm_content.replace(
    'expenditure for IINCICM for this year is <b>&#8377;9,70,000/-</b>',
    'expenditure for IINCICM for this year is <b>&#8377;9,80,000/-</b>'
)

with open(iincicm_file, 'w', encoding='utf-8') as f:
    f.write(iincicm_content)
print(f"Updated {iincicm_file}")

# Do the same IINCICM update in combined budget
with open(combined_file, 'r', encoding='utf-8') as f:
    combined_content = f.read()

combined_content = combined_content.replace(
    '<tr><td>Fashion Design</td><td>&ndash;</td><td class="num">&ndash;</td><td class="num">50,000</td><td class="num">40,000</td></tr>',
    '<tr><td>Fashion Design &amp; Selection</td><td>&ndash;</td><td class="num">&ndash;</td><td class="num">50,000</td><td class="num">50,000</td></tr>'
)
combined_content = combined_content.replace(
    '<tr><td>Fashion Design</td><td>Props, makeup and logistics for the fashion show</td><td class="num">40,000</td></tr>',
    '<tr><td>Fashion Design &amp; Selection</td><td>Props, makeup, logistics, and selection events</td><td class="num">50,000</td></tr>'
)

# Total replaces for combined IINCICM area
combined_content = combined_content.replace(
    '<tr><td><b>Total</b></td><td class="num"><b>7,00,000</b></td><td class="num"><b>&ndash;</b></td><td class="num"><b>6,70,000</b></td><td class="num"><b>9,70,000</b></td></tr>',
    '<tr><td><b>Total</b></td><td class="num"><b>7,00,000</b></td><td class="num"><b>&ndash;</b></td><td class="num"><b>6,70,000</b></td><td class="num"><b>9,80,000</b></td></tr>'
)
combined_content = combined_content.replace(
    '<tr class="total"><td colspan="2"><b>Total</b></td><td class="num"><b>9,70,000</b></td></tr>',
    '<tr class="total"><td colspan="2"><b>Total</b></td><td class="num"><b>9,80,000</b></td></tr>'
)
with open(combined_file, 'w', encoding='utf-8') as f:
    f.write(combined_content)
