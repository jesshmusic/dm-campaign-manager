#!/usr/bin/env python3
"""
5e24srd.com Web Scraper

Scrapes D&D 5e 2024 content from 5e24srd.com and outputs JSON files
compatible with the Rails application schema.

Usage:
    python scraper.py --types spells classes species
    python scraper.py --all
"""

import argparse
import json
import re
import sys
import time
from pathlib import Path
from typing import Optional

try:
    import requests
    from bs4 import BeautifulSoup
except ImportError:
    print("Error: Required packages not installed. Run:")
    print("  pip install requests beautifulsoup4")
    sys.exit(1)

from slugify import slugify

BASE_URL = "https://5e24srd.com"
EDITION = "2024"

# Rate limiting
REQUEST_DELAY = 0.5  # seconds between requests


def fetch_page(url: str) -> Optional[BeautifulSoup]:
    """Fetch a page and return BeautifulSoup object."""
    try:
        print(f"  Fetching: {url}")
        response = requests.get(url, timeout=30)
        response.raise_for_status()
        time.sleep(REQUEST_DELAY)
        return BeautifulSoup(response.text, 'html.parser')
    except requests.RequestException as e:
        print(f"  Error fetching {url}: {e}")
        return None


def make_slug(name: str) -> str:
    """Generate a URL-friendly slug from a name."""
    return slugify(name, lowercase=True)


class SpellScraper:
    """Scrapes spell data from 5e24srd.com."""

    def __init__(self):
        self.spells = []

    def scrape(self) -> list:
        """Scrape all spells."""
        print("\nScraping spells...")
        soup = fetch_page(f"{BASE_URL}/spells/spell-descriptions.html")
        if not soup:
            return []

        content = soup.find('main') or soup.find('article') or soup

        # Find all spell name headers (h3 elements)
        spell_headers = content.find_all('h3')

        for header in spell_headers:
            spell_name = header.get_text(strip=True)

            # Skip section headers
            if self._is_section_header(spell_name):
                continue

            spell = self._parse_spell_section(header, spell_name)
            if spell and self._is_valid_spell(spell):
                self.spells.append(spell)

        print(f"  Found {len(self.spells)} spells")
        return self.spells

    def _parse_spell_section(self, header, spell_name: str) -> Optional[dict]:
        """Parse a complete spell section starting from the h3 header."""
        spell = {
            'name': spell_name,
            'slug': make_slug(spell_name),
            'level': 0,
            'school': '',
            'casting_time': '',
            'range': '',
            'components': '',
            'material': '',
            'duration': '',
            'concentration': False,
            'ritual': False,
            'description': '',
            'higher_level': '',
            'dnd_classes': ''
        }

        # Iterate through siblings until we hit the next h3
        for sibling in header.find_next_siblings():
            if sibling.name == 'h3':
                break

            # Parse metadata line (Level X School (Classes))
            if sibling.name == 'p':
                em = sibling.find('em')
                if em:
                    meta = self._parse_spell_meta(em.get_text(strip=True))
                    if meta:
                        spell.update(meta)
                    continue

                # Check for higher level text
                text = sibling.get_text(strip=True)
                strong = sibling.find('strong')
                if strong and 'Higher-Level' in strong.get_text():
                    hl_text = text.replace(strong.get_text(), '').strip()
                    spell['higher_level'] = hl_text
                elif strong and 'Cantrip Upgrade' in strong.get_text():
                    cu_text = text.replace(strong.get_text(), '').strip()
                    spell['higher_level'] = cu_text
                else:
                    # Regular description paragraph
                    if spell['description']:
                        spell['description'] += ' ' + text
                    else:
                        spell['description'] = text

            # Parse properties from ul/li structure
            elif sibling.name == 'ul':
                for li in sibling.find_all('li'):
                    li_text = li.get_text(strip=True)
                    strong = li.find('strong')
                    if not strong:
                        continue

                    label = strong.get_text(strip=True).rstrip(':')
                    value = li_text.replace(strong.get_text(), '').strip()

                    if 'Casting Time' in label:
                        spell['casting_time'] = value
                        if 'Ritual' in value:
                            spell['ritual'] = True
                    elif 'Range' in label:
                        spell['range'] = value
                    elif 'Components' in label:
                        spell['components'] = value
                        # Extract material component
                        mat_match = re.search(r'M\s*\(([^)]+)\)', value)
                        if mat_match:
                            spell['material'] = mat_match.group(1).strip()
                    elif 'Duration' in label:
                        spell['duration'] = value
                        spell['concentration'] = 'Concentration' in value

        return spell

    def _parse_spell_meta(self, text: str) -> Optional[dict]:
        """Parse spell metadata line like 'Level 2 Evocation (Wizard)'."""
        result = {}

        # Cantrip pattern
        cantrip_match = re.match(r'(\w+)\s+Cantrip\s*\(([^)]+)\)', text, re.IGNORECASE)
        if cantrip_match:
            result['school'] = cantrip_match.group(1).capitalize()
            result['level'] = 0
            result['dnd_classes'] = cantrip_match.group(2).strip()
            return result

        # Level spell pattern
        level_match = re.match(r'Level\s+(\d+)\s+(\w+)\s*\(([^)]+)\)', text, re.IGNORECASE)
        if level_match:
            result['level'] = int(level_match.group(1))
            result['school'] = level_match.group(2).capitalize()
            result['dnd_classes'] = level_match.group(3).strip()
            result['ritual'] = 'Ritual' in text
            return result

        return None

    def _is_section_header(self, text: str) -> bool:
        """Check if text is a section header, not a spell name."""
        section_headers = [
            'Spell Descriptions', 'A Spells', 'B Spells', 'C Spells', 'D Spells',
            'E Spells', 'F Spells', 'G Spells', 'H Spells', 'I Spells', 'J Spells',
            'K Spells', 'L Spells', 'M Spells', 'N Spells', 'O Spells', 'P Spells',
            'Q Spells', 'R Spells', 'S Spells', 'T Spells', 'U Spells', 'V Spells',
            'W Spells', 'X Spells', 'Y Spells', 'Z Spells', 'Gaining and Casting'
        ]
        return any(header in text for header in section_headers)

    def _is_valid_spell(self, spell: dict) -> bool:
        """Check if spell has minimum required data."""
        return (
            bool(spell.get('name')) and
            len(spell.get('name', '')) > 2 and
            spell.get('school') and
            spell.get('casting_time')
        )


