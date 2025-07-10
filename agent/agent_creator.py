import os
from langchain_core.tools import Tool
from langchain_openai import ChatOpenAI
from agent.tools.qa_tool import create_qa_rag_chain
from agent.rag_components.data_loader import load_and_chunk_documents
from agent.rag_components.vector_store import create_vector_store


def create_p2p_agent():
    """
    Создает и настраивает агента для P2P платформы.
    """
    # --- Инициализация инструментов ---

    # Инструмент для ответов на вопросы (RAG)
    print("Инициализация RAG-инструмента...")
    current_dir = os.path.dirname(os.path.abspath(__file__))
    data_path = os.path.join(current_dir, "data", "docs.md")
    chunked_docs = load_and_chunk_documents(data_path)
    vector_store = create_vector_store(chunked_docs, "p2p_agent_db")
    agent_executor = create_qa_rag_chain(vector_store)
    
    print("Агент успешно создан.")
    return agent_executor
