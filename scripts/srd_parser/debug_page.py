#!/usr/bin/env python3
"""Debug what HTML structure we're getting from the page."""

import requests
from bs4 import BeautifulSoup

url = "https://5e24srd.com/playing-the-game/the-six-abilities.html"
response = requests.get(url, timeout=30)
response.encoding = 'utf-8'
soup = BeautifulSoup(response.text, 'html.parser')

print("=== Looking for article ===")
article = soup.find('article')
if article:
    print("Found article tag")
    print(f"Article children types: {[c.name for c in article.children if hasattr(c, 'name')][:20]}")
else:
    print("No article tag found")

print("\n=== Looking for main content containers ===")
main = soup.find('main')
if main:
    print("Found main tag")
    print(f"Main children types: {[c.name for c in main.children if hasattr(c, 'name')][:20]}")

print("\n=== Looking for divs with content ===")
for div in soup.find_all('div', class_=True)[:10]:
    classes = div.get('class', [])
    text_preview = div.get_text()[:100].replace('\n', ' ')
    print(f"div.{' '.join(classes)}: {text_preview}")

print("\n=== Looking for tables ===")
tables = soup.find_all('table')
print(f"Found {len(tables)} tables")
for i, table in enumerate(tables[:3]):
    print(f"Table {i}: {table.get('class', 'no class')}")
    first_row = table.find('tr')
    if first_row:
        print(f"  First row: {first_row.get_text()[:100]}")

print("\n=== Looking for content div ===")
content_div = soup.find('div', class_='content')
if content_div:
    print("Found div.content")
    for child in list(content_div.children)[:15]:
        if hasattr(child, 'name') and child.name:
            text = child.get_text()[:80].replace('\n', ' ')
            print(f"  {child.name}: {text}")
else:
    print("No div.content found")

print("\n=== All container divs ===")
for div in soup.find_all('div'):
    if div.find('table'):
        classes = div.get('class', [])
        print(f"Div with table: {' '.join(classes) if classes else 'no class'}")
