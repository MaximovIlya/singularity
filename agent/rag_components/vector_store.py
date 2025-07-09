# Файл: rag_components/vector_store.py
from langchain_openai import OpenAIEmbeddings
from langchain_chroma import Chroma
from typing import List
from langchain_core.documents import Document
import os

def create_vector_store(chunked_docs: List, collection_name: str = "p2p_platform_docs"):
    """
    Создает векторное хранилище из чанков документов.
    """
    # Инициализация модели эмбеддингов от OpenAI
    # Убедитесь, что OPENAI_API_KEY установлен в переменных окружения
    embeddings = OpenAIEmbeddings(model="text-embedding-3-small")

    # Создание ChromaDB из документов.
    # ChromaDB автоматически обработает эмбеддинги и сохранит их.
    # Если коллекция с таким именем уже существует, она будет использована.
    vector_store = Chroma.from_documents(
        documents=chunked_docs,
        embedding=embeddings,
        collection_name=collection_name
    )

    print(f"Векторное хранилище '{collection_name}' создано и содержит {vector_store.collection.count()} документов.")
    return vector_store