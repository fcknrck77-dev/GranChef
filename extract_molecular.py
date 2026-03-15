import pypdf

def extract_foodpairing_molecular(pdf_path):
    reader = pypdf.PdfReader(pdf_path)
    # Usually molecular data starts after the introduction, let's check pages 50-100
    text = ""
    for i in range(50, 80):
        if i < len(reader.pages):
            text += f"\n--- Page {i+1} ---\n"
            text += reader.pages[i].extract_text()
    return text

foodpairing_path = r"C:\Users\Casa\Downloads\El Arte y La ciencia del foodpairing.pdf"
print("Extracting Molecular Data...")
molecular_text = extract_foodpairing_molecular(foodpairing_path)

with open("molecular_data.txt", "w", encoding="utf-8") as f:
    f.write(molecular_text)

print("Molecular extraction complete.")
