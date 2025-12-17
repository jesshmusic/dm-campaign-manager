#!/usr/bin/env python3
"""
SRD PDF Parser

Extracts D&D System Reference Document content from PDF files
and outputs JSON files compatible with the Rails application schema.

Usage:
    python parser.py /path/to/srd.pdf --edition 2024
    python parser.py /path/to/srd.pdf --edition 2014 --types monsters spells
"""

import argparse
import json
import sys
from pathlib import Path

try:
    import pdfplumber
except ImportError:
    print("Error: pdfplumber not installed. Run: pip install pdfplumber")
    sys.exit(1)

from extractors import (
    MonsterExtractor,
    SpellExtractor,
    RuleExtractor,
    ClassExtractor,
    RaceExtractor,
    ItemExtractor,
    ConditionExtractor,
    SkillExtractor,
    AbilityScoreExtractor,
    ProfExtractor,
)


# Map content types to their extractors
EXTRACTORS = {
    'monsters': MonsterExtractor,
    'spells': SpellExtractor,
    'rules': RuleExtractor,
    'dnd_classes': ClassExtractor,
    'races': RaceExtractor,
    'items': ItemExtractor,
    'conditions': ConditionExtractor,
    'skills': SkillExtractor,
    'ability_scores': AbilityScoreExtractor,
    'profs': ProfExtractor,
}

ALL_TYPES = list(EXTRACTORS.keys())


def parse_pdf(pdf_path: Path, edition: str, content_types: list, output_dir: Path):
    """Parse a PDF and extract specified content types."""

    print(f"Opening PDF: {pdf_path}")

    with pdfplumber.open(pdf_path) as pdf:
        pages = pdf.pages
        print(f"Found {len(pages)} pages")

        for content_type in content_types:
            if content_type not in EXTRACTORS:
                print(f"Warning: Unknown content type '{content_type}', skipping")
                continue

            print(f"\nExtracting {content_type}...")

            # Create extractor instance
            extractor_class = EXTRACTORS[content_type]
            extractor = extractor_class(edition=edition)

            # Extract content
            data = extractor.extract(pages)

            if data:
                # Write JSON output
                output_file = output_dir / f"{content_type}.json"
                with open(output_file, 'w', encoding='utf-8') as f:
                    json.dump(data, f, indent=2, ensure_ascii=False)

                print(f"  Extracted {len(data)} {content_type} -> {output_file}")
            else:
                print(f"  No {content_type} found")


def main():
    parser = argparse.ArgumentParser(
        description='Extract SRD content from PDF to JSON'
    )
    parser.add_argument(
        'pdf_path',
        type=Path,
        help='Path to the SRD PDF file'
    )
    parser.add_argument(
        '--edition',
        type=str,
        default='2024',
        choices=['2014', '2024'],
        help='D&D edition (default: 2024)'
    )
    parser.add_argument(
        '--types',
        nargs='+',
        default=ALL_TYPES,
        choices=ALL_TYPES,
        help='Content types to extract (default: all)'
    )
    parser.add_argument(
        '--output',
        type=Path,
        default=None,
        help='Output directory (default: output/{edition})'
    )

    args = parser.parse_args()

    # Validate PDF path
    if not args.pdf_path.exists():
        print(f"Error: PDF file not found: {args.pdf_path}")
        sys.exit(1)

    # Set output directory
    if args.output:
        output_dir = args.output
    else:
        script_dir = Path(__file__).parent
        output_dir = script_dir / 'output' / args.edition

    # Create output directory
    output_dir.mkdir(parents=True, exist_ok=True)

    print(f"SRD Parser")
    print(f"=========")
    print(f"PDF: {args.pdf_path}")
    print(f"Edition: {args.edition}")
    print(f"Types: {', '.join(args.types)}")
    print(f"Output: {output_dir}")

    # Run extraction
    parse_pdf(args.pdf_path, args.edition, args.types, output_dir)

    print(f"\nDone! JSON files written to {output_dir}")
    print(f"\nTo import into Rails:")
    print(f"  rails srd:import[{args.edition}]")


if __name__ == '__main__':
    main()
