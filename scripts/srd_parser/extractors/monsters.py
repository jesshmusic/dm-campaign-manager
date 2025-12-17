"""Monster stat block extractor for 2024 SRD format."""

import re
from .base import BaseExtractor


class MonsterExtractor(BaseExtractor):
    """Extracts monster stat blocks from SRD 5.2 PDF."""

    # Common size categories
    SIZES = ['Tiny', 'Small', 'Medium', 'Large', 'Huge', 'Gargantuan']

    # Monster types
    TYPES = [
        'Aberration', 'Beast', 'Celestial', 'Construct', 'Dragon',
        'Elemental', 'Fey', 'Fiend', 'Giant', 'Humanoid', 'Monstrosity',
        'Ooze', 'Plant', 'Undead'
    ]

    # Alignments
    ALIGNMENTS = [
        'Lawful Good', 'Lawful Neutral', 'Lawful Evil',
        'Neutral Good', 'Neutral', 'Neutral Evil',
        'Chaotic Good', 'Chaotic Neutral', 'Chaotic Evil',
        'Unaligned', 'Any Alignment'
    ]

    def extract(self, pages: list) -> list:
        """Extract monster stat blocks from PDF pages."""
        monsters = []

        # Combine all pages into one text for easier parsing
        # Monsters section starts around page 258 (0-indexed: 257)
        # Use column-based extraction for two-column PDF layout
        full_text = ""
        monster_section_started = False

        for i, page in enumerate(pages):
            # Quick check to see if we're in monster section
            quick_text = page.extract_text() or ''

            # Monster section starts around page 254 (after "Running a Monster" section)
            if i >= 250 and 'Aboleth' in quick_text and 'Large Aberration' in quick_text:
                monster_section_started = True

            if monster_section_started:
                # Extract text column by column for proper reading order
                # Page width is typically 594, split at midpoint
                page_width = page.width
                mid_point = page_width / 2

                # Extract left column first, then right column
                left_col = page.crop((0, 0, mid_point, page.height))
                right_col = page.crop((mid_point, 0, page_width, page.height))

                left_text = left_col.extract_text() or ''
                right_text = right_col.extract_text() or ''

                # Combine: left column text first, then right column
                full_text += left_text + "\n" + right_text + "\n"

            # Stop at creature lists or gameplay toolbox sections
            if monster_section_started and i > 260:
                if 'Creature Lists' in quick_text or 'Gameplay Toolbox' in quick_text:
                    break

        # Parse the combined text for monster stat blocks
        monsters = self._parse_monster_text(full_text)

        return monsters

    def _parse_monster_text(self, text: str) -> list:
        """Parse the combined monster text into individual monsters."""
        monsters = []

        # Split by monster name pattern
        # In 2024 SRD, monsters have format:
        # Monster Name
        # Size Type, Alignment
        # AC ## Initiative +# (#)
        # HP ## (dice)
        # Speed ...

        # Pattern to find monster headers: Name followed by Size Type, Alignment
        # Looking for lines that match: "Name\nSize Type, Alignment"
        size_pattern = '|'.join(self.SIZES)
        type_pattern = '|'.join(self.TYPES)

        # Split into potential monster blocks by finding headers
        lines = text.split('\n')
        current_monster = None
        current_lines = []

        for i, line in enumerate(lines):
            line = line.strip()
            if not line:
                continue

            # Check if this line is a size/type/alignment line
            size_type_match = re.match(
                rf'^({size_pattern})(?:\s+or\s+({size_pattern}))?\s+({type_pattern})(?:\s+\(([^)]+)\))?,\s*(.+)$',
                line, re.IGNORECASE
            )

            if size_type_match:
                # This is a monster type line - previous line should be the name
                if current_lines and len(current_lines) >= 1:
                    # Save previous monster
                    if current_monster and self._is_valid_monster(current_monster):
                        monsters.append(self._finalize_monster(current_monster))

                    # Get the monster name from the previous non-empty line
                    name = current_lines[-1] if current_lines else ''

                    # Start new monster
                    current_monster = self._create_monster(
                        name=name,
                        size=size_type_match.group(1),
                        monster_type=size_type_match.group(3),
                        subtype=size_type_match.group(4),
                        alignment=size_type_match.group(5)
                    )
                    current_lines = []
                continue

            # If we have a current monster, parse the line
            if current_monster:
                self._parse_stat_line(current_monster, line)

            current_lines.append(line)

        # Don't forget the last monster
        if current_monster and self._is_valid_monster(current_monster):
            monsters.append(self._finalize_monster(current_monster))

        return monsters

    def _create_monster(self, name: str, size: str, monster_type: str,
                        subtype: str = None, alignment: str = '') -> dict:
        """Create a new monster dictionary with defaults."""
        return {
            'name': name.strip(),
            'slug': self.make_slug(name.strip()),
            'size': size.capitalize(),
            'monster_type': monster_type.capitalize(),
            'monster_subtype': subtype or '',
            'alignment': alignment.strip() if alignment else '',
            'armor_class': 10,
            'hit_points': 0,
            'hit_dice': '',
            'strength': 10,
            'dexterity': 10,
            'constitution': 10,
            'intelligence': 10,
            'wisdom': 10,
            'charisma': 10,
            'challenge_rating': '0',
            'xp': 0,
            'prof_bonus': 2,
            'languages': '',
            'speeds': [],
            'senses': [],
            'damage_resistances': [],
            'damage_immunities': [],
            'damage_vulnerabilities': [],
            'condition_immunities': [],
            'saving_throws': [],
            'skills': [],
            'actions': [],
            'special_abilities': [],
            'reactions': [],
            'legendary_actions': [],
            '_section': 'stats',
            '_current_action': None
        }

    def _parse_stat_line(self, monster: dict, line: str):
        """Parse a line from the monster stat block."""
        line = line.strip()
        if not line:
            return

        # Section headers
        if line == 'Traits':
            monster['_section'] = 'traits'
            return
        if line == 'Actions':
            monster['_section'] = 'actions'
            return
        if line == 'Bonus Actions':
            monster['_section'] = 'bonus_actions'
            return
        if line == 'Reactions':
            monster['_section'] = 'reactions'
            return
        if line.startswith('Legendary Actions') or line == 'Legendary Actions':
            monster['_section'] = 'legendary_actions'
            return

        # Parse based on section
        section = monster.get('_section', 'stats')

        if section == 'stats':
            self._parse_stats_section(monster, line)
        elif section == 'traits':
            self._parse_trait_or_ability(monster, line, 'special_abilities')
        elif section == 'actions':
            self._parse_trait_or_ability(monster, line, 'actions')
        elif section == 'bonus_actions':
            self._parse_trait_or_ability(monster, line, 'actions')  # Merge with actions
        elif section == 'reactions':
            self._parse_trait_or_ability(monster, line, 'reactions')
        elif section == 'legendary_actions':
            self._parse_trait_or_ability(monster, line, 'legendary_actions')

    def _parse_stats_section(self, monster: dict, line: str):
        """Parse the stats section (AC, HP, Speed, abilities, etc.)"""

        # AC pattern: "AC 17 Initiative +7 (17)" or just "AC 17"
        ac_match = re.search(r'AC\s+(\d+)', line)
        if ac_match:
            monster['armor_class'] = int(ac_match.group(1))
            return

        # HP pattern: "HP 150 (20d10 + 40)"
        hp_match = re.search(r'HP\s+(\d+)\s*\(([^)]+)\)', line)
        if hp_match:
            monster['hit_points'] = int(hp_match.group(1))
            monster['hit_dice'] = hp_match.group(2).strip()
            return

        # Speed pattern: "Speed 30 ft., Fly 60 ft."
        speed_match = re.search(r'Speed\s+(.+)', line, re.IGNORECASE)
        if speed_match:
            monster['speeds'] = self._parse_speeds(speed_match.group(1))
            return

        # Ability scores pattern (2024 format):
        # "Str 21 +5 +5 Dex 9 −1 +3 Con 15 +2 +6"
        # or multiline:
        # "Str 21 +5 +5"
        ability_match = re.search(
            r'Str\s+(\d+)\s+[+−-]?\d+\s+[+−-]?\d+\s*'
            r'(?:Dex\s+(\d+)\s+[+−-]?\d+\s+[+−-]?\d+)?\s*'
            r'(?:Con\s+(\d+)\s+[+−-]?\d+\s+[+−-]?\d+)?',
            line
        )
        if ability_match:
            if ability_match.group(1):
                monster['strength'] = int(ability_match.group(1))
            if ability_match.group(2):
                monster['dexterity'] = int(ability_match.group(2))
            if ability_match.group(3):
                monster['constitution'] = int(ability_match.group(3))
            return

        # Second row of abilities
        ability_match2 = re.search(
            r'Int\s+(\d+)\s+[+−-]?\d+\s+[+−-]?\d+\s*'
            r'(?:WIS\s+(\d+)\s+[+−-]?\d+\s+[+−-]?\d+)?\s*'
            r'(?:Cha\s+(\d+)\s+[+−-]?\d+\s+[+−-]?\d+)?',
            line, re.IGNORECASE
        )
        if ability_match2:
            if ability_match2.group(1):
                monster['intelligence'] = int(ability_match2.group(1))
            if ability_match2.group(2):
                monster['wisdom'] = int(ability_match2.group(2))
            if ability_match2.group(3):
                monster['charisma'] = int(ability_match2.group(3))
            return

        # CR pattern: "CR 10 (XP 5,900, or 7,200 in lair; PB +4)"
        cr_match = re.search(r'CR\s+(\d+(?:/\d+)?)\s*\(XP\s+([0-9,]+)', line)
        if cr_match:
            monster['challenge_rating'] = cr_match.group(1)
            monster['xp'] = int(cr_match.group(2).replace(',', ''))
            # Extract PB if present
            pb_match = re.search(r'PB\s+\+(\d+)', line)
            if pb_match:
                monster['prof_bonus'] = int(pb_match.group(1))
            else:
                monster['prof_bonus'] = self.cr_to_prof_bonus(cr_match.group(1))
            return

        # Skills pattern: "Skills History +12, Perception +10"
        skills_match = re.search(r'Skills?\s+(.+)', line, re.IGNORECASE)
        if skills_match and ('History' in line or 'Perception' in line or 'Stealth' in line or 'Acrobatics' in line or 'Athletics' in line):
            monster['skills'] = self._parse_skills(skills_match.group(1))
            return

        # Senses pattern: "Senses Darkvision 120 ft.; Passive Perception 20"
        senses_match = re.search(r'Senses\s+(.+)', line, re.IGNORECASE)
        if senses_match:
            monster['senses'] = self._parse_senses(senses_match.group(1))
            return

        # Languages pattern
        lang_match = re.search(r'Languages?\s+(.+)', line, re.IGNORECASE)
        if lang_match:
            monster['languages'] = lang_match.group(1).strip()
            return

        # Resistances pattern
        resist_match = re.search(r'Resistances?\s+(.+)', line, re.IGNORECASE)
        if resist_match:
            resistances = self._parse_damage_types(resist_match.group(1))
            monster['damage_resistances'] = resistances
            return

        # Immunities pattern (damage and condition)
        immun_match = re.search(r'Immunities\s+(.+)', line, re.IGNORECASE)
        if immun_match:
            self._parse_immunities(monster, immun_match.group(1))
            return

        # Vulnerabilities pattern
        vuln_match = re.search(r'Vulnerabilities\s+(.+)', line, re.IGNORECASE)
        if vuln_match:
            monster['damage_vulnerabilities'] = self._parse_damage_types(vuln_match.group(1))
            return

    def _parse_trait_or_ability(self, monster: dict, line: str, section: str):
        """Parse traits, actions, reactions, or legendary actions."""
        # Check if this is a new ability (Name. Description pattern)
        # Also handle "Name (X/Day)." or "Name (Recharge 5-6)."
        ability_start = re.match(r'^([A-Z][^.]+(?:\([^)]+\))?)\.\s*(.*)$', line)

        if ability_start:
            name = ability_start.group(1).strip()
            desc = ability_start.group(2).strip()

            ability = {'name': name, 'desc': desc}
            monster[section].append(ability)
            monster['_current_action'] = ability
        elif monster.get('_current_action') and monster['_current_action'] in monster[section]:
            # Continuation of previous ability
            monster['_current_action']['desc'] += ' ' + line

    def _parse_speeds(self, speed_text: str) -> list:
        """Parse speed string into list of speed objects."""
        speeds = []
        speed_text = speed_text.strip()

        # Match patterns like "30 ft." or "Fly 60 ft. (hover)"
        speed_pattern = r'(?:(\w+)\s+)?(\d+)\s*ft\.?(?:\s*\(([^)]+)\))?'

        for match in re.finditer(speed_pattern, speed_text, re.IGNORECASE):
            speed_type = match.group(1) or 'walk'
            value = match.group(2)
            note = match.group(3) or ''

            speeds.append({
                'name': speed_type.lower(),
                'value': f"{value} ft.{' (' + note + ')' if note else ''}"
            })

        return speeds

    def _parse_senses(self, senses_text: str) -> list:
        """Parse senses string into list of sense objects."""
        senses = []

        sense_types = ['darkvision', 'blindsight', 'tremorsense', 'truesight']
        for sense in sense_types:
            match = re.search(rf'{sense}\s+(\d+)\s*ft\.?', senses_text, re.IGNORECASE)
            if match:
                senses.append({'name': sense, 'value': f"{match.group(1)} ft."})

        # Passive Perception
        pp_match = re.search(r'Passive Perception\s+(\d+)', senses_text, re.IGNORECASE)
        if pp_match:
            senses.append({'name': 'passive perception', 'value': pp_match.group(1)})

        return senses

    def _parse_skills(self, skills_text: str) -> list:
        """Parse skills string into list of skill objects."""
        skills = []
        # Match "Skill +X" patterns
        for match in re.finditer(r'([A-Za-z]+)\s+([+−-]\d+)', skills_text):
            skills.append({
                'name': match.group(1),
                'value': match.group(2).replace('−', '-')
            })
        return skills

    def _parse_damage_types(self, text: str) -> list:
        """Parse damage types from a string."""
        damage_types = []
        common_types = [
            'acid', 'bludgeoning', 'cold', 'fire', 'force', 'lightning',
            'necrotic', 'piercing', 'poison', 'psychic', 'radiant',
            'slashing', 'thunder'
        ]
        text_lower = text.lower()
        for dtype in common_types:
            if dtype in text_lower:
                damage_types.append(dtype.capitalize())
        return damage_types

    def _parse_immunities(self, monster: dict, text: str):
        """Parse immunities (both damage and condition)."""
        # Damage types come first, then conditions after semicolon
        parts = text.split(';')

        # First part is damage immunities
        if parts:
            monster['damage_immunities'] = self._parse_damage_types(parts[0])

        # Second part (if exists) is condition immunities
        if len(parts) > 1:
            conditions = [
                'blinded', 'charmed', 'deafened', 'exhaustion', 'frightened',
                'grappled', 'incapacitated', 'invisible', 'paralyzed',
                'petrified', 'poisoned', 'prone', 'restrained', 'stunned',
                'unconscious'
            ]
            cond_text = parts[1].lower()
            for cond in conditions:
                if cond in cond_text:
                    monster['condition_immunities'].append(cond.capitalize())

    def _is_valid_monster(self, monster: dict) -> bool:
        """Check if monster has minimum required data."""
        return (
            bool(monster.get('name')) and
            len(monster.get('name', '')) > 1 and
            monster.get('hit_points', 0) > 0
        )

    def _finalize_monster(self, monster: dict) -> dict:
        """Clean up and finalize monster data for export."""
        # Remove internal tracking fields
        monster.pop('_section', None)
        monster.pop('_current_action', None)

        # Ensure slug is set
        if not monster.get('slug') and monster.get('name'):
            monster['slug'] = self.make_slug(monster['name'])

        return monster
