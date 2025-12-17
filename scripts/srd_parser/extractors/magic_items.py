"""Magic Item extractor for SRD 5.2.1 (2024 edition)."""

import re
from .base import BaseExtractor


class MagicItemExtractor(BaseExtractor):
    """Extracts magic item information from SRD PDF pages 209-253."""

    # Pattern to match magic item header: Name followed by type line
    # Type line format: "Type, Rarity (Requires Attunement)"
    ITEM_HEADER_PATTERN = re.compile(
        r'^(?P<name>[A-Z][^,\n]+?)\s*\n'
        r'(?P<type_line>(?:Armor|Weapon|Potion|Ring|Rod|Scroll|Staff|Wand|Wondrous Item)[^\n]+)',
        re.MULTILINE
    )

    # Rarity patterns
    RARITY_PATTERN = r'(Common|Uncommon|Rare|Very Rare|Legendary|Artifact)'

    # Attunement pattern
    ATTUNEMENT_PATTERN = r'\(Requires Attunement[^)]*\)'

    def extract(self, pages: list) -> list:
        """Extract magic items from PDF pages 209-253.

        Returns a list of magic item dictionaries.
        """
        items = []

        # Magic Items A-Z section is pages 209-253 (indices 208-252)
        start_page = 208  # 0-indexed
        end_page = 253  # 0-indexed (exclusive)

        # Process each page individually to avoid column mixing
        for page_idx in range(start_page, min(end_page, len(pages))):
            page = pages[page_idx]

            # Try to extract text by column using bboxes
            page_items = self._extract_items_from_page(page)
            items.extend(page_items)

        # Deduplicate by slug
        seen_slugs = set()
        unique_items = []
        for item in items:
            if item['slug'] not in seen_slugs:
                seen_slugs.add(item['slug'])
                unique_items.append(item)

        return unique_items

    def _extract_items_from_page(self, page) -> list:
        """Extract magic items from a single page."""
        items = []

        # Get page dimensions
        width = page.width
        mid_x = width / 2

        # Extract left column
        left_bbox = (0, 0, mid_x - 5, page.height)
        left_text = page.within_bbox(left_bbox).extract_text() or ""

        # Extract right column
        right_bbox = (mid_x + 5, 0, width, page.height)
        right_text = page.within_bbox(right_bbox).extract_text() or ""

        # Parse items from each column
        for col_text in [left_text, right_text]:
            col_items = self._parse_items_from_text(col_text)
            items.extend(col_items)

        return items

    def _parse_items_from_text(self, text: str) -> list:
        """Parse magic items from a column of text."""
        items = []

        # Split into lines
        lines = text.split('\n')

        i = 0
        while i < len(lines):
            line = lines[i].strip()

            # Check if this line + next line form an item header
            if i + 1 < len(lines):
                next_line = lines[i + 1].strip()
                item = self._try_parse_item_header(line, next_line)

                if item:
                    # Collect description from subsequent lines
                    description_lines = []
                    j = i + 2

                    while j < len(lines):
                        desc_line = lines[j].strip()
                        # Stop if we hit another item header
                        if j + 1 < len(lines):
                            next_check = lines[j + 1].strip() if j + 1 < len(lines) else ""
                            if self._try_parse_item_header(desc_line, next_check):
                                break
                        # Also stop if this line looks like a type line (starts another item)
                        if self._is_type_line(desc_line):
                            break
                        description_lines.append(desc_line)
                        j += 1

                    item['description'] = ' '.join(description_lines).strip()
                    # Clean up description - remove page numbers and headers
                    item['description'] = self._clean_description(item['description'])

                    if len(item['description']) > 10:  # Only add items with actual descriptions
                        items.append(item)

                    i = j
                    continue

            i += 1

        return items

    def _try_parse_item_header(self, name_line: str, type_line: str) -> dict | None:
        """Try to parse an item from name and type lines."""
        # Name line should be title case, not too long
        if not self._looks_like_item_name(name_line):
            return None

        # Type line should start with a known item type
        if not self._is_type_line(type_line):
            return None

        # Parse the item
        item = {
            'name': name_line,
            'slug': self._slugify(name_line),
            'edition': '2024',
            'type': 'MagicItem',
            'equipment_category': 'Magic Items',
            'rarity': None,
            'requires_attunement': False,
            'attunement_requirements': None,
            'desc': [],  # For compatibility with existing schema
            'weight': None,
            'special': [],
        }

        # Determine item type from type line
        item_type = self._detect_item_type(type_line)
        if item_type:
            item['type'] = self._map_item_type(item_type)
            item['item_subtype'] = item_type

        # Extract rarity
        rarity_match = re.search(self.RARITY_PATTERN, type_line)
        if rarity_match:
            item['rarity'] = rarity_match.group(1)

        # Extract attunement
        attune_match = re.search(self.ATTUNEMENT_PATTERN, type_line)
        if attune_match:
            item['requires_attunement'] = True
            attunement_text = attune_match.group(0)
            specific = re.search(r'by (a |an )?(.+)\)', attunement_text)
            if specific:
                item['attunement_requirements'] = specific.group(2)

        return item

    def _is_type_line(self, line: str) -> bool:
        """Check if a line is a magic item type line."""
        type_starters = [
            'Armor', 'Weapon', 'Potion', 'Ring', 'Rod',
            'Scroll', 'Staff', 'Wand', 'Wondrous Item'
        ]
        for starter in type_starters:
            if line.startswith(starter):
                return True
        return False

    def _detect_item_type(self, line: str) -> str | None:
        """Detect the item type from a type line."""
        type_mapping = {
            'Armor': 'Armor',
            'Weapon': 'Weapon',
            'Potion': 'Potion',
            'Ring': 'Ring',
            'Rod': 'Rod',
            'Scroll': 'Scroll',
            'Staff': 'Staff',
            'Wand': 'Wand',
            'Wondrous Item': 'Wondrous Item',
        }
        for key in type_mapping:
            if line.startswith(key):
                return type_mapping[key]
        return None

    def _looks_like_item_name(self, line: str) -> bool:
        """Check if a line looks like a magic item name."""
        if not line or len(line) > 50 or len(line) < 3:
            return False

        if line[0].islower():
            return False

        # Reject lines that look like descriptions or table content
        if '. ' in line or line.endswith('.'):
            return False
        if line.startswith('The ') or line.startswith('This ') or line.startswith('While '):
            return False
        if 'you ' in line.lower() or 'your ' in line.lower():
            return False

        # Check word count (item names are usually 1-6 words)
        words = line.split()
        if len(words) > 7 or len(words) < 1:
            return False

        # Known non-item-name words
        skip_lines = ['Lever Up Down', 'Up Down', 'Attunement)', 'Uncommon', 'Rare', 'Legendary']
        if line in skip_lines:
            return False

        return True

    def _map_item_type(self, item_subtype: str) -> str:
        """Map item subtype to database type."""
        type_mapping = {
            'Armor': 'MagicArmorItem',
            'Weapon': 'MagicWeaponItem',
            'Potion': 'MagicItem',
            'Ring': 'MagicItem',
            'Rod': 'MagicItem',
            'Scroll': 'MagicItem',
            'Staff': 'MagicItem',
            'Wand': 'MagicItem',
            'Wondrous Item': 'MagicItem',
        }
        return type_mapping.get(item_subtype, 'MagicItem')

    def _clean_description(self, desc: str) -> str:
        """Clean up description text."""
        # Remove page numbers like "210 System Reference Document 5.2.1"
        desc = re.sub(r'\d+\s+System Reference Document \d+\.\d+(\.\d+)?', '', desc)
        # Remove extra whitespace
        desc = re.sub(r'\s+', ' ', desc)
        return desc.strip()

    def _slugify(self, name: str) -> str:
        """Convert name to URL-friendly slug."""
        slug = name.lower()
        slug = re.sub(r'[^a-z0-9\s-]', '', slug)
        slug = re.sub(r'\s+', '-', slug)
        slug = re.sub(r'-+', '-', slug)
        return slug.strip('-')
