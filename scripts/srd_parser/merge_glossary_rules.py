#!/usr/bin/env python3
"""
Merge rules_glossary_rules.json into rules.json

This script:
1. Removes the old "Rules Glossary" entry from rules.json (the big markdown blob)
2. Adds a new "Rules Glossary" parent rule with conventions/abbreviations content
3. Updates top-level glossary categories to have parent_slug: "rules-glossary"
4. Merges all glossary rules into rules.json
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

    # Load glossary rules
    glossary_path = OUTPUT_DIR / "rules_glossary_rules.json"
    with open(glossary_path, "r") as f:
        glossary_data = json.load(f)

    # Remove all existing "Rules Glossary" entries
    rules = [r for r in rules if r.get("category") != "Rules Glossary"]

    # Create new "Rules Glossary" parent rule with content as description
    rules_glossary_parent = {
        "name": "Rules Glossary",
        "slug": "rules-glossary",
        "edition": "2024",
        "category": "Rules Glossary",
        "description": glossary_data["content"],
        "parent_slug": None,
        "sort_order": 0,
        "game_icon": "GiBookmarklet"
    }
    rules.append(rules_glossary_parent)

    # Process glossary rules - update top-level categories to have parent_slug: "rules-glossary"
    for rule in glossary_data["rules"]:
        transformed = transform_rule(rule)

        # Top-level categories (parent_slug is null) should become children of rules-glossary
        if transformed.get("parent_slug") is None:
            transformed["parent_slug"] = "rules-glossary"

        # Add the rule to the main rules list
        rules.append(transformed)

    # Save merged rules
    with open(rules_path, "w") as f:
        json.dump(rules, f, indent=2)

    print(f"Merged {len(glossary_data['rules'])} glossary rules into rules.json")
    print(f"Total rules: {len(rules)}")

if __name__ == "__main__":
    main()
