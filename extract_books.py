import pypdf
import json
import os

def extract_text(pdf_path, start_page=0, end_page=None):
    try:
        reader = pypdf.PdfReader(pdf_path)
        if end_page is None:
            end_page = len(reader.pages)
        
        text = ""
        for i in range(start_page, min(end_page, len(reader.pages))):
            text += f"\n--- Page {i+1} ---\n"
            text += reader.pages[i].extract_text()
        return text
    except Exception as e:
        return f"Error reading {pdf_path}: {str(e)}"

# Path to the books
encyclopedia_path = r"C:\Users\Casa\Downloads\“La Enciclopedia de los Sabores” - Niki Segnit.pdf"
foodpairing_path = r"C:\Users\Casa\Downloads\El Arte y La ciencia del foodpairing.pdf"

print("Extracting Encyclopedia Index...")
encyclopedia_index = extract_text(encyclopedia_path, 0, 15)

print("Extracting Foodpairing Index...")
foodpairing_index = extract_text(foodpairing_path, 0, 20)

# Save the raw text for the AI to process
with open("extracted_data.txt", "w", encoding="utf-8") as f:
    f.write("=== ENCYCLOPEDIA INDEX ===\n")
    f.write(encyclopedia_index)
    f.write("\n\n=== FOODPAIRING INDEX ===\n")
    f.write(foodpairing_index)

print("Extraction complete. Results saved to extracted_data.txt")
