"""Race extractor."""

from .base import BaseExtractor


class RaceExtractor(BaseExtractor):
    """Extracts race information from SRD PDF."""

    def extract(self, pages: list) -> list:
        """Extract race data from PDF pages.

        Races include:
        - Ability score bonuses
        - Traits
        - Size/speed information

        This is a placeholder implementation.
        """
        races = []

        # TODO: Implement actual extraction logic based on PDF structure

        return races
