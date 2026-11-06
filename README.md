# Harsh Search Engine — Web Search and Mining (WSM)

An end-to-end, production-grade Information Retrieval (IR) and Web Search Engine built for the **Web Search and Mining (WSM)** academic curriculum.

- **Project Title:** Harsh Search Engine
- **Academic Course:** Web Search and Mining (WSM)
- **Project Guide:** Prof. Rakesh Balbantaray
- **Student / Author:** Harsh

---

## 1. Overview & Key Capabilities

Harsh Search Engine implements all core theoretical and practical Information Retrieval principles with a decoupled, modular architecture:

1. **Positional Inverted Index**:
   Maps every vocabulary term to document identifiers and their exact 0-based token positions:
   ```json
   {
     "premchand": {
       "D1": [0, 45, 128],
       "D2": [3, 12]
     }
   }
   ```
2. **Exact Phrase Search**:
   Executes exact phrase queries (e.g. `"eleven stories"`, `"salt inspector"`) using positional postings verification to ensure consecutive occurrences without re-scanning raw document files.
3. **Boolean Retrieval Engine**:
   Evaluates `AND`, `OR`, and `NOT` set logic operations on document postings (e.g. `data AND mining`, `data NOT mining`).
4. **Wildcard Query Processing**:
   Converts wildcard patterns (`prem*`, `*ing`, `m*n`, `*tion*`) into safe regular expressions and dynamically queries the index vocabulary to merge postings lists.
5. **TF-IDF Relevance Scoring & Ranking**:
   Scores matching documents using logarithmic Term Frequency ($1 + \log_{10}(\text{TF})$) multiplied by Inverse Document Frequency ($\log_{10}((N+1)/(\text{DF}+1))$), with document length cosine normalization and phrase match bonuses.
6. **Query Expansion**:
   Suggests semantically related terms and synonyms using NLTK WordNet and an IR-domain curated lexicon to boost search recall.
7. **Document Ingestion & Multi-Format Parsing**:
   Extracts and parses TXT, PDF (via PyMuPDF), and DOCX (via python-docx) documents, indexing them immediately in real-time.
8. **Inverted Index Explorer**:
   Interactive inspection table displaying term-to-document positional mappings, document frequencies, and token positions with filtering and pagination.
9. **Premium SaaS UI/UX**:
   Light-mode first aesthetic (`#FFFFFF`, `#F8FAFC`, `#3559D8` royal blue accent, navy text), complete dark-mode toggle (`#0F172A`), real-time statistics dashboard, and document reader modal.

---

## 2. Project Structure

```
wsm-search-engine/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx              # Navigation, branding & status indicator
│   │   │   ├── ProjectIntroCard.jsx    # Academic header & guide card
│   │   │   ├── SearchBar.jsx           # Prominent search bar & query suggestions
│   │   │   ├── SearchResults.jsx       # Results header, timing & list
│   │   │   ├── ResultCard.jsx          # Result card with snippet & highlighted terms
│   │   │   ├── UploadDocument.jsx      # Drag-and-drop document upload & indexing
│   │   │   ├── QueryExpansion.jsx      # WordNet / synonym query expansion tool
│   │   │   ├── DocumentCollection.jsx  # Grid of indexed documents & preview
│   │   │   ├── DocumentReaderModal.jsx # Full-text reader modal with scrolling
│   │   │   ├── InvertedIndexExplorer.jsx # Academic positional index table
│   │   │   ├── StatisticsCards.jsx     # Live dynamic dashboard counters
│   │   │   ├── ThemeToggle.jsx         # Sun/Moon light & dark mode switch
│   │   │   └── Footer.jsx              # Academic footer
│   │   │
│   │   ├── pages/
│   │   │   └── Home.jsx                # Main unified search interface
│   │   ├── services/
│   │   │   └── api.js                  # Axios client for Flask REST endpoints
│   │   ├── hooks/
│   │   │   └── useTheme.js             # Theme state & localStorage synchronization
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css                   # Tailwind CSS styling & custom scrollbars
│   │
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── backend/
│   ├── modules/
│   │   ├── __init__.py
│   │   ├── document_loader.py          # Multi-format text extraction (TXT, PDF, DOCX)
│   │   ├── tokenizer.py                # Regex tokenization with position retention
│   │   ├── normalizer.py               # Standardized normalization pipeline
│   │   ├── inverted_index.py           # Positional Inverted Index data structure
│   │   ├── query_processor.py          # TF-IDF, Phrase, Boolean & Free-text search
│   │   ├── wildcard_processor.py       # Pattern-to-regex matching on vocabulary
│   │   └── query_expansion.py          # WordNet and synonym expansion
│   │
│   ├── data/
│   │   └── documents/                  # Default pre-indexed sample literature
│   │       ├── D1_premchand_kafan.txt
│   │       ├── D2_premchand_eleven_stories.txt
│   │       ├── D3_grandmas_bag_of_stories.txt
│   │       ├── D4_information_retrieval_and_mining.txt
│   │       └── D5_salt_inspector_premchand.txt
│   │
│   ├── uploads/                        # User-uploaded documents
│   ├── app.py                          # Flask REST API server
│   ├── requirements.txt                # Python backend dependencies
│   └── README.md
│
└── README.md
```