class ClassScraper:
    """Scrapes class data from 5e24srd.com."""

    CLASS_NAMES = [
        'barbarian', 'bard', 'cleric', 'druid', 'fighter', 'monk',
        'paladin', 'ranger', 'rogue', 'sorcerer', 'warlock', 'wizard'
    ]

    def __init__(self):
        self.classes = []

    def scrape(self) -> list:
        """Scrape all classes."""
        print("\nScraping classes...")

        for class_name in self.CLASS_NAMES:
            url = f"{BASE_URL}/classes/{class_name}.html"
            soup = fetch_page(url)
            if not soup:
                continue

            class_data = self._parse_class(soup, class_name)
            if class_data:
                self.classes.append(class_data)

        print(f"  Found {len(self.classes)} classes")
        return self.classes

    def _parse_class(self, soup: BeautifulSoup, class_name: str) -> Optional[dict]:
        """Parse a single class page."""
        name = class_name.capitalize()

        class_data = {
            'name': name,
            'slug': class_name,
            'hit_die': '',
            'desc': '',
            'saving_throws': [],
            'skill_choices': [],
            'proficiencies': [],
            'starting_equipment': '',
            'dnd_class_levels': [],
            'spell_casting': None
        }

        content = soup.find('main') or soup.find('article') or soup

        # Extract text content
        for p in content.find_all('p'):
            text = p.get_text(strip=True)

            # Hit Die
            if 'Hit Die' in text or 'D6' in text or 'D8' in text or 'D10' in text or 'D12' in text:
                die_match = re.search(r'D(\d+)', text, re.IGNORECASE)
                if die_match:
                    class_data['hit_die'] = f"1d{die_match.group(1)}"

            # Saving Throws
            if 'Saving Throw' in text:
                save_match = re.search(r'Saving Throws?[:\s]+(\w+)\s+and\s+(\w+)', text, re.IGNORECASE)
                if save_match:
                    class_data['saving_throws'] = [save_match.group(1), save_match.group(2)]

        # Get description from first few paragraphs
        paragraphs = content.find_all('p')[:3]
        class_data['desc'] = ' '.join(p.get_text(strip=True) for p in paragraphs)

        return class_data


