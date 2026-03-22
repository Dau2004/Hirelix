def extract_text_from_file(file_field) -> str:
    """Extract plain text from a PDF or DOCX file field."""
    name = file_field.name.lower()
    try:
        if name.endswith('.pdf'):
            import pdfplumber
            with pdfplumber.open(file_field) as pdf:
                return '\n'.join(page.extract_text() or '' for page in pdf.pages)
        elif name.endswith('.docx'):
            from docx import Document
            doc = Document(file_field)
            return '\n'.join(p.text for p in doc.paragraphs)
    except Exception:
        pass
    return ''