---

## 3. Quick Start Guide

### Prerequisites
- Python 3.10+
- Node.js 18+ & npm

---

### Step 1: Start the Python Flask Backend

1. Open a terminal in the `backend/` directory:
   ```bash
   cd wsm-search-engine/backend
   ```
2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the Flask server:
   ```bash
   python app.py
   ```
   *The backend starts at `http://127.0.0.1:5000` and automatically indexes the 5 sample documents.*

---

### Step 2: Start the React Frontend

1. Open a second terminal in the `frontend/` directory:
   ```bash
   cd wsm-search-engine/frontend
   ```
2. Install Node dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser at:
   ```
   http://localhost:5173
   ```

---

## 4. REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Backend status and project metadata |
| `GET` | `/api/stats` | Dynamic statistics (docs, vocabulary, tokens, searches) |
| `GET` | `/api/documents` | List of all indexed documents with metadata |
| `GET` | `/api/documents/<doc_id>` | Full extracted text for document reader |
| `POST` | `/api/upload` | Upload & immediately index a PDF, DOCX, or TXT file |
| `POST` | `/api/search` | Search query endpoint (Phrase, Boolean, Wildcard, Free-text) |
| `POST` | `/api/expand` | Query expansion with synonyms and related terms |
| `GET` | `/api/index` | Paginated and filterable positional inverted index table |
| `GET` | `/api/index/<term>` | Postings details and positions for a specific term |

---

## 5. Demonstration & Evaluation Test Cases

| Search Category | Query Example | Expected Behavior |
|---|---|---|
| **Normal Term** | `premchand` | Matches documents referencing Munshi Premchand, sorted by TF-IDF |
| **Multi-term** | `information retrieval` | Matches documents containing either/both terms with combined relevance ranking |
| **Exact Phrase** | `"eleven stories"` | Uses positional index to ensure consecutive occurrence of "eleven" and "stories" |
| **Wildcard Prefix** | `prem*` | Matches vocabulary terms like `premchand`, `premature` |
| **Wildcard Suffix** | `*ing` | Matches vocabulary terms like `mining`, `searching`, `learning` |
| **Wildcard Middle** | `m*n` | Matches vocabulary terms like `mining`, `man`, `men` |
| **Boolean AND** | `data AND mining` | Returns intersection of documents containing both terms |
| **Boolean NOT** | `data NOT mining` | Returns documents with "data" excluding those with "mining" |
| **Boolean OR** | `data OR information` | Returns union of documents containing either term |
| **Document Ingestion** | Upload any `.txt` or `.pdf` | File is parsed, tokenized, normalized, and indexed without restart |
| **Query Expansion** | `story` | Expands to `["tale", "narrative", "fiction", "novel"]` |
| **Index Explorer** | Filter `premchand` | Displays Term, Document ID, and Token Position Array `[0, 45, 128]` |