class SpeciesScraper:
    """Scrapes species/race data from 5e24srd.com."""

    # Known 2024 SRD species names
    VALID_SPECIES = [
        'Dragonborn', 'Dwarf', 'Elf', 'Gnome', 'Goliath',
        'Halfling', 'Human', 'Orc', 'Tiefling'
    ]

    # Headers to skip
    SKIP_HEADERS = [
        'Character Species', 'Species Traits', 'Parts of a Species',
        'Creature Type', 'Size', 'Speed', 'Special Traits',
        'Species Descriptions', 'Draconic Ancestors'
    ]

    def __init__(self):
        self.species = []

    def scrape(self) -> list:
        """Scrape all species."""
        print("\nScraping species...")
        soup = fetch_page(f"{BASE_URL}/character-origins/character-species.html")
        if not soup:
            return []

        content = soup.find('main') or soup.find('article') or soup

        current_species = None

        for element in content.find_all(['h2', 'h3', 'p', 'ul']):
            text = element.get_text(strip=True)

            # Species header
            if element.name in ['h2', 'h3']:
                # Save previous species
                if current_species and self._is_valid_species(current_species):
                    self.species.append(current_species)
                    current_species = None

                # Check if this is a valid species name
                if text in self.VALID_SPECIES:
                    current_species = {
                        'name': text,
                        'slug': make_slug(text),
                        'size': 'Medium',
                        'speed': '30 ft.',
                        'desc': '',
                        'race_traits': []
                    }
                continue

            if not current_species:
                continue

            # Parse species details
            if 'Size:' in text:
                size_match = re.search(r'Size:\s*(\w+)', text)
                if size_match:
                    current_species['size'] = size_match.group(1)
            elif 'Speed:' in text and 'feet' in text.lower():
                speed_match = re.search(r'Speed:\s*(\d+)\s*(?:feet|ft)', text, re.IGNORECASE)
                if speed_match:
                    current_species['speed'] = f"{speed_match.group(1)} ft."
            elif element.name == 'p' and len(text) > 20:
                # Add to description
                if current_species['desc']:
                    current_species['desc'] += ' ' + text
                else:
                    current_species['desc'] = text

        # Don't forget the last species
        if current_species and self._is_valid_species(current_species):
            self.species.append(current_species)

        print(f"  Found {len(self.species)} species")
        return self.species

    def _is_valid_species(self, species: dict) -> bool:
        """Check if species has minimum required data."""
        return species.get('name') in self.VALID_SPECIES


class EquipmentScraper:
    """Scrapes equipment data from 5e24srd.com."""

    EQUIPMENT_PAGES = [
        ('weapons', 'weapons.html'),
        ('armor', 'armor.html'),
        ('adventuring-gear', 'adventuring-gear.html'),
        ('tools', 'tools.html'),
        ('magic-items', 'magic-items.html'),
    ]

    def __init__(self):
        self.items = []

    def scrape(self) -> list:
        """Scrape all equipment."""
        print("\nScraping equipment...")

        for category, page in self.EQUIPMENT_PAGES:
            url = f"{BASE_URL}/equipment/{page}"
            soup = fetch_page(url)
            if not soup:
                continue

            items = self._parse_equipment_page(soup, category)
            self.items.extend(items)

        print(f"  Found {len(self.items)} items")
        return self.items

    def _parse_equipment_page(self, soup: BeautifulSoup, category: str) -> list:
        """Parse an equipment page."""
        items = []
        content = soup.find('main') or soup.find('article') or soup

        # Look for tables (weapons and armor are often in tables)
        for table in content.find_all('table'):
            headers = [th.get_text(strip=True).lower() for th in table.find_all('th')]
            for row in table.find_all('tr')[1:]:  # Skip header row
                cells = row.find_all(['td', 'th'])
                if not cells:
                    continue

                item = {
                    'name': cells[0].get_text(strip=True),
                    'slug': make_slug(cells[0].get_text(strip=True)),
                    'item_type': category,
                    'desc': '',
                    'cost': '',
                    'weight': '',
                }

                # Parse based on category and headers
                for i, cell in enumerate(cells[1:], 1):
                    if i < len(headers):
                        header = headers[i]
                        value = cell.get_text(strip=True)
                        if 'cost' in header or 'price' in header:
                            item['cost'] = value
                        elif 'weight' in header:
                            item['weight'] = value
                        elif 'damage' in header:
                            item['damage'] = value
                        elif 'ac' in header or 'armor' in header:
                            item['armor_class'] = value

                if item['name']:
                    items.append(item)

        return items


