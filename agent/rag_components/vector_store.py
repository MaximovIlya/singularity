import os
from typing import List
from langchain_core.documents import Document
from langchain_chroma import Chroma
from openai import OpenAI
from langchain_core.embeddings import Embeddings

class SingleEmbedding(Embeddings):
    def __init__(self, client, model):
        self.client = client
        self.model = model

    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        # Process one string at a time due to API limitation
        return [self.client.embeddings.create(model=self.model, input=text).data[0].embedding for text in texts]

    def embed_query(self, text: str) -> List[float]:
        return self.client.embeddings.create(model=self.model, input=text).data[0].embedding

def create_vector_store(chunked_docs: List[Document], collection_name: str = "p2p_platform_docs", persist_directory: str = "./chroma_db"):
    """
    Creates a vector store from document chunks using a custom embedding class compatible with non-batch APIs.
    """
    # Initialize OpenAI-compatible client
    client = OpenAI(
        base_url=os.getenv("AIMLAPI_BASE_URL", "https://api.aimlapi.com/v1"),
        api_key=os.getenv("AIMLAPI_KEY")
    )
    # Use custom embedding class
    embeddings = SingleEmbedding(client, model="text-embedding-3-small")
    # Create Chroma vector store
    vector_store = Chroma.from_documents(
        documents=chunked_docs,
        embedding=embeddings,
        collection_name=collection_name,
        persist_directory=persist_directory
    )
    print(f"Vector store '{collection_name}' created and contains {vector_store._collection.count()} documents.")
    return vector_store
