# Data Loader Utility

## Function: `load_and_chunk_documents`

Loads a text document from a file and splits it into manageable chunks for further processing.

---

### **Usage**

```python
from rag_components.data_loader import load_and_chunk_documents

chunks = load_and_chunk_documents("path/to/your/file.md")
for chunk in chunks:
    print(chunk)
```

---

### **Parameters**

- **`le_path`** (`str`):  
  The path to the text or markdown file to be loaded.

---

### **Returns**

- **`List[Document]`**:  
  A list of document chunks, each suitable for further processing (e.g., embedding, search, or LLM input).

---

### **Description**

This function:
1. Loads the content of a text or markdown file using `TextLoader`.
2. Splits the content into chunks using `RecursiveCharacterTextSplier` with a maximum chunk size of 1000 characters and an overlap of 200 characters.
3. Returns the list of chunked documents.

---

### **Example**

```python
chunks = load_and_chunk_documents("example.md")
print(f"Number of chunks: {len(chunks)}")
for i, chunk in enumerate(chunks):
    print(f"Chunk {i+1}:")
    print(chunk.page_content)
```

---

### **Notes**

- The function supports any plain text file, including `.txt` and `.md` (Markdown) formats.
- You can adjust the chunk size and overlap by modifying the `RecursiveCharacterTextSplier` parameters.

---

### **Dependencies**

- `langchain_community.document_loaders.TextLoader`
- `langchain_text_spliers.RecursiveCharacterTextSplier`
- `langchain_core.documents.Document`