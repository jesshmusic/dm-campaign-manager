# SRD PDF Parser

Python tool for extracting D&D System Reference Document (SRD) content from PDF files and converting it to JSON format compatible with the Rails application schema.

## Installation

```bash
cd scripts/srd_parser
pip install -r requirements.txt
```

## Usage

```bash
# Parse a 2024 SRD PDF
python parser.py /path/to/srd-5.2.pdf --edition 2024

# Parse a 2014 SRD PDF
python parser.py /path/to/srd-5.1.pdf --edition 2014

# Parse specific content types only
python parser.py /path/to/srd.pdf --edition 2024 --types monsters spells

# Output to custom directory
python parser.py /path/to/srd.pdf --edition 2024 --output ./custom_output
```

## Output Structure

JSON files are generated in `output/{edition}/` matching the Rails model schema:

```
output/
  2014/
    ability_scores.json
    conditions.json
    dnd_classes.json
    items.json
    monsters.json
    profs.json
    races.json
    rules.json
    sections.json
    skills.json
    spells.json
  2024/
    (same structure)
```

## JSON Schema

Each JSON file contains an array of objects matching the Rails model attributes.

### Example: monsters.json

```json
[
  {
    "name": "Adult Red Dragon",
    "slug": "adult-red-dragon",
    "size": "Huge",
    "monster_type": "Dragon",
    "alignment": "Chaotic Evil",
    "armor_class": 19,
    "hit_points": 256,
    "hit_dice": "19d12+133",
    "strength": 27,
    "dexterity": 10,
    "constitution": 25,
    "intelligence": 16,
    "wisdom": 13,
    "charisma": 21,
    "challenge_rating": "17",
    "xp": 18000,
    "prof_bonus": 6,
    "speeds": [
      {"name": "walk", "value": "40 ft."},
      {"name": "fly", "value": "80 ft."}
    ],
    "senses": [
      {"name": "darkvision", "value": "120 ft."}
    ],
    "actions": [
      {"name": "Multiattack", "desc": "The dragon can use its Frightful Presence..."}
    ],
    "special_abilities": [
      {"name": "Legendary Resistance", "desc": "If the dragon fails a saving throw..."}
    ],
    "saving_throws": ["Dexterity", "Constitution", "Wisdom", "Charisma"],
    "skills": ["Perception", "Stealth"]
  }
]
```

## Importing to Rails

After generating JSON files, use the Rails rake task:

```bash
# Import all content for an edition
rails srd:import[2024]

# Import specific content type
rails srd:import_type[monsters,2024]

# Check import status
rails srd:status
```

## Extending Extractors

To add or modify content extraction, edit the extractors in `extractors/`:

- `base.py` - Base extractor class with common functionality
- `monsters.py` - Monster stat block extraction
- `spells.py` - Spell extraction
- `classes.py` - Class feature extraction
- etc.

Each extractor implements `extract(pdf_pages)` returning a list of dictionaries.
