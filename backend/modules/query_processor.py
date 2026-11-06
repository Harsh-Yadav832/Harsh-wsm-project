"""
Module 5: query_processor.py
Processes user queries:
  - Normal term queries
  - Multi-term queries
  - Exact phrase queries ("...") using positional index
  - Boolean queries (AND, OR, NOT)
  - Wildcard queries (via WildcardProcessor)
  - TF-IDF Relevance ranking
  - Snippet generation and keyword highlighting
"""

import math
import re
import html
from typing import List, Dict, Set, Any, Optional, Tuple

from .tokenizer import Tokenizer
from .normalizer import Normalizer
from .inverted_index import PositionalInvertedIndex
from .wildcard_processor import WildcardProcessor


class QueryProcessor:
    def __init__(
        self,
        index: PositionalInvertedIndex,
        tokenizer: Optional[Tokenizer] = None,
        normalizer: Optional[Normalizer] = None,
    ):
        self.index = index
        self.tokenizer = tokenizer or Tokenizer()
        self.normalizer = normalizer or Normalizer(remove_stopwords=False)
        self.wildcard_processor = WildcardProcessor(index)

    def detect_query_type(self, raw_query: str) -> str:
        """
        Determines query category: 'phrase', 'boolean', 'wildcard', or 'term'.
        """
        q = raw_query.strip()
        if (q.startswith('"') and q.endswith('"')) or (q.count('"') >= 2):
            return "phrase"

        tokens = q.split()
        upper_tokens = [t.upper() for t in tokens]
        if any(op in upper_tokens for op in ("AND", "OR", "NOT")):
            return "boolean"

        if "*" in q or "?" in q:
            return "wildcard"

        return "free_text"

    def execute_phrase_query(self, phrase: str) -> Dict[str, List[int]]:
        """
        Executes exact phrase search using the positional inverted index.
        Returns: {doc_id: [start_positions_of_phrase]}
        """
        clean_phrase = phrase.strip().strip('"').strip("'")
        raw_tokens = self.tokenizer.tokenize(clean_phrase)
        norm_tokens = self.normalizer.normalize_tokens(raw_tokens)

        if not norm_tokens:
            return {}

        if len(norm_tokens) == 1:
            term = norm_tokens[0]
            return self.index.get_postings(term)

        # For phrase w0, w1, ..., wk-1
        first_term = norm_tokens[0]
        first_postings = self.index.get_postings(first_term)
        if not first_postings:
            return {}

        matching_docs: Dict[str, List[int]] = {}

        # Candidate docs must contain every term in the phrase
        candidate_docs = set(first_postings.keys())
        term_postings = [first_postings]

        for term in norm_tokens[1:]:
            postings = self.index.get_postings(term)
            if not postings:
                return {}
            candidate_docs.intersection_update(postings.keys())
            term_postings.append(postings)

        if not candidate_docs:
            return {}

        # For each candidate document, verify consecutive positions
        k = len(norm_tokens)
        for doc_id in candidate_docs:
            doc_matches = []
            w0_positions = term_postings[0][doc_id]

            for pos in w0_positions:
                is_phrase_match = True
                for i in range(1, k):
                    expected_pos = pos + i
                    if expected_pos not in term_postings[i][doc_id]:
                        is_phrase_match = False
                        break
                if is_phrase_match:
                    doc_matches.append(pos)

            if doc_matches:
                matching_docs[doc_id] = doc_matches

        return matching_docs

    def execute_boolean_query(self, query_str: str) -> Set[str]:
        """
        Evaluates Boolean queries with AND, OR, NOT operators.
        Examples:
          'data AND mining'
          'data OR information'
          'data NOT mining'
          'premchand AND stories NOT modern'
        """
        tokens = query_str.split()
        if not tokens:
            return set()

        all_doc_ids = set(self.index.documents.keys())

        def resolve_term(t: str) -> Set[str]:
            t_clean = t.strip().lower()
            if self.wildcard_processor.is_wildcard_pattern(t_clean):
                res = self.wildcard_processor.execute_wildcard(t_clean)
                return set(res["matching_doc_ids"])
            norm_t = self.normalizer.normalize_term(t_clean)
            postings = self.index.get_postings(norm_t)
            return set(postings.keys())

        # Simple left-to-right parser with operator precedence support
        current_docs: Optional[Set[str]] = None
        current_op = "AND"
        i = 0

        while i < len(tokens):
            token = tokens[i]
            token_upper = token.upper()

            if token_upper in ("AND", "OR", "NOT"):
                current_op = token_upper
                i += 1
                continue

            # Check if previous was NOT or AND NOT
            term_docs = resolve_term(token)

            if current_docs is None:
                if current_op == "NOT":
                    current_docs = all_doc_ids - term_docs
                else:
                    current_docs = set(term_docs)
            else:
                if current_op == "AND":
                    current_docs = current_docs.intersection(term_docs)
                elif current_op == "OR":
                    current_docs = current_docs.union(term_docs)
                elif current_op == "NOT":
                    current_docs = current_docs - term_docs

            # Default back to AND for consecutive terms
            current_op = "AND"
            i += 1

        return current_docs if current_docs is not None else set()

    def rank_documents(
        self,
        candidate_doc_ids: Set[str],
        query_terms: List[str],
        phrase_matches: Optional[Dict[str, List[int]]] = None,
    ) -> List[Dict[str, Any]]:
        """
        Ranks candidate documents using TF-IDF scoring and phrase boost.
        """
        total_docs = max(1, self.index.get_total_documents())
        scores: Dict[str, float] = {}
        matched_terms_per_doc: Dict[str, Set[str]] = {doc_id: set() for doc_id in candidate_doc_ids}

        # Calculate IDF for each query term
        idfs: Dict[str, float] = {}
        for term in query_terms:
            df = self.index.get_document_frequency(term)
            # Standard smoothed IDF formula
            idfs[term] = math.log10((total_docs + 1) / (df + 1)) + 1.0

        for doc_id in candidate_doc_ids:
            doc_len = max(1, self.index.doc_lengths.get(doc_id, 100))
            score = 0.0

            for term in query_terms:
                tf = self.index.get_term_frequency(term, doc_id)
                if tf > 0:
                    matched_terms_per_doc[doc_id].add(term)
                    # Logarithmic TF * IDF
                    term_score = (1.0 + math.log10(tf)) * idfs.get(term, 1.0)
                    score += term_score

            # Length normalization (cosine-like length damping)
            score = score / math.sqrt(doc_len)

            # Bonus for exact phrase match
            if phrase_matches and doc_id in phrase_matches:
                p_count = len(phrase_matches[doc_id])
                score += 2.5 * p_count

            scores[doc_id] = score

        # Sort documents by score descending
        sorted_docs = sorted(scores.items(), key=lambda item: item[1], reverse=True)

        # Normalize top score to 1.0 max for clean UI display
        max_score = sorted_docs[0][1] if sorted_docs and sorted_docs[0][1] > 0 else 1.0

        ranked_results = []
        for doc_id, raw_score in sorted_docs:
            normalized_score = round(raw_score / max_score, 4) if max_score > 0 else 0.0
            ranked_results.append(
                {
                    "doc_id": doc_id,
                    "raw_score": raw_score,
                    "score": normalized_score,
                    "matched_terms": list(matched_terms_per_doc.get(doc_id, set())),
                }
            )

        return ranked_results

    def generate_snippet(
        self,
        full_text: str,
        highlight_terms: List[str],
        max_length: int = 240,
    ) -> str:
        """
        Extracts a relevant snippet surrounding matched query terms and adds <mark> highlighting.
        """
        if not full_text:
            return ""

        clean_text = " ".join(full_text.split())
        lower_text = clean_text.lower()

        # Find first occurrence of any highlight term
        earliest_idx = -1
        best_term = ""
        for term in highlight_terms:
            t_clean = term.lower()
            idx = lower_text.find(t_clean)
            if idx != -1:
                if earliest_idx == -1 or idx < earliest_idx:
                    earliest_idx = idx
                    best_term = t_clean

        if earliest_idx == -1:
            snippet_raw = clean_text[:max_length]
            if len(clean_text) > max_length:
                snippet_raw += "..."
        else:
            # Center the window around match
            half = max_length // 2
            start = max(0, earliest_idx - half)
            end = min(len(clean_text), earliest_idx + half + len(best_term))

            # Adjust to word boundaries
            if start > 0:
                space_before = clean_text.find(" ", start)
                if space_before != -1 and space_before < earliest_idx:
                    start = space_before + 1

            if end < len(clean_text):
                space_after = clean_text.rfind(" ", earliest_idx, end)
                if space_after != -1 and space_after > earliest_idx:
                    end = space_after

            prefix = "... " if start > 0 else ""
            suffix = " ..." if end < len(clean_text) else ""
            snippet_raw = prefix + clean_text[start:end] + suffix

        # Escape HTML before adding mark tags
        escaped_snippet = html.escape(snippet_raw)

        # Highlight terms using regex
        for term in set(highlight_terms):
            if not term or len(term.strip()) == 0:
                continue
            t_escaped = re.escape(html.escape(term))
            pattern = re.compile(rf"\b({t_escaped})\b", re.IGNORECASE)
            escaped_snippet = pattern.sub(
                r'<mark class="bg-blue-100 dark:bg-blue-900/60 text-blue-900 dark:text-blue-200 font-semibold px-1 rounded">\1</mark>',
                escaped_snippet,
            )

        return escaped_snippet

    def search(self, raw_query: str) -> Dict[str, Any]:
        """
        Main query entry point. Routes query to correct parser, retrieves candidates,
        ranks them, and builds structured response cards.
        """
        self.index.increment_searches()
        q_clean = raw_query.strip()
        if not q_clean:
            return {
                "query": raw_query,
                "query_type": "empty",
                "total_results": 0,
                "results": [],
            }

        q_type = self.detect_query_type(q_clean)
        phrase_matches: Optional[Dict[str, List[int]]] = None
        candidate_docs: Set[str] = set()
        matched_query_terms: List[str] = []

        if q_type == "phrase":
            phrase_matches = self.execute_phrase_query(q_clean)
            candidate_docs = set(phrase_matches.keys())
            matched_query_terms = self.normalizer.normalize_tokens(
                self.tokenizer.tokenize(q_clean)
            )

        elif q_type == "boolean":
            candidate_docs = self.execute_boolean_query(q_clean)
            # Extract non-operator terms for snippet highlighting
            tokens = q_clean.split()
            matched_query_terms = [
                self.normalizer.normalize_term(t)
                for t in tokens
                if t.upper() not in ("AND", "OR", "NOT")
            ]

        elif q_type == "wildcard":
            # Can have single or multiple wildcard terms
            terms = q_clean.split()
            all_wildcard_terms = []
            for t in terms:
                res = self.wildcard_processor.execute_wildcard(t)
                candidate_docs.update(res["matching_doc_ids"])
                all_wildcard_terms.extend(res["matching_terms"])
            matched_query_terms = all_wildcard_terms

        else:  # Free text search
            tokens = self.tokenizer.tokenize(q_clean)
            norm_tokens = self.normalizer.normalize_tokens(tokens)
            matched_query_terms = norm_tokens

            for term in norm_tokens:
                postings = self.index.get_postings(term)
                candidate_docs.update(postings.keys())

        # Rank candidate documents
        ranked_docs = self.rank_documents(
            candidate_docs, matched_query_terms, phrase_matches=phrase_matches
        )

        results = []
        for item in ranked_docs:
            doc_id = item["doc_id"]
            doc_meta = self.index.documents.get(doc_id, {})
            full_text = doc_meta.get("text", "")

            # Highlight either specific matched terms or all query terms
            highlight_list = item.get("matched_terms") or matched_query_terms
            snippet = self.generate_snippet(full_text, highlight_list)

            results.append(
                {
                    "document_id": doc_id,
                    "filename": doc_meta.get("filename", doc_id),
                    "file_type": doc_meta.get("file_type", "TXT"),
                    "file_size": doc_meta.get("file_size", 0),
                    "snippet": snippet,
                    "score": item["score"],
                    "matched_terms": item["matched_terms"],
                    "total_tokens": self.index.doc_lengths.get(doc_id, 0),
                }
            )

        return {
            "query": raw_query,
            "query_type": q_type,
            "total_results": len(results),
            "results": results,
            "matched_terms": matched_query_terms,
        }
