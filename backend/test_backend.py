"""
Automated unit & integration test suite for Harsh Search Engine
Validates all Information Retrieval algorithms and API endpoints with updated corpus.
"""

import sys
import os
import json

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import app, index, query_processor, wildcard_processor, query_expander

def run_tests():
    print("=" * 60)
    print("HARSH SEARCH ENGINE - INTEGRATION & ALGORITHM VERIFICATION")
    print("Course: Web Search and Mining (WSM)")
    print("Guide: Prof. Rakesh Balbantaray")
    print("=" * 60)

    client = app.test_client()

    # Test 1: Health check
    print("\n[TEST 1] Checking API Health Endpoint...")
    res = client.get('/api/health')
    assert res.status_code == 200, f"Expected 200, got {res.status_code}"
    health_data = res.get_json()
    assert health_data["status"] == "healthy"
    print(f" PASS: API is healthy. Guide verified: {health_data['guide']}")

    # Test 2: Statistics
    print("\n[TEST 2] Verifying Corpus Statistics...")
    res = client.get('/api/stats')
    stats = res.get_json()
    print(f" Documents: {stats['total_documents']}, Vocabulary: {stats['total_vocabulary']}, Tokens: {stats['total_tokens']}")
    assert stats['total_documents'] == 7, f"Expected 7 sample documents, got {stats['total_documents']}"
    assert stats['total_vocabulary'] > 100, "Expected rich vocabulary"
    print(" PASS: Statistics verified.")

    # Test 3: Normal Term Search
    print("\n[TEST 3] Testing Normal Term Search ('lincoln')...")
    res = client.post('/api/search', json={"query": "lincoln"})
    data = res.get_json()
    print(f" Query: '{data['query']}', Matched Docs: {data['total_results']}, Execution: {data['execution_time_ms']}ms")
    assert data['total_results'] > 0, "Expected matches for 'lincoln'"
    print(f" Top result: {data['results'][0]['filename']} (Score: {data['results'][0]['score']})")
    print(" PASS: Normal term search verified.")

    # Test 4: Exact Phrase Search using Positional Inverted Index
    print("\n[TEST 4] Testing Exact Phrase Search ('\"fried chicken\"')...")
    res = client.post('/api/search', json={"query": '"fried chicken"'})
    data = res.get_json()
    print(f" Query Type: {data['query_type']}, Total Results: {data['total_results']}")
    assert data['total_results'] > 0, "Expected matches for phrase '\"fried chicken\"'"
    assert "sanders" in data['results'][0]['document_id'].lower() or "kfc" in data['results'][0]['document_id'].lower()
    print(f" Snippet: {data['results'][0]['snippet'][:120]}...")
    print(" PASS: Positional phrase search verified.")

    # Test 5: Wildcard Search
    print("\n[TEST 5] Testing Wildcard Search ('napoleon*' and '*ing')...")
    res1 = client.post('/api/search', json={"query": "napoleon*"})
    data1 = res1.get_json()
    print(f" Wildcard 'napoleon*' -> Matched: {data1['matched_terms']}, Docs: {data1['total_results']}")
    assert len(data1['matched_terms']) > 0, "Expected wildcard vocabulary expansion"

    res2 = client.post('/api/search', json={"query": "*ing"})
    data2 = res2.get_json()
    print(f" Wildcard '*ing' -> Matched: {len(data2['matched_terms'])} terms, Docs: {data2['total_results']}")
    assert data2['total_results'] > 0, "Expected suffix wildcard matches"
    print(" PASS: Wildcard query processor verified.")

    # Test 6: Boolean Search (AND, NOT, OR)
    print("\n[TEST 6] Testing Boolean Retrieval Logic...")
    res_and = client.post('/api/search', json={"query": "aryabhata AND mathematics"})
    data_and = res_and.get_json()
    print(f" 'aryabhata AND mathematics' -> Docs: {data_and['total_results']}")
    assert data_and['total_results'] > 0

    res_not = client.post('/api/search', json={"query": "odyssey NOT war"})
    data_not = res_not.get_json()
    print(f" 'odyssey NOT war' -> Docs: {data_not['total_results']}")
    assert data_not['total_results'] == 1
    assert "odyssey" in data_not['results'][0]['document_id'].lower()

    res_or = client.post('/api/search', json={"query": "kfc OR lincoln"})
    data_or = res_or.get_json()
    print(f" 'kfc OR lincoln' -> Docs: {data_or['total_results']}")
    assert data_or['total_results'] >= 2
    print(" PASS: Boolean retrieval model verified.")

    # Test 7: Query Expansion
    print("\n[TEST 7] Testing Query Expansion ('chicken')...")
    res_exp = client.post('/api/expand', json={"query": "chicken"})
    data_exp = res_exp.get_json()
    print(f" Original: '{data_exp['original_query']}', Expanded: {data_exp['expanded_terms']}")
    assert len(data_exp['expanded_terms']) > 0, "Expected query expansion synonyms"
    print(" PASS: Query expansion verified.")

    # Test 8: Inverted Index Explorer Endpoint
    print("\n[TEST 8] Testing Inverted Index Explorer Pagination...")
    res_idx = client.get('/api/index?query=napoleon&page=1&page_size=5')
    data_idx = res_idx.get_json()
    print(f" Matching Terms: {data_idx['total_terms']}, Vocabulary Size: {data_idx['vocabulary_size']}")
    assert len(data_idx['terms']) > 0
    sample_entry = data_idx['terms'][0]
    print(f" Sample Posting: Term='{sample_entry['term']}', Doc='{sample_entry['doc_id']}', Positions={sample_entry['positions']}")
    print(" PASS: Inverted index explorer verified.")

    # Test 9: Document Full-Text Reader
    print("\n[TEST 9] Testing Document Reader Endpoint...")
    res_doc = client.get('/api/documents/D1_harland_david_sanders_kfc')
    data_doc = res_doc.get_json()
    assert "Sanders" in data_doc['text']
    print(f" Retrieved: '{data_doc['filename']}' ({data_doc['word_count']} words, {data_doc['file_type']})")
    print(" PASS: Document reader verified.")

    print("\n" + "=" * 60)
    print("ALL 9 TEST SUITES PASSED FLAWLESSLY WITH UPDATED CORPUS!")
    print("=" * 60)

if __name__ == '__main__':
    run_tests()