class ConditionScraper:
    """Scrapes condition data from 5e24srd.com."""

    # 2024 conditions based on SRD
    CONDITIONS = [
        ('Blinded', "You can't see and automatically fail any ability check that requires sight. Attack Rolls against you have Advantage, and your attack rolls have Disadvantage."),
        ('Charmed', "You can't attack the charmer or target the charmer with damaging abilities or magical effects. The charmer has Advantage on any ability check to interact with you socially."),
        ('Deafened', "You can't hear and automatically fail any ability check that requires hearing."),
        ('Exhaustion', "This condition is cumulative. Each time you receive it, you gain 1 Exhaustion level. You die if your Exhaustion level is 6. When you make a D20 Test, the roll is reduced by 2 times your Exhaustion level. Your Speed is reduced by a number of feet equal to 5 times your Exhaustion level. Finishing a Long Rest removes 1 of your Exhaustion levels."),
        ('Frightened', "You have Disadvantage on ability checks and attack rolls while the source of fear is within line of sight. You can't willingly move closer to the source of fear."),
        ('Grappled', "Your Speed is 0 and can't increase. You have Disadvantage on attack rolls against any target other than the grappler. The grappler can drag or carry you when it moves, but every foot of movement costs it 1 extra foot unless you're Tiny or two or more sizes smaller than it."),
        ('Incapacitated', "You can't take actions, bonus actions, or reactions."),
        ('Invisible', "You can't be seen without the aid of magic or a special sense. You're heavily obscured for the purpose of hiding. Any attack roll against you has Disadvantage, and your attack rolls have Advantage."),
        ('Paralyzed', "You have the Incapacitated condition. Your Speed is 0 and can't increase. You automatically fail Strength and Dexterity saving throws. Attack Rolls against you have Advantage. Any attack that hits you is a Critical Hit if the attacker is within 5 feet of you."),
        ('Petrified', "You have the Incapacitated condition. You and any nonmagical items you're wearing or carrying are transformed into a solid, inanimate substance. Your weight is multiplied by ten. You stop aging. You're immune to Poison and Disease, though any you already have is only suspended. Attack Rolls against you have Advantage. You automatically fail Strength and Dexterity saving throws."),
        ('Poisoned', "You have Disadvantage on attack rolls and ability checks."),
        ('Prone', "Your only movement options are to crawl or to spend an amount of movement equal to half your Speed to stand up. You have Disadvantage on attack rolls. An attack roll against you has Advantage if the attacker is within 5 feet of you; otherwise it has Disadvantage."),
        ('Restrained', "Your Speed is 0 and can't increase. Attack Rolls against you have Advantage, and your attack rolls have Disadvantage. You have Disadvantage on Dexterity saving throws."),
        ('Stunned', "You have the Incapacitated condition. You automatically fail Strength and Dexterity saving throws. Attack Rolls against you have Advantage."),
        ('Unconscious', "You have the Incapacitated and Prone conditions. You drop whatever you're holding and fall Prone. You automatically fail Strength and Dexterity saving throws. Attack Rolls against you have Advantage. Any attack that hits you is a Critical Hit if the attacker is within 5 feet of you."),
    ]

    def scrape(self) -> list:
        """Return 2024 conditions (predefined since they're standard)."""
        print("\nScraping conditions...")
        conditions = []

        for name, desc in self.CONDITIONS:
            conditions.append({
                'name': name,
                'slug': make_slug(name),
                'desc': desc
            })

        print(f"  Found {len(conditions)} conditions")
        return conditions


