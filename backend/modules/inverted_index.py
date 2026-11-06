"""
Module 4: inverted_index.py
Implements a Positional Inverted Index data structure for Information Retrieval.
Structure:
{
    "term": {
        "D1": [0, 4, 8],
        "D2": [3, 12]
    }
}
"""

import threading
from typing import Dict, List, Any, Optional


class PositionalInvertedIndex:
    def __init__(self):
        # term -> {doc_id: [positions]}
        self.index: Dict[str, Dict[str, List[int]]] = {}
        # doc_id -> metadata dictionary
        self.documents: Dict[str, Dict[str, Any]] = {}
        # doc_id -> total token count in that doc
        self.doc_lengths: Dict[str, int] = {}
        # Search counter for stats dashboard
        self.total_searches: int = 0
        # Thread lock for concurrent uploads/searches
        self.lock = threading.RLock()

    def add_document(self, doc_id: str, positional_tokens: List[tuple], metadata: Optional[Dict[str, Any]] = None):
        """
        Indexes a single document.
        positional_tokens: list of (normalized_term, position_int)
        """
        with self.lock:
            # If doc was previously indexed, remove its old postings first
            if doc_id in self.documents:
                self.remove_document(doc_id)

            self.doc_lengths[doc_id] = len(positional_tokens)
            if metadata:
                self.documents[doc_id] = metadata
            else:
                self.documents[doc_id] = {"doc_id": doc_id, "filename": doc_id}

            for term, pos in positional_tokens:
                if not term:
                    continue
                if term not in self.index:
                    self.index[term] = {}
                if doc_id not in self.index[term]:
                    self.index[term][doc_id] = []
                self.index[term][doc_id].append(pos)

    def remove_document(self, doc_id: str):
        """
        Removes all postings associated with a document.
        """
        with self.lock:
            if doc_id in self.documents:
                del self.documents[doc_id]
            if doc_id in self.doc_lengths:
                del self.doc_lengths[doc_id]

            empty_terms = []
            for term, postings in self.index.items():
                if doc_id in postings:
                    del postings[doc_id]
                    if not postings:
                        empty_terms.append(term)

            for term in empty_terms:
                del self.index[term]

    def get_postings(self, term: str) -> Dict[str, List[int]]:
        """
        Returns postings list for a term: {doc_id: [positions]}
        """
        with self.lock:
            return self.index.get(term, {})

    def get_term_frequency(self, term: str, doc_id: str) -> int:
        """
        Returns the frequency of a term in a specific document.
        """
        with self.lock:
            postings = self.index.get(term, {})
            positions = postings.get(doc_id, [])
            return len(positions)

    def get_document_frequency(self, term: str) -> int:
        """
        Returns how many documents contain the term.
        """
        with self.lock:
            return len(self.index.get(term, {}))

    def get_vocabulary(self) -> List[str]:
        """
        Returns sorted list of all unique terms in the index.
        """
        with self.lock:
            return sorted(self.index.keys())

    def get_total_documents(self) -> int:
        with self.lock:
            return len(self.documents)

    def get_vocabulary_size(self) -> int:
        with self.lock:
            return len(self.index)

    def get_total_tokens(self) -> int:
        with self.lock:
            return sum(self.doc_lengths.values())

    def increment_searches(self):
        with self.lock:
            self.total_searches += 1

    def get_statistics(self) -> Dict[str, Any]:
        with self.lock:
            return {
                "total_documents": self.get_total_documents(),
                "total_vocabulary": self.get_vocabulary_size(),
                "total_tokens": self.get_total_tokens(),
                "total_searches": self.total_searches,
            }

    def get_index_page(
        self, query: str = "", page: int = 1, page_size: int = 25, sort_by: str = "term"
    ) -> Dict[str, Any]:
        """
        Returns paginated and filtered inverted index entries for the InvertedIndexExplorer UI.
        """
        with self.lock:
            terms = sorted(self.index.keys())
            if query:
                q_clean = query.strip().lower()
                terms = [t for t in terms if q_clean in t]

            total_matching_terms = len(terms)
            start = (page - 1) * page_size
            end = start + page_size
            paginated_terms = terms[start:end]

            rows = []
            for term in paginated_terms:
                postings = self.index[term]
                # Flatten or present doc postings
                for doc_id, positions in postings.items():
                    rows.append(
                        {
                            "term": term,
                            "doc_id": doc_id,
                            "doc_name": self.documents.get(doc_id, {}).get("filename", doc_id),
                            "positions": positions,
                            "doc_freq": len(postings),
                            "term_freq": len(positions),
                        }
                    )

            total_pages = (total_matching_terms + page_size - 1) // page_size if page_size > 0 else 1

            return {
                "terms": rows,
                "total_terms": total_matching_terms,
                "page": page,
                "page_size": page_size,
                "total_pages": max(1, total_pages),
                "vocabulary_size": len(self.index),
            }
