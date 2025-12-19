#!/usr/bin/env python3
"""
Merge SRD_5.2.1_Spells_import.json into rules.json

This script:
1. Removes the old "Spells" entries from rules.json
2. Updates top-level spells rules to have parent_slug: "spells"
3. Maps 'order' field to 'sort_order' for database compatibility
4. Merges all spells rules into rules.json
"""

import json
from pathlib import Path

OUTPUT_DIR = Path(__file__).parent / "output" / "2024"


def transform_rule(rule):
    """Transform a rule for database import (e.g., rename order -> sort_order)"""
    transformed = rule.copy()
    # Rename 'order' to 'sort_order' to match database column
    if 'order' in transformed:
        transformed['sort_order'] = transformed.pop('order')
    return transformed


def main():
    # Load existing rules
    rules_path = OUTPUT_DIR / "rules.json"
    with open(rules_path, "r") as f:
        rules = json.load(f)

    # Load spells rules
    spells_path = OUTPUT_DIR / "SRD_5.2.1_Spells_import.json"
    with open(spells_path, "r") as f:
        spells_data = json.load(f)

    # Remove old "Spells" category entries
    rules = [r for r in rules if r.get("category") != "Spells"]

    # Create parent "Spells" rule
    spells_parent = {
        "name": "Spells",
        "slug": "spells",
        "edition": "2024",
        "category": "Spells",
        "description": spells_data.get("content", "Rules for casting spells in Dungeons & Dragons."),
        "parent_slug": None,
        "sort_order": 4,
        "game_icon": "GiSpellBook"
    }
    rules.append(spells_parent)

    # Process spells rules - update top-level rules to have parent_slug
    for rule in spells_data["rules"]:
        transformed = transform_rule(rule)

        # Top-level rules (parent_slug is null) become children of spells
        if transformed.get("parent_slug") is None:
            transformed["parent_slug"] = "spells"

        # Add the rule to the main rules list
        rules.append(transformed)

    # Save merged rules
    with open(rules_path, "w") as f:
        json.dump(rules, f, indent=2)

    print(f"Merged {len(spells_data['rules'])} spells rules into rules.json")
    print(f"Total rules: {len(rules)}")

if __name__ == "__main__":
    main()