class RuleScraper:
    """Scrapes rules from 5e24srd.com."""

    RULE_PAGES = [
        ('playing-the-game', 'Playing the Game', [
            ('rhythm-of-play', 'rhythm-of-play.html'),
            ('the-six-abilities', 'the-six-abilities.html'),
            ('d20-tests', 'd20-tests.html'),
            ('proficiency', 'proficiency.html'),
            ('actions', 'actions.html'),
            ('social-interaction', 'social-interaction.html'),
            ('exploration', 'exploration.html'),
            ('combat', 'combat.html'),
            ('damage-and-healing', 'damage-and-healing.html'),
        ]),
    ]

    def __init__(self):
        self.rules = []

    def scrape(self) -> list:
        """Scrape all rules."""
        print("\nScraping rules...")

        for parent_slug, parent_name, children in self.RULE_PAGES:
            parent_rule = {
                'name': parent_name,
                'slug': parent_slug,
                'desc': '',
                'children': []
            }

            for child_slug, child_page in children:
                url = f"{BASE_URL}/playing-the-game/{child_page}"
                soup = fetch_page(url)
                if not soup:
                    continue

                content = soup.find('main') or soup.find('article') or soup

                # Get the title
                title = content.find(['h1', 'h2'])
                name = title.get_text(strip=True) if title else child_slug.replace('-', ' ').title()

                # Get description from paragraphs
                paragraphs = content.find_all('p')[:5]
                desc = ' '.join(p.get_text(strip=True) for p in paragraphs)

                child_rule = {
                    'name': name,
                    'slug': child_slug,
                    'desc': desc[:2000]  # Limit description length
                }
                parent_rule['children'].append(child_rule)

            self.rules.append(parent_rule)

        print(f"  Found {len(self.rules)} rule sections")
        return self.rules


def main():
    parser = argparse.ArgumentParser(
        description='Scrape D&D 5e 2024 content from 5e24srd.com'
    )
    parser.add_argument(
        '--types',
        nargs='+',
        choices=['spells', 'classes', 'species', 'equipment', 'conditions', 'rules'],
        help='Content types to scrape'
    )
    parser.add_argument(
        '--all',
        action='store_true',
        help='Scrape all content types'
    )
    parser.add_argument(
        '--output',
        type=Path,
        default=None,
        help='Output directory (default: output/2024)'
    )

    args = parser.parse_args()

    # Determine what to scrape
    if args.all:
        types_to_scrape = ['spells', 'classes', 'species', 'equipment', 'conditions', 'rules']
    elif args.types:
        types_to_scrape = args.types
    else:
        types_to_scrape = ['spells', 'classes', 'species', 'equipment', 'conditions', 'rules']

    # Set output directory
    script_dir = Path(__file__).parent
    output_dir = args.output or script_dir / 'output' / EDITION
    output_dir.mkdir(parents=True, exist_ok=True)

    print(f"5e24srd.com Web Scraper")
    print(f"======================")
    print(f"Types: {', '.join(types_to_scrape)}")
    print(f"Output: {output_dir}")

    # Run scrapers
    scrapers = {
        'spells': SpellScraper,
        'dnd_classes': ClassScraper,
        'races': SpeciesScraper,  # Output as 'races' for Rails model compatibility
        'items': EquipmentScraper,
        'conditions': ConditionScraper,
        'rules': RuleScraper,
    }

    # Map user-friendly names to internal names
    type_map = {
        'spells': 'spells',
        'classes': 'dnd_classes',
        'species': 'races',
        'equipment': 'items',
        'conditions': 'conditions',
        'rules': 'rules',
    }

    for user_type in types_to_scrape:
        internal_type = type_map.get(user_type, user_type)
        scraper_class = scrapers.get(internal_type)

        if scraper_class:
            scraper = scraper_class()
            data = scraper.scrape()

            if data:
                output_file = output_dir / f"{internal_type}.json"
                with open(output_file, 'w', encoding='utf-8') as f:
                    json.dump(data, f, indent=2, ensure_ascii=False)
                print(f"  Wrote {len(data)} items to {output_file}")

    print(f"\nDone! JSON files written to {output_dir}")
    print(f"\nTo import into Rails:")
    print(f"  rails srd:import[2024]")


if __name__ == '__main__':
    main()
