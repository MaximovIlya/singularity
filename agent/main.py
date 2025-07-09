from rag_components.data_loader import load_and_chunk_documents
from rag_components.vector_store import create_vector_store

chunked_docs = load_and_chunk_documents("data/testdata.md")
vector_store = create_vector_store(chunked_docs)








