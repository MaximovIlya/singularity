from langchain_openai import OpenAIEmbeddings
from langchain_chroma import Chroma
from typing import List
from langchain_core.documents import Document
import os
import shutil

def create_vector_store(chunked_docs: List, collection_name: str = "credit_platform_docs"):
    """
    Создает векторное хранилище из чанков документов.
    """
    persist_dir = "chroma_db"
    if os.path.exists(persist_dir):
        shutil.rmtree(persist_dir)

    # Ввод API ключа OpenAI
    openai_api_key = input("Введите ваш OpenAI API ключ: ")
    os.environ["OPENAI_API_KEY"] = openai_api_key

    embeddings = OpenAIEmbeddings(
        model="text-embedding-3-small"
    )

    vector_store = Chroma.from_documents(
        documents=chunked_docs,
        embedding=embeddings,
        collection_name=collection_name,
        persist_directory=persist_dir
    )

    print(f"Векторное хранилище '{collection_name}' создано и содержит {len(vector_store.get()['ids'])} документов.")
    return vector_store