import re
import json

# Read the extracted rich data
try:
    with open("culinary_data_rich.txt", "r", encoding="utf-8") as f:
        text = f.read()
except FileNotFoundError:
    print("Error: culinary_data_rich.txt not found. Run extract_rich.py first.")
    exit(1)

# Pattern for ingredient pairings in the text
# Capturing Group 1: Main Ingredient
# Capturing Group 2: Partner Ingredient
# Capturing Group 3: Description (stopping at next pairing or end of line/section)
# We use a more sophisticated regex to get the text after the colon
pairings_raw = re.findall(r'([A-Z][a-zñáéíóú]+)\s+y\s+([a-zñáéíóú]+)\s*:\s*(.*?)(?=[A-Z][a-zñáéíóú]+\s+y\s+[a-zñáéíóú]+\s*:|@D|$)', text, re.DOTALL)

ingredients_map = {}

# Example of families from the index (manual mapping based on common sense/book knowledge)
families = {
    "Café": "Tostados",
    "Cacahuete": "Tostados",
    "Chocolate": "Tostados",
    "Vainilla": "Tostados",
    "Carne": "Carnes",
    "Ternera": "Carnes",
    "Cerdo": "Carnes",
    "Pollo": "Carnes",
    "Cordero": "Carnes",
    "Queso de cabra": "Quesos",
    "Queso azul": "Quesos",
    "Parmesano": "Quesos",
    "Seta": "Terrosos",
    "Remolacha": "Terrosos",
    "Patata": "Terrosos",
    "Ajo": "Sulfurosos",
    "Cebolla": "Sulfurosos",
    "Trufa": "Sulfurosos",
    "Limón": "Cítricos",
    "Naranja": "Cítricos",
    "Lima": "Cítricos",
    "Cardamomo": "Cítricos",
    "Pepino": "Verdes",
    "Tomate": "Verdes",
    "Aguacate": "Verdes",
    "Albahaca": "Verdes",
    "Chile": "Especiados",
    "Canela": "Especiados",
    "Jengibre": "Especiados",
    "Fresa": "Afrutados",
    "Frambuesa": "Afrutados",
    "Manzana": "Afrutados",
    "Plátano": "Afrutados",
    "Coco": "Afrutados",
    "Mango": "Afrutados"
}

for p1, p2, desc in pairings_raw:
    p1 = p1.strip()
    p2 = p2.strip().capitalize()
    desc = desc.strip().replace('\n', ' ')
    # Clean up desc if it's too long
    if len(desc) > 300:
        desc = desc[:297] + "..."

    if p1 not in ingredients_map:
        ingredients_map[p1] = {"pairings": {}}
    
    ingredients_map[p1]["pairings"][p2] = desc

# Build the final list
final_ingredients = []
idx = 1
for name, data in ingredients_map.items():
    family = families.get(name, "Otros")
    
    # Structure for the frontend
    final_ingredients.append({
        "id": str(idx),
        "name": name,
        "category": family,
        "family": family,
        "description": f"Ingrediente versátil de la familia {family}.",
        "pairingNotes": sorted(list(data["pairings"].keys())),
        "stories": data["pairings"] # Map: PartnerName -> Story
    })
    idx += 1

# Generate TS content
ts_content = """export interface Ingredient {
  id: string;
  name: string;
  category: string;
  description: string;
  pairingNotes: string[];
  family: string;
  stories?: Record<string, string>;
}

"""
ts_content += "export const ingredients: Ingredient[] = " + json.dumps(final_ingredients, indent=2, ensure_ascii=False) + ";"

# Write to the actual data directory
output_path = "src/data/ingredients.ts"
with open(output_path, "w", encoding="utf-8") as f:
    f.write(ts_content)

print(f"Generated {len(final_ingredients)} ingredients with stories in {output_path}.")
