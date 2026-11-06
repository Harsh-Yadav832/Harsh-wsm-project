"""
Module 2: tokenizer.py
Splits raw text into tokens using regular expressions while preserving token positions.
"""

import re
from typing import List, Tuple, Dict, Any, Optional


class Tokenizer:
    # Matches words containing alphanumeric characters (and internal hyphens/apostrophes optionally)
    # Using \b[\w]+(?:\'[\w]+)?\b to handle words cleanly
    WORD_REGEX = re.compile(r"\b[A-Za-z0-9]+(?:'[A-Za-z0-9]+)?\b")

    def __init__(self, pattern: Optional[str] = None):
        if pattern:
            self.regex = re.compile(pattern)
        else:
            self.regex = self.WORD_REGEX

    def tokenize(self, text: str) -> List[str]:
        """
        Extracts tokens from text in sequential order.
        Example: "Hello, World! Search Engines." -> ["Hello", "World", "Search", "Engines"]
        """
        if not text:
            return []
        return self.regex.findall(text)

    def tokenize_with_positions(self, text: str) -> List[Tuple[str, int]]:
        """
        Extracts tokens along with their zero-based index positions in token sequence.
        Returns list of (token, position) tuples.
        """
        tokens = self.tokenize(text)
        return [(token, pos) for pos, token in enumerate(tokens)]

    def tokenize_with_spans(self, text: str) -> List[Dict[str, Any]]:
        """
        Extracts tokens with sequence position and character start/end offsets.
        Useful for snippet highlighting.
        """
        results = []
        if not text:
            return results

        pos = 0
        for match in self.regex.finditer(text):
            results.append(
                {
                    "token": match.group(0),
                    "position": pos,
                    "start_char": match.start(),
                    "end_char": match.end(),
                }
            )
            pos += 1
        return results
