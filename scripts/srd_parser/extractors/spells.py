"""Spell extractor for 2024 SRD format."""

import re
from .base import BaseExtractor


class SpellExtractor(BaseExtractor):
    """Extracts spell data from SRD 5.2 PDF."""

    SCHOOLS = [
        'Abjuration', 'Conjuration', 'Divination', 'Enchantment',
        'Evocation', 'Illusion', 'Necromancy', 'Transmutation'
    ]

    CLASSES = [
        'Bard', 'Cleric', 'Druid', 'Paladin', 'Ranger',
        'Sorcerer', 'Warlock', 'Wizard'
    ]

    def extract(self, pages: list) -> list:
        """Extract spells from PDF pages."""
        spells = []

        # Combine relevant pages
        # Spells section starts around page 107 (0-indexed: 106)
        # Use column-based extraction for two-column PDF layout
        full_text = ""
        spell_section_started = False

        for i, page in enumerate(pages):
            # Quick check to see if we're in spell section
            quick_text = page.extract_text() or ''

            # Look for spell section start - around page 107
            if i >= 100 and 'Spell Descriptions' in quick_text:
                spell_section_started = True

            if spell_section_started:
                # Extract text column by column for proper reading order
                page_width = page.width
                mid_point = page_width / 2

                # Extract left column first, then right column
                left_col = page.crop((0, 0, mid_point, page.height))
                right_col = page.crop((mid_point, 0, page_width, page.height))

                left_text = left_col.extract_text() or ''
                right_text = right_col.extract_text() or ''

                # Combine: left column text first, then right column
                full_text += left_text + "\n" + right_text + "\n"

            # Stop at monster/creature section (around page 250+)
            if spell_section_started and i > 110:
                if 'Running a Monster' in quick_text or 'Monster Stat Blocks' in quick_text:
                    break

        # Parse spells
        spells = self._parse_spells(full_text)

        return spells

    def _parse_spells(self, text: str) -> list:
        """Parse spell text into individual spells."""
        spells = []

        # Spell format in 2024 SRD:
        # Spell Name
        # Level X School (Classes)
        # Casting Time: ...
        # Range: ...
        # Components: ...
        # Duration: ...
        # Description...

        lines = text.split('\n')
        current_spell = None
        current_lines = []

        for line in lines:
            line = line.strip()
            if not line:
                continue

            # Check if this is a spell header line (Level X School or Cantrip)
            spell_header = self._parse_spell_header(line)

            if spell_header:
                # Save previous spell
                if current_spell and self._is_valid_spell(current_spell):
                    spells.append(self._finalize_spell(current_spell))

                # Get spell name from previous line
                name = current_lines[-1] if current_lines else ''

                # Start new spell
                current_spell = {
                    'name': name.strip(),
                    'slug': self.make_slug(name.strip()),
                    'level': spell_header['level'],
                    'school': spell_header['school'],
                    'casting_time': '',
                    'range': '',
                    'components': '',
                    'material': '',
                    'duration': '',
                    'concentration': False,
                    'ritual': spell_header.get('ritual', False),
                    'description': '',
                    'higher_level': '',
                    'classes': spell_header.get('classes', []),
                    '_parsing_description': False,
                    '_parsing_higher_level': False
                }
                current_lines = []
                continue

            # Parse spell details
            if current_spell:
                self._parse_spell_line(current_spell, line)

            current_lines.append(line)

        # Don't forget the last spell
        if current_spell and self._is_valid_spell(current_spell):
            spells.append(self._finalize_spell(current_spell))

        return spells

    def _parse_spell_header(self, line: str) -> dict:
        """Parse spell header line (Level X School (Classes))."""
        # Cantrip pattern: "Evocation Cantrip (Sorcerer, Wizard)"
        cantrip_match = re.match(
            r'(\w+)\s+Cantrip\s*\(([^)]+)\)',
            line, re.IGNORECASE
        )
        if cantrip_match:
            school = cantrip_match.group(1)
            classes = [c.strip() for c in cantrip_match.group(2).split(',')]
            return {'level': 0, 'school': school.capitalize(), 'classes': classes}

        # Level spell pattern: "Level 2 Evocation (Wizard)"
        level_match = re.match(
            r'Level\s+(\d+)\s+(\w+)\s*\(([^)]+)\)',
            line, re.IGNORECASE
        )
        if level_match:
            level = int(level_match.group(1))
            school = level_match.group(2)
            classes = [c.strip() for c in level_match.group(3).split(',')]
            ritual = 'Ritual' in line
            return {'level': level, 'school': school.capitalize(), 'classes': classes, 'ritual': ritual}

        return None

    def _parse_spell_line(self, spell: dict, line: str):
        """Parse a spell detail line."""

        # Casting Time
        ct_match = re.match(r'Casting Time:\s*(.+)', line, re.IGNORECASE)
        if ct_match:
            spell['casting_time'] = ct_match.group(1).strip()
            spell['_parsing_description'] = False
            return

        # Range
        range_match = re.match(r'Range:\s*(.+)', line, re.IGNORECASE)
        if range_match:
            spell['range'] = range_match.group(1).strip()
            spell['_parsing_description'] = False
            return

        # Components
        comp_match = re.match(r'Components:\s*(.+)', line, re.IGNORECASE)
        if comp_match:
            components = comp_match.group(1).strip()
            spell['components'] = components

            # Extract material component if present
            mat_match = re.search(r'M\s*\(([^)]+)\)', components)
            if mat_match:
                spell['material'] = mat_match.group(1).strip()

            spell['_parsing_description'] = False
            return

        # Duration
        dur_match = re.match(r'Duration:\s*(.+)', line, re.IGNORECASE)
        if dur_match:
            duration = dur_match.group(1).strip()
            spell['duration'] = duration
            spell['concentration'] = 'Concentration' in duration
            spell['_parsing_description'] = True  # Description follows duration
            return

        # Higher level section
        if 'Higher-Level' in line or 'Using a Higher-Level' in line:
            spell['_parsing_description'] = False
            spell['_parsing_higher_level'] = True
            # Get the rest of the line after the header
            hl_match = re.search(r'(?:Using a )?Higher-Level Spell Slot[.:]?\s*(.*)$', line, re.IGNORECASE)
            if hl_match and hl_match.group(1):
                spell['higher_level'] = hl_match.group(1).strip()
            return

        # Cantrip Upgrade section (for cantrips, similar to higher level)
        if 'Cantrip Upgrade' in line:
            spell['_parsing_description'] = False
            spell['_parsing_higher_level'] = True
            cu_match = re.search(r'Cantrip Upgrade[.:]?\s*(.*)$', line, re.IGNORECASE)
            if cu_match and cu_match.group(1):
                spell['higher_level'] = cu_match.group(1).strip()
            return

        # If we're parsing description or higher level, append
        if spell.get('_parsing_higher_level'):
            if spell['higher_level']:
                spell['higher_level'] += ' ' + line
            else:
                spell['higher_level'] = line
        elif spell.get('_parsing_description'):
            if spell['description']:
                spell['description'] += ' ' + line
            else:
                spell['description'] = line

    def _is_valid_spell(self, spell: dict) -> bool:
        """Check if spell has minimum required data."""
        return (
            bool(spell.get('name')) and
            len(spell.get('name', '')) > 1 and
            spell.get('school') and
            spell.get('casting_time')
        )

    def _finalize_spell(self, spell: dict) -> dict:
        """Clean up and finalize spell data for export."""
        # Remove internal tracking fields
        spell.pop('_parsing_description', None)
        spell.pop('_parsing_higher_level', None)

        # Ensure slug is set
        if not spell.get('slug') and spell.get('name'):
            spell['slug'] = self.make_slug(spell['name'])

        # Convert classes list to comma-separated string for import
        if isinstance(spell.get('classes'), list):
            spell['dnd_classes'] = ', '.join(spell['classes'])
            spell.pop('classes', None)

        return spell
