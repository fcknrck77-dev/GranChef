import pypdf
import json
import re

def extract_ingredient_data(pdf_path, pages):
    reader = pypdf.PdfReader(pdf_path)
    text = ""
    for p in pages:
        if p < len(reader.pages):
            text += reader.pages[p].extract_text()
    return text

encyclopedia_path = r"C:\Users\Casa\Downloads\“La Enciclopedia de los Sabores” - Niki Segnit.pdf"

# We want to extract a sample of the actual pairings. 
# Pages 17-500 contains the bulk. Let's take a sample of 2 pages from each main section.
sections = [17, 37, 77, 107, 141, 155, 199, 231, 257, 305, 325, 353, 395, 419, 453, 481]
pages_to_extract = []
for s in sections:
    pages_to_extract.extend([s, s+1, s+2])

print(f"Extracting {len(pages_to_extract)} key pages from Encyclopedia...")
data_text = extract_ingredient_data(encyclopedia_path, pages_to_extract)

with open("culinary_data_rich.txt", "w", encoding="utf-8") as f:
    f.write(data_text)

print("Rich data extraction complete.")
