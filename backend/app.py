"""
Harsh Search Engine - Flask REST API Backend
Web Search and Mining (WSM) Academic Assignment
Project Guide: Prof. Rakesh Balbantaray
"""

import os
import sys
import time
from typing import Dict, Any
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename

# Add current directory to path so modules can be imported
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from modules.document_loader import DocumentLoader
from modules.tokenizer import Tokenizer
from modules.normalizer import Normalizer
from modules.inverted_index import PositionalInvertedIndex
from modules.query_processor import QueryProcessor
from modules.wildcard_processor import WildcardProcessor
from modules.query_expansion import QueryExpander

app = Flask(__name__)
# Enable CORS for all routes (Vite frontend on default ports 5173 / 3000)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DOCS_DIR = os.path.join(BASE_DIR, "data", "documents")
UPLOADS_DIR = os.path.join(BASE_DIR, "uploads")
os.makedirs(DATA_DOCS_DIR, exist_ok=True)
os.makedirs(UPLOADS_DIR, exist_ok=True)

# Configure upload limits (max 16 MB)
app.config["MAX_CONTENT_LENGTH"] = 16 * 1024 * 1024

# Initialize core IR engine components
tokenizer = Tokenizer()
normalizer = Normalizer(remove_stopwords=False)
index = PositionalInvertedIndex()
query_processor = QueryProcessor(index, tokenizer, normalizer)
wildcard_processor = WildcardProcessor(index)
query_expander = QueryExpander()


def index_single_document(file_path: str, doc_id: str = None) -> Dict[str, Any]:
    """
    Parses a document, extracts text, tokenizes, normalizes, and adds to inverted index.
    """
    doc_info = DocumentLoader.load_document(file_path, doc_id=doc_id)
    text = doc_info["text"]

    # 1. Tokenize preserving positions
    positional_raw_tokens = tokenizer.tokenize_with_positions(text)

    # 2. Normalize tokens while retaining position
    normalized_positional_tokens = normalizer.normalize_positional_tokens(
        positional_raw_tokens
    )

    # 3. Add to positional inverted index
    index.add_document(
        doc_id=doc_info["doc_id"],
        positional_tokens=normalized_positional_tokens,
        metadata={
            "doc_id": doc_info["doc_id"],
            "filename": doc_info["filename"],
            "file_type": doc_info["file_type"],
            "file_size": doc_info["file_size"],
            "text": doc_info["text"],
            "preview": doc_info["preview"],
            "char_count": doc_info["char_count"],
            "word_count": doc_info["word_count"],
            "indexed_at": time.strftime("%Y-%m-%d %H:%M:%S"),
        },
    )

    return doc_info


def initialize_default_collection():
    """
    Loads and indexes all initial sample documents from backend/data/documents/.
    """
    if not os.path.exists(DATA_DOCS_DIR):
        return

    files = sorted(os.listdir(DATA_DOCS_DIR))
    for f in files:
        ext = os.path.splitext(f)[1].lower()
        if ext in DocumentLoader.SUPPORTED_EXTENSIONS:
            file_path = os.path.join(DATA_DOCS_DIR, f)
            # Create a clean doc_id like D1, D2 or filename base
            doc_id = os.path.splitext(f)[0]
            try:
                index_single_document(file_path, doc_id=doc_id)
            except Exception as e:
                print(f"[WARN] Failed to index {f}: {e}")

    print(
        f"[INIT] Harsh Search Engine initialized with {index.get_total_documents()} documents, "
        f"{index.get_vocabulary_size()} unique terms, and {index.get_total_tokens()} total tokens."
    )


# Perform initial indexing on startup
initialize_default_collection()


# =====================================================================
# REST API Endpoints
# =====================================================================


@app.route("/api/health", methods=["GET"])
def health_check():
    """
    Health check endpoint to verify backend status.
    """
    return jsonify(
        {
            "status": "healthy",
            "project": "Harsh Search Engine - Web Search and Mining",
            "guide": "Prof. Rakesh Balbantaray",
            "timestamp": time.time(),
        }
    ), 200


@app.route("/api/stats", methods=["GET"])
def get_stats():
    """
    Returns live statistics for the statistics dashboard cards.
    """
    return jsonify(
        {
            "total_documents": index.get_total_documents(),
            "total_vocabulary": index.get_vocabulary_size(),
            "total_tokens": index.get_total_tokens(),
            "total_searches": index.total_searches,
        }
    ), 200


@app.route("/api/documents", methods=["GET"])
def get_documents():
    """
    Returns list of all indexed documents with metadata.
    """
    docs = []
    for doc_id, meta in index.documents.items():
        docs.append(
            {
                "doc_id": doc_id,
                "filename": meta.get("filename", doc_id),
                "file_type": meta.get("file_type", "TXT"),
                "file_size": meta.get("file_size", 0),
                "preview": meta.get("preview", ""),
                "char_count": meta.get("char_count", 0),
                "word_count": meta.get("word_count", 0),
                "indexed_at": meta.get("indexed_at", ""),
            }
        )
    return jsonify({"total": len(docs), "documents": docs}), 200


