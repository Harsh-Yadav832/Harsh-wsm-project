"""
Module 1: document_loader.py
Extracts clean text and metadata from TXT, PDF, and DOCX files.
"""

import os
from typing import Dict, Any, Optional

try:
    import pymupdf as fitz
except ImportError:
    try:
        import fitz
    except ImportError:
        fitz = None

try:
    import docx
except ImportError:
    docx = None


class DocumentLoader:
    SUPPORTED_EXTENSIONS = {".txt", ".pdf", ".docx"}

    @classmethod
    def get_file_type(cls, file_path: str) -> str:
        ext = os.path.splitext(file_path)[1].lower()
        if ext == ".txt":
            return "TXT"
        elif ext == ".pdf":
            return "PDF"
        elif ext == ".docx":
            return "DOCX"
        return "UNKNOWN"

    @classmethod
    def extract_txt(cls, file_path: str) -> str:
        encodings = ["utf-8", "latin-1", "cp1252", "iso-8859-1"]
        for enc in encodings:
            try:
                with open(file_path, "r", encoding=enc) as f:
                    return f.read()
            except UnicodeDecodeError:
                continue
            except Exception as e:
                raise RuntimeError(f"Error reading TXT file: {str(e)}")
        raise RuntimeError("Failed to decode TXT file with supported encodings.")

    @classmethod
    def extract_pdf(cls, file_path: str) -> str:
        if fitz is None:
            # Fallback if PyMuPDF is not installed yet: try pypdf or error
            raise ImportError(
                "PyMuPDF (fitz) is not installed. Please install 'pymupdf'."
            )
        try:
            text_parts = []
            with fitz.open(file_path) as doc:
                for page_num in range(len(doc)):
                    page = doc[page_num]
                    page_text = page.get_text()
                    if page_text:
                        text_parts.append(page_text)
            return "\n\n".join(text_parts).strip()
        except Exception as e:
            raise RuntimeError(f"Error extracting PDF: {str(e)}")

    @classmethod
    def extract_docx(cls, file_path: str) -> str:
        if docx is None:
            raise ImportError(
                "python-docx is not installed. Please install 'python-docx'."
            )
        try:
            doc = docx.Document(file_path)
            paragraphs = [p.text for p in doc.paragraphs if p.text.strip()]
            return "\n\n".join(paragraphs).strip()
        except Exception as e:
            raise RuntimeError(f"Error extracting DOCX: {str(e)}")

    @classmethod
    def load_document(
        cls, file_path: str, doc_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Loads and parses a single file. Returns a structured dictionary with
        text content and metadata.
        """
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File not found: {file_path}")

        filename = os.path.basename(file_path)
        ext = os.path.splitext(file_path)[1].lower()

        if ext not in cls.SUPPORTED_EXTENSIONS:
            raise ValueError(
                f"Unsupported format '{ext}'. Supported: {', '.join(cls.SUPPORTED_EXTENSIONS)}"
            )

        file_size = os.path.getsize(file_path)
        file_type = cls.get_file_type(file_path)

        if ext == ".txt":
            raw_text = cls.extract_txt(file_path)
        elif ext == ".pdf":
            raw_text = cls.extract_pdf(file_path)
        elif ext == ".docx":
            raw_text = cls.extract_docx(file_path)
        else:
            raw_text = ""

        clean_text = raw_text.replace("\r\n", "\n").replace("\r", "\n")

        return {
            "doc_id": doc_id or filename,
            "filename": filename,
            "file_path": file_path,
            "file_type": file_type,
            "file_size": file_size,
            "text": clean_text,
            "preview": clean_text[:280] + ("..." if len(clean_text) > 280 else ""),
            "char_count": len(clean_text),
            "word_count": len(clean_text.split()),
        }
