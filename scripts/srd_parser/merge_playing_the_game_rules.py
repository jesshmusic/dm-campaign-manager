#!/usr/bin/env python3
"""
Merge playing_the_game_rules.json into rules.json

This script:
1. Removes the old "Playing the Game" entries from rules.json
2. Updates top-level playing the game rules to have parent_slug: "playing-the-game"
3. Maps 'order' field to 'sort_order' for database compatibility
4. Merges all playing the game rules into rules.json
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

    # Load playing the game rules
    ptg_path = OUTPUT_DIR / "playing_the_game_rules.json"
    with open(ptg_path, "r") as f:
        ptg_data = json.load(f)

    # Remove old "Playing the Game" category entries
    rules = [r for r in rules if r.get("category") != "Playing the Game"]

    # Create parent "Playing the Game" rule
    playing_the_game_parent = {
        "name": "Playing the Game",
        "slug": "playing-the-game",
        "edition": "2024",
        "category": "Playing the Game",
        "description": "The rules for playing Dungeons & Dragons.",
        "parent_slug": None,
        "sort_order": 0,
        "game_icon": "GiOpenBook"
    }
    rules.append(playing_the_game_parent)

    # Process playing the game rules - update top-level rules to have parent_slug
    for rule in ptg_data["rules"]:
        transformed = transform_rule(rule)

        # Top-level rules (parent_slug is null) become children of playing-the-game
        if transformed.get("parent_slug") is None:
            transformed["parent_slug"] = "playing-the-game"

        # Add the rule to the main rules list
        rules.append(transformed)

    # Save merged rules
    with open(rules_path, "w") as f:
        json.dump(rules, f, indent=2)

    print(f"Merged {len(ptg_data['rules'])} playing the game rules into rules.json")
    print(f"Total rules: {len(rules)}")

if __name__ == "__main__":
    main()
