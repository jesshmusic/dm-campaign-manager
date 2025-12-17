"""Base extractor class for SRD content."""

import re
from abc import ABC, abstractmethod
from slugify import slugify


class BaseExtractor(ABC):
    """Base class for all content extractors."""

    def __init__(self, edition: str = '2024'):
        self.edition = edition

    @abstractmethod
    def extract(self, pages: list) -> list:
        """Extract content from PDF pages.

        Args:
            pages: List of page objects from pdfplumber

        Returns:
            List of dictionaries matching Rails model schema
        """
        pass

    def make_slug(self, name: str) -> str:
        """Generate a URL-friendly slug from a name."""
        return slugify(name, lowercase=True)

    def clean_text(self, text: str) -> str:
        """Clean and normalize extracted text."""
        if not text:
            return ''
        # Remove excessive whitespace
        text = re.sub(r'\s+', ' ', text)
        # Remove leading/trailing whitespace
        text = text.strip()
        return text

    def parse_dice(self, dice_str: str) -> dict:
        """Parse a dice expression like '2d6+4'.

        Returns:
            dict with keys: count, sides, modifier
        """
        match = re.match(r'(\d+)d(\d+)(?:\s*([+-])\s*(\d+))?', dice_str)
        if match:
            count = int(match.group(1))
            sides = int(match.group(2))
            modifier = 0
            if match.group(3) and match.group(4):
                modifier = int(match.group(4))
                if match.group(3) == '-':
                    modifier = -modifier
            return {'count': count, 'sides': sides, 'modifier': modifier}
        return None

    def parse_speed(self, speed_str: str) -> list:
        """Parse speed string like 'walk 30 ft., fly 60 ft.'

        Returns:
            List of dicts with name and value
        """
        speeds = []
        # Handle various speed formats
        patterns = [
            r'(\w+)\s+(\d+)\s*ft\.?',  # "walk 30 ft."
            r'(\d+)\s*ft\.?\s*(\w+)?',  # "30 ft. walk" or just "30 ft."
        ]

        for pattern in patterns:
            for match in re.finditer(pattern, speed_str, re.IGNORECASE):
                if match.group(1).isdigit():
                    value = f"{match.group(1)} ft."
                    name = match.group(2) if match.group(2) else 'walk'
                else:
                    name = match.group(1).lower()
                    value = f"{match.group(2)} ft."
                speeds.append({'name': name, 'value': value})

        return speeds if speeds else [{'name': 'walk', 'value': speed_str}]

    def ability_modifier(self, score: int) -> int:
        """Calculate ability modifier from score."""
        return (score - 10) // 2

    def cr_to_xp(self, cr: str) -> int:
        """Convert challenge rating to XP value."""
        cr_xp_map = {
            '0': 10, '1/8': 25, '1/4': 50, '1/2': 100,
            '1': 200, '2': 450, '3': 700, '4': 1100,
            '5': 1800, '6': 2300, '7': 2900, '8': 3900,
            '9': 5000, '10': 5900, '11': 7200, '12': 8400,
            '13': 10000, '14': 11500, '15': 13000, '16': 15000,
            '17': 18000, '18': 20000, '19': 22000, '20': 25000,
            '21': 33000, '22': 41000, '23': 50000, '24': 62000,
            '25': 75000, '26': 90000, '27': 105000, '28': 120000,
            '29': 135000, '30': 155000
        }
        return cr_xp_map.get(str(cr), 0)

    def cr_to_prof_bonus(self, cr: str) -> int:
        """Calculate proficiency bonus from CR."""
        try:
            cr_val = float(cr.replace('/', '.'))
            if cr_val < 5:
                return 2
            elif cr_val < 9:
                return 3
            elif cr_val < 13:
                return 4
            elif cr_val < 17:
                return 5
            elif cr_val < 21:
                return 6
            elif cr_val < 25:
                return 7
            elif cr_val < 29:
                return 8
            else:
                return 9
        except ValueError:
            return 2