@app.route("/api/documents/<document_id>", methods=["GET"])
def get_document(document_id):
    """
    Returns a document's extracted full text and metadata for reading.
    """
    if document_id not in index.documents:
        return jsonify({"error": f"Document '{document_id}' not found"}), 404

    meta = index.documents[document_id]
    return jsonify(
        {
            "doc_id": document_id,
            "filename": meta.get("filename", document_id),
            "file_type": meta.get("file_type", "TXT"),
            "file_size": meta.get("file_size", 0),
            "char_count": meta.get("char_count", 0),
            "word_count": meta.get("word_count", 0),
            "indexed_at": meta.get("indexed_at", ""),
            "text": meta.get("text", ""),
        }
    ), 200


@app.route("/api/upload", methods=["POST"])
def upload_document():
    """
    Accepts file upload (PDF, DOCX, TXT), extracts text, indexes it immediately,
    and returns updated statistics.
    """
    if "file" not in request.files:
        return jsonify({"error": "No file part in the request"}), 400

    uploaded_file = request.files["file"]
    if uploaded_file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    filename = secure_filename(uploaded_file.filename)
    ext = os.path.splitext(filename)[1].lower()

    if ext not in DocumentLoader.SUPPORTED_EXTENSIONS:
        return (
            jsonify(
                {
                    "error": f"Unsupported file format '{ext}'. Allowed: {', '.join(DocumentLoader.SUPPORTED_EXTENSIONS)}"
                }
            ),
            400,
        )

    saved_path = os.path.join(UPLOADS_DIR, filename)
    # If file exists, create a unique variant
    base, file_ext = os.path.splitext(filename)
    counter = 1
    while os.path.exists(saved_path):
        filename = f"{base}_{counter}{file_ext}"
        saved_path = os.path.join(UPLOADS_DIR, filename)
        counter += 1

    uploaded_file.save(saved_path)

    # Generate document ID
    doc_id = f"DOC_{int(time.time())}_{os.path.splitext(filename)[0]}"

    try:
        doc_info = index_single_document(saved_path, doc_id=doc_id)
    except Exception as e:
        if os.path.exists(saved_path):
            os.remove(saved_path)
        return jsonify({"error": f"Document processing failed: {str(e)}"}), 500

    return (
        jsonify(
            {
                "message": f"Document '{filename}' uploaded and indexed successfully.",
                "doc_id": doc_id,
                "filename": filename,
                "file_type": doc_info["file_type"],
                "file_size": doc_info["file_size"],
                "total_tokens": doc_info["word_count"],
                "stats": index.get_statistics(),
            }
        ),
        201,
    )


@app.route("/api/search", methods=["POST"])
def search():
    """
    Searches documents using query processor.
    Calculates execution time in milliseconds.
    """
    start_time = time.perf_counter()
    data = request.get_json(silent=True) or {}
    query_str = data.get("query", "").strip()

    if not query_str:
        return jsonify(
            {
                "query": "",
                "total_results": 0,
                "execution_time_ms": 0,
                "results": [],
            }
        ), 200

    search_result = query_processor.search(query_str)
    end_time = time.perf_counter()
    execution_time_ms = round((end_time - start_time) * 1000, 2)

    return jsonify(
        {
            "query": query_str,
            "query_type": search_result["query_type"],
            "total_results": search_result["total_results"],
            "execution_time_ms": execution_time_ms,
            "matched_terms": search_result.get("matched_terms", []),
            "results": search_result["results"],
        }
    ), 200


@app.route("/api/expand", methods=["POST"])
def expand_query():
    """
    Returns semantically or lexically expanded terms for a query.
    """
    data = request.get_json(silent=True) or {}
    query_str = data.get("query", "").strip()

    if not query_str:
        return jsonify({"original_query": "", "expanded_terms": []}), 200

    expansion = query_expander.expand_query(query_str)
    return jsonify(expansion), 200


@app.route("/api/index", methods=["GET"])
def get_inverted_index():
    """
    Returns paginated and searchable inverted index entries for the InvertedIndexExplorer.
    Query params:
      - query: term search filter
      - page: page number (default 1)
      - page_size: items per page (default 25)
    """
    q_filter = request.args.get("query", "").strip()
    try:
        page = max(1, int(request.args.get("page", 1)))
    except ValueError:
        page = 1
    try:
        page_size = min(100, max(5, int(request.args.get("page_size", 25))))
    except ValueError:
        page_size = 25

    result = index.get_index_page(query=q_filter, page=page, page_size=page_size)
    return jsonify(result), 200


@app.route("/api/index/<term>", methods=["GET"])
def get_term_postings(term):
    """
    Returns postings details for a specific individual term.
    """
    norm_term = normalizer.normalize_term(term)
    postings = index.get_postings(norm_term)

    if not postings:
        return jsonify(
            {
                "term": term,
                "normalized_term": norm_term,
                "found": False,
                "document_frequency": 0,
                "postings": {},
            }
        ), 404

    return jsonify(
        {
            "term": term,
            "normalized_term": norm_term,
            "found": True,
            "document_frequency": len(postings),
            "postings": postings,
        }
    ), 200


if __name__ == "__main__":
    # Run Flask on port 5000
    app.run(host="127.0.0.1", port=5000, debug=False)
