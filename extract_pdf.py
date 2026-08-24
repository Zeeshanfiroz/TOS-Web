import sys
from pypdf import PdfReader
for path in sys.argv[1:]:
    print(f'\n{chr(61)*60}\nFILE: {path}\n{chr(61)*60}')
    try:
        reader = PdfReader(path)
        for i, page in enumerate(reader.pages):
            text = page.extract_text()
            if text and text.strip():
                print(f'--- Page {i+1} ---')
                print(text)
    except Exception as e:
        print(f'ERROR: {e}')
