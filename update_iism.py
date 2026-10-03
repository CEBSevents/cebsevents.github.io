import re
import os

iism_file = r"c:\Users\Legion\Website\IISM 2026-27.html"
combined_file = r"c:\Users\Legion\Website\BUDGET2026-27.html"

def update_iism(content):
    content = content.replace(
        '<tr><td>Sports Equipment</td><td class="num">1,70,000</td><td class="num">&ndash;</td><td class="num">&ndash;</td><td class="num">60,620</td></tr>',
        '<tr><td>Sports Equipment</td><td class="num">1,70,000</td><td class="num">65,000</td><td class="num">&ndash;</td><td class="num">60,620</td></tr>'
    )
    content = content.replace(
        '<tr><td>Sports Jersey</td><td class="num">1,50,000</td><td class="num">&ndash;</td><td class="num">&ndash;</td><td class="num">98,000 &ndash; 1,10,000</td></tr>',
        '<tr><td>Sports Jersey</td><td class="num">1,50,000</td><td class="num">1,25,000</td><td class="num">&ndash;</td><td class="num">98,000 &ndash; 1,10,000</td></tr>'
    )
    content = content.replace(
        '<tr><td>Travel Expenditure</td><td class="num">1,75,000</td><td class="num">&ndash;</td><td class="num">&ndash;</td><td class="num">1,70,000</td></tr>',
        '<tr><td>Travel Expenditure</td><td class="num">1,75,000</td><td class="num">50,000</td><td class="num">&ndash;</td><td class="num">1,70,000</td></tr>'
    )
    content = content.replace(
        '<tr><td>Registration &amp; Accommodation</td><td class="num">3,10,000</td><td class="num">&ndash;</td><td class="num">&ndash;</td><td class="num">6,00,000</td></tr>',
        '<tr><td>Registration &amp; Accommodation</td><td class="num">3,10,000</td><td class="num">5,10,000</td><td class="num">&ndash;</td><td class="num">6,00,000</td></tr>'
    )
    content = content.replace(
        '<tr><td>Registration and Accommodation</td><td class="num">3,10,000</td><td class="num">&ndash;</td><td class="num">&ndash;</td><td class="num">6,00,000</td></tr>',
        '<tr><td>Registration and Accommodation</td><td class="num">3,10,000</td><td class="num">5,10,000</td><td class="num">&ndash;</td><td class="num">6,00,000</td></tr>'
    )
    content = content.replace(
        '<tr><td>Ragnarok</td><td class="num">30,000</td><td class="num">&ndash;</td><td class="num">&ndash;</td><td class="num">10,000</td></tr>',
        '<tr><td>Ragnarok</td><td class="num">30,000</td><td class="num">15,000</td><td class="num">&ndash;</td><td class="num">10,000</td></tr>'
    )
    content = content.replace(
        '<tr><td>Contingencies</td><td class="num">5,000</td><td class="num">&ndash;</td><td class="num">&ndash;</td><td class="num">5,000</td></tr>',
        '<tr><td>Contingencies</td><td class="num">5,000</td><td class="num">5,000</td><td class="num">&ndash;</td><td class="num">5,000</td></tr>'
    )
    return content

# Update IISM standalone
with open(iism_file, 'r', encoding='utf-8') as f:
    iism_content = f.read()
iism_content = update_iism(iism_content)
with open(iism_file, 'w', encoding='utf-8') as f:
    f.write(iism_content)
print(f"Updated {iism_file}")

# Update Combined
with open(combined_file, 'r', encoding='utf-8') as f:
    combined_content = f.read()
combined_content = update_iism(combined_content)
combined_content = combined_content.replace(
    '<tr><td>Freshers</td><td class="num">2,30,000</td><td class="num">2,30,000</td><td class="num">2,40,000</td><td class="num">2,40,625</td></tr>',
    '<tr><td>Freshers</td><td class="num">2,30,000</td><td class="num">2,30,640</td><td class="num">2,40,000</td><td class="num">2,40,625</td></tr>'
)
with open(combined_file, 'w', encoding='utf-8') as f:
    f.write(combined_content)
print(f"Updated {combined_file}")
