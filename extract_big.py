import pypdf

def extract_big_chunk(pdf_path, start, end):
    reader = pypdf.PdfReader(pdf_path)
    text = ""
    for i in range(start, end):
        if i < len(reader.pages):
            text += reader.pages[i].extract_text()
    return text

encyclopedia_path = r"C:\Users\Casa\Downloads\“La Enciclopedia de los Sabores” - Niki Segnit.pdf"
print("Extracting 100 pages...")
big_text = extract_big_chunk(encyclopedia_path, 100, 200)

with open("big_text.txt", "w", encoding="utf-8") as f:
    f.write(big_text)

print("Extraction complete.")
