"""
Module 6: wildcard_processor.py
Handles wildcard search queries (* and ?) over the inverted index vocabulary.
Examples:
  prem* -> premchand, premature
  *ing  -> mining, searching, learning
  m*n   -> mining, man, maintain
  *tion*-> information, extraction
"""

import re
from typing import List, Dict, Set, Tuple, Any
from .inverted_index import PositionalInvertedIndex


class WildcardProcessor:
    def __init__(self, index: PositionalInvertedIndex):
        self.index = index

    @staticmethod
    def is_wildcard_pattern(token: str) -> bool:
        """
        Checks whether a token contains wildcard characters.
        """
        return "*" in token or "?" in token

    @staticmethod
    def pattern_to_regex(pattern: str) -> re.Pattern:
        """
        Safely converts a wildcard query (e.g., 'prem*', '*ing', 'm*n') into a compiled regex.
        Escapes regex-sensitive characters, then replaces '*' with '.*' and '?' with '.'.
        """
        # Escape all regex meta-characters except * and ?
        escaped = re.escape(pattern)
        # re.escape escapes '*' to r'\*' and '?' to r'\?'
        regex_pattern = "^" + escaped.replace(r"\*", ".*").replace(r"\?", ".") + "$"
        return re.compile(regex_pattern, re.IGNORECASE)

    def find_matching_terms(self, pattern: str) -> List[str]:
        """
        Scans the current inverted index vocabulary and returns all terms
        matching the wildcard pattern.
        """
        if not self.is_wildcard_pattern(pattern):
            return [pattern.lower()] if pattern.lower() in self.index.index else []

        try:
            compiled_regex = self.pattern_to_regex(pattern)
        except re.error:
            return []

        vocab = self.index.get_vocabulary()
        matching_terms = [term for term in vocab if compiled_regex.match(term)]
        return matching_terms

    def execute_wildcard(self, pattern: str) -> Dict[str, Any]:
        """
        Resolves a wildcard query by:
        1. Finding all vocabulary matches.
        2. Merging postings lists across matching terms.
        3. Returning matching terms, documents, and combined positions.
        """
        matching_terms = self.find_matching_terms(pattern)
        combined_postings: Dict[str, List[int]] = {}

        for term in matching_terms:
            postings = self.index.get_postings(term)
            for doc_id, positions in postings.items():
                if doc_id not in combined_postings:
                    combined_postings[doc_id] = []
                combined_postings[doc_id].extend(positions)

        # Sort positions for each document
        for doc_id in combined_postings:
            combined_postings[doc_id].sort()

        return {
            "pattern": pattern,
            "matching_terms": matching_terms,
            "matching_doc_ids": list(combined_postings.keys()),
            "postings": combined_postings,
            "total_terms_matched": len(matching_terms),
        }
