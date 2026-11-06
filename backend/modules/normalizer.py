"""
Module 3: normalizer.py
Standardizes tokens (lowercasing, punctuation stripping, optional stopword handling)
ensuring that queries and documents share the exact same preprocessing pipeline.
"""

import string
import unicodedata
from typing import List, Tuple, Set, Optional


class Normalizer:
    # Standard English stopwords (can be enabled or disabled)
    DEFAULT_STOPWORDS = {
        "a", "about", "above", "after", "again", "against", "all", "am", "an", "and",
        "any", "are", "aren't", "as", "at", "be", "because", "been", "before", "being",
        "below", "between", "both", "but", "by", "can't", "cannot", "could", "couldn't",
        "did", "didn't", "do", "does", "doesn't", "doing", "don't", "down", "during",
        "each", "few", "for", "from", "further", "had", "hadn't", "has", "hasn't",
        "have", "haven't", "having", "he", "he'd", "he'll", "he's", "her", "here",
        "here's", "hers", "herself", "him", "himself", "his", "how", "how's", "i",
        "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is", "isn't", "it", "it's",
        "its", "itself", "let's", "me", "more", "most", "mustn't", "my", "myself",
        "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other", "ought",
        "our", "ours", "ourselves", "out", "over", "own", "same", "shan't", "she",
        "she'd", "she'll", "she's", "should", "shouldn't", "so", "some", "such",
        "than", "that", "that's", "the", "their", "theirs", "them", "themselves",
        "then", "there", "there's", "these", "they", "they'd", "they'll", "they're",
        "they've", "this", "those", "through", "to", "too", "under", "until", "up",
        "very", "was", "wasn't", "we", "we'd", "we'll", "we're", "we've", "were",
        "weren't", "what", "what's", "when", "when's", "where", "where's", "which",
        "while", "who", "who's", "whom", "why", "why's", "with", "won't", "would",
        "wouldn't", "you", "you'd", "you'll", "you're", "you've", "your", "yours",
        "yourself", "yourselves"
    }

    def __init__(self, remove_stopwords: bool = False, custom_stopwords: Optional[Set[str]] = None):
        self.remove_stopwords = remove_stopwords
        self.stopwords = custom_stopwords if custom_stopwords is not None else self.DEFAULT_STOPWORDS

    def normalize_term(self, term: str) -> str:
        """
        Normalizes a single token:
        1. Strip whitespace
        2. Unicode normalization (NFKD)
        3. Lowercase
        4. Strip surrounding punctuation
        """
        if not term:
            return ""
        term = unicodedata.normalize("NFKD", term).encode("ascii", "ignore").decode("utf-8")
        term = term.lower()
        term = term.strip(string.punctuation)
        return term

    def normalize_tokens(self, tokens: List[str]) -> List[str]:
        """
        Normalizes a list of string tokens.
        """
        normalized = []
        for token in tokens:
            cleaned = self.normalize_term(token)
            if not cleaned:
                continue
            if self.remove_stopwords and cleaned in self.stopwords:
                continue
            normalized.append(cleaned)
        return normalized

    def normalize_positional_tokens(self, positional_tokens: List[Tuple[str, int]]) -> List[Tuple[str, int]]:
        """
        Normalizes tokens while preserving their original positional indices.
        Important: If stopword removal is off, positions strictly mirror word indices.
        """
        results = []
        for token, pos in positional_tokens:
            cleaned = self.normalize_term(token)
            if not cleaned:
                continue
            if self.remove_stopwords and cleaned in self.stopwords:
                continue
            results.append((cleaned, pos))
        return results
