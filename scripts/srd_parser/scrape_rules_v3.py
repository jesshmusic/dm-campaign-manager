#!/usr/bin/env python3
"""
Improved scraper for 5e24srd.com rules that properly captures tables
and converts them to markdown format. Uses div.content structure.
"""

import requests
from bs4 import BeautifulSoup, NavigableString
import json
import re
import time
from slugify import slugify

BASE_URL = "https://5e24srd.com"

# All the rule pages - these should be top-level rules (not under "Playing the Game")
RULE_PAGES = [
    "/playing-the-game/rhythm-of-play.html",
    "/playing-the-game/the-six-abilities.html",
    "/playing-the-game/d20-tests.html",
    "/playing-the-game/proficiency.html",
    "/playing-the-game/actions.html",
    "/playing-the-game/social-interaction.html",
    "/playing-the-game/exploration.html",
    "/playing-the-game/combat.html",
    "/playing-the-game/damage-and-healing.html",
]

def html_table_to_markdown(table):
    """Convert an HTML table to markdown format."""
    rows = []
    all_rows = table.find_all('tr')

    if not all_rows:
        return ""

    # Get headers from first row
    first_row = all_rows[0]
    headers = []
    for cell in first_row.find_all(['th', 'td']):
        headers.append(cell.get_text(strip=True))

    if not headers:
        return ""

    # Create header row
    rows.append("| " + " | ".join(headers) + " |")
    rows.append("| " + " | ".join(["---"] * len(headers)) + " |")

    # Get data rows
    for tr in all_rows[1:]:
        cells = []
        for td in tr.find_all(['td', 'th']):
            cells.append(td.get_text(strip=True))
        if cells:
            # Pad if needed
            while len(cells) < len(headers):
                cells.append("")
            rows.append("| " + " | ".join(cells[:len(headers)]) + " |")

    return "\n".join(rows)

def clean_text(text):
    """Clean up text encoding issues."""
    if not text:
        return ""
    # Fix common encoding issues
    text = text.replace('\u2019', "'")
    text = text.replace('\u2018', "'")
    text = text.replace('\u201c', '"')
    text = text.replace('\u201d', '"')
    text = text.replace('\u2014', '-')
    text = text.replace('\u2013', '-')
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def extract_content_from_div(content_div):
    """Extract content from div.content, converting tables to markdown."""
    if not content_div:
        return ""

    content_parts = []

    for element in content_div.children:
        if isinstance(element, NavigableString):
            continue

        if not hasattr(element, 'name') or not element.name:
            continue

        if element.name == 'table':
            md_table = html_table_to_markdown(element)
            if md_table:
                content_parts.append("\n\n" + md_table + "\n\n")
        elif element.name == 'h1':
            # Skip h1, we use it for the title
            pass
        elif element.name == 'h2':
            text = clean_text(element.get_text())
            if text:
                content_parts.append(f"\n\n## {text}\n\n")
        elif element.name == 'h3':
            text = clean_text(element.get_text())
            if text:
                content_parts.append(f"\n\n### {text}\n\n")
        elif element.name == 'h4':
            text = clean_text(element.get_text())
            if text:
                content_parts.append(f"\n\n#### {text}\n\n")
        elif element.name == 'p':
            text = clean_text(element.get_text())
            if text:
                content_parts.append(text + "\n\n")
        elif element.name == 'ul':
            for li in element.find_all('li', recursive=False):
                text = clean_text(li.get_text())
                if text:
                    content_parts.append(f"- {text}\n")
            content_parts.append("\n")
        elif element.name == 'ol':
            for i, li in enumerate(element.find_all('li', recursive=False), 1):
                text = clean_text(li.get_text())
                if text:
                    content_parts.append(f"{i}. {text}\n")
            content_parts.append("\n")
        elif element.name == 'div':
            # Recursively handle divs
            nested_content = extract_content_from_div(element)
            if nested_content:
                content_parts.append(nested_content)

    result = ''.join(content_parts)
    # Clean up excessive whitespace
    result = re.sub(r'\n{3,}', '\n\n', result)
    return result.strip()

def scrape_rule_page(url):
    """Scrape a single rule page."""
    print(f"Scraping: {url}")

    try:
        response = requests.get(url, timeout=30)
        response.raise_for_status()
        response.encoding = 'utf-8'

        soup = BeautifulSoup(response.text, 'html.parser')

        # Find the content div
        content_div = soup.find('div', class_='content')
        if not content_div:
            print(f"  Warning: No content div found")
            return None

        # Get title from h1
        h1 = content_div.find('h1')
        title = clean_text(h1.get_text()) if h1 else "Unknown"

        # Get content
        description = extract_content_from_div(content_div)

        slug = slugify(title)

        print(f"  Title: {title}")
        print(f"  Description length: {len(description)}")

        return {
            "name": title,
            "slug": slug,
            "description": description
        }
    except Exception as e:
        print(f"Error scraping {url}: {e}")
        import traceback
        traceback.print_exc()
        return None

def main():
    rules = []

    for page in RULE_PAGES:
        url = BASE_URL + page
        rule = scrape_rule_page(url)
        if rule:
            rules.append(rule)
        time.sleep(0.5)  # Be polite

    # Output to JSON (flat structure, no "Playing the Game" parent)
    output_path = "/Users/jesshendricks/Code/dungeon-master-guru/scripts/srd_parser/output/2024/rules.json"
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(rules, f, indent=2, ensure_ascii=False)

    print(f"\nScraped {len(rules)} rules")
    print(f"Output saved to: {output_path}")

    # Show a sample
    if len(rules) > 1:
        print(f"\nSample - {rules[1]['name']}:")
        print(rules[1]['description'][:800])

if __name__ == "__main__":
    main()
