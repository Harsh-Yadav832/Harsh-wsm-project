# Harsh Search Engine Backend

Flask REST API and Information Retrieval Engine for Web Search and Mining (WSM).

- **Project Title:** Harsh Search Engine
- **Course:** Web Search and Mining (WSM)
- **Project Guide:** Prof. Rakesh Balbantaray
- **Student / Author:** Harsh

---

## Architecture & Modules

1. **`document_loader.py`**:
   - `DocumentLoader.load_document(path, doc_id)`: Extracts plain text and metadata from TXT, PDF (PyMuPDF), and DOCX (python-docx).
   - Generates document summaries, token counts, and file size metrics.

2. **`tokenizer.py`**:
   - `Tokenizer.tokenize(text)`: Regular-expression word tokenizer (`\b[\w]+(?:'[\w]+)?\b`).
   - `Tokenizer.tokenize_with_positions(text)`: Produces list of `(token, position_int)` preserving exact zero-based sequence offsets.

3. **`normalizer.py`**:
   - `Normalizer.normalize_term(term)`: Lowercasing, Unicode NFKD normalization, punctuation trimming.
   - `Normalizer.normalize_positional_tokens(tokens)`: Applies identical pipeline to documents and queries.

4. **`inverted_index.py`**:
   - `PositionalInvertedIndex`: Positional index mapping terms to `{doc_id: [positions]}`.
   - Computes term frequency (TF), document frequency (DF), total vocabulary, and token counts.
   - Provides paginated, filtered views for the academic Inverted Index Explorer.

5. **`query_processor.py`**:
   - Query parser supporting exact phrase queries (`"..."`), Boolean queries (`AND`, `OR`, `NOT`), wildcard queries, and multi-term queries.
   - **Phrase Query Algorithm**: Verifies that positions of term $i+1$ equal position of term $i$ plus 1 in the candidate document's positional index.
   - **TF-IDF Relevance Scoring**: Calculates $(1 + \log_{10}(\text{TF})) \times \log_{10}((N+1)/(\text{DF}+1))$ with cosine length damping and phrase boost.
   - **Snippet Extraction**: Identifies the dense match window and wraps keywords with HTML `<mark>` tags.

6. **`wildcard_processor.py`**:
   - Safely escapes user input and converts `*` and `?` to regular expressions.
   - Evaluates pattern matching across indexed vocabulary terms and merges candidate postings.

7. **`query_expansion.py`**:
   - Connects to NLTK WordNet and fallback IR domain lexicons to discover synonyms and semantically related terms.

8. **`app.py`**:
   - Exposes Flask REST endpoints, enables CORS, automatically indexes initial documents on startup, and handles document uploads dynamically.

---

## Running the Backend

```bash
# In wsm-search-engine/backend
python -m pip install -r requirements.txt
python app.py
```
Backend runs at: `http://127.0.0.1:5000`
