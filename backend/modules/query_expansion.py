"""
Module: query_expansion.py
Expands user queries with synonyms and semantically related terms.
Uses NLTK WordNet with graceful fallback to an Information Retrieval / Literature knowledge base.
"""

from typing import List, Dict, Set, Any

# Built-in synonym & semantic relations fallback
FALLBACK_SYNONYMS: Dict[str, List[str]] = {
    "story": ["tale", "narrative", "fiction", "account", "chronicle"],
    "stories": ["tales", "narratives", "fables", "parables", "accounts"],
    "premchand": ["munshi", "dhanpat", "novelist", "literature", "author"],
    "kafan": ["shroud", "cloth", "burial", "premchand", "story"],
    "shroud": ["kafan", "covering", "garment", "veil", "pall"],
    "mining": ["extraction", "discovery", "analytics", "harvesting", "processing"],
    "retrieval": ["search", "recovery", "access", "indexing", "lookup"],
    "search": ["explore", "query", "seek", "lookup", "investigate"],
    "engine": ["system", "mechanism", "processor", "crawler", "indexer"],
    "document": ["text", "record", "file", "manuscript", "article"],
    "documents": ["records", "files", "texts", "articles", "papers"],
    "data": ["information", "records", "datasets", "knowledge", "facts"],
    "information": ["knowledge", "data", "facts", "insights", "intelligence"],
    "book": ["volume", "publication", "tome", "manuscript", "text"],
    "books": ["publications", "volumes", "tomes", "literature", "library"],
    "author": ["writer", "novelist", "creator", "essayist", "poet"],
    "village": ["rural", "hamlet", "countryside", "peasant", "rustic"],
    "india": ["bharat", "indian", "subcontinent", "hindi", "heritage"],
    "eleven": ["stories", "collection", "anthology", "tales"],
    "daroga": ["inspector", "official", "officer", "superintendent"],
    "inspector": ["daroga", "officer", "examiner", "supervisor"],
    "salt": ["namak", "mineral", "commodity", "monopoly"],
    "web": ["internet", "network", "online", "hypertext", "cyberspace"],
    "kfc": ["chicken", "sanders", "kentucky", "franchise", "restaurant"],
    "sanders": ["colonel", "kfc", "chicken", "kentucky", "founder"],
    "chicken": ["poultry", "kfc", "recipe", "food", "dish"],
    "lincoln": ["abraham", "president", "emancipation", "civil war", "gettysburg"],
    "president": ["leader", "commander", "executive", "lincoln", "statesman"],
    "presidency": ["administration", "term", "leadership", "office"],
    "aryabhata": ["mathematician", "astronomer", "patna", "aryabhatiya", "gupta"],
    "astronomy": ["celestial", "planetary", "eclipse", "cosmos", "stars"],
    "mathematics": ["algebra", "trigonometry", "calculation", "arithmetic", "sine"],
    "napoleon": ["bonaparte", "emperor", "france", "general", "austerlitz"],
    "bonaparte": ["napoleon", "corsica", "emperor", "commander"],
    "emperor": ["ruler", "monarch", "sovereign", "napoleon", "leader"],
    "odyssey": ["homer", "odysseus", "epic", "ithaca", "mythology"],
    "odysseus": ["ulysses", "hero", "ithaca", "penelope", "voyage"],
    "homer": ["poet", "iliad", "odyssey", "greece", "epic"],
    "war": ["battle", "conflict", "combat", "campaign", "military"],
    "battle": ["engagement", "warfare", "clash", "fight", "victory"],
}


class QueryExpander:
    def __init__(self):
        self.wordnet_ready = False
        try:
            import nltk
            from nltk.corpus import wordnet as wn

            # Try a quick test lookup
            try:
                wn.synsets("dog")
                self.wn = wn
                self.wordnet_ready = True
            except LookupError:
                # Attempt quiet download
                nltk.download("wordnet", quiet=True)
                nltk.download("omw-1.4", quiet=True)
                self.wn = wn
                self.wordnet_ready = True
        except Exception:
            self.wordnet_ready = False
            self.wn = None

    def expand_term(self, term: str, max_terms: int = 6) -> List[str]:
        """
        Expands a single term with synonyms.
        """
        t_clean = term.strip().lower()
        if not t_clean:
            return []

        expanded: Set[str] = set()

        # 1. Try NLTK WordNet if available
        if self.wordnet_ready and self.wn:
            try:
                synsets = self.wn.synsets(t_clean)
                for syn in synsets[:3]:  # Top 3 synsets
                    for lemma in syn.lemmas():
                        synonym = lemma.name().lower().replace("_", " ")
                        if synonym != t_clean and len(synonym) > 2:
                            expanded.add(synonym)
                        if len(expanded) >= max_terms:
                            break
                    if len(expanded) >= max_terms:
                        break
            except Exception:
                pass

        # 2. Check curated Fallback dictionary
        if t_clean in FALLBACK_SYNONYMS:
            for s in FALLBACK_SYNONYMS[t_clean]:
                if s != t_clean:
                    expanded.add(s)

        # 3. Handle plurals/singulars basic morphology
        if t_clean.endswith("s") and len(t_clean) > 3:
            singular = t_clean[:-1]
            if singular in FALLBACK_SYNONYMS:
                expanded.update(FALLBACK_SYNONYMS[singular])
        else:
            plural = t_clean + "s"
            if plural in FALLBACK_SYNONYMS:
                expanded.update(FALLBACK_SYNONYMS[plural])

        # Remove query itself if present
        expanded.discard(t_clean)
        return sorted(list(expanded))[:max_terms]

    def expand_query(self, query: str, max_terms: int = 8) -> Dict[str, Any]:
        """
        Expands full multi-term queries.
        """
        words = query.strip().lower().split()
        all_expanded: Set[str] = set()

        for w in words:
            # Skip short words and operators
            if len(w) <= 2 or w in ("and", "or", "not", "the", "for", "with"):
                continue
            terms = self.expand_term(w, max_terms=4)
            all_expanded.update(terms)

        # Exclude original words
        for w in words:
            all_expanded.discard(w)

        result_terms = sorted(list(all_expanded))[:max_terms]

        # If no synonyms found, provide informative fallbacks based on context
        if not result_terms and query.strip():
            result_terms = ["literature", "stories", "retrieval", "information"]

        return {
            "original_query": query,
            "expanded_terms": result_terms,
            "engine": "WordNet + IR Lexicon" if self.wordnet_ready else "IR Curated Lexicon",
        }
