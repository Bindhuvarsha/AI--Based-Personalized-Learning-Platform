import pytest
from app.rag.document_parser import DocumentParser
from app.rag.text_chunker import TextChunker

def test_text_parsing_and_chunking():
    sample_text = (
        "Introduction to Deep Learning.\n\n"
        "Neural networks consist of stacked layers of neurons parameterized by weights and biases. "
        "During forward propagation, signals pass through nonlinear activation functions like ReLU. "
        "During backpropagation, error gradients are computed using the chain rule and stochastic gradient descent."
    )
    
    pages = DocumentParser.parse_file(sample_text.encode("utf-8"), "neural_networks.txt")
    assert len(pages) == 1
    assert pages[0]["page"] == 1
    
    chunker = TextChunker(chunk_size=120, chunk_overlap=20)
    chunks = chunker.chunk_document(pages, "neural_networks.txt")
    
    assert len(chunks) >= 2
    assert chunks[0]["documentTitle"] == "neural_networks.txt"
    assert "Neural networks" in chunks[0]["content"] or "Introduction" in chunks[0]["content"]
