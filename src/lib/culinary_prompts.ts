/**
 * Shared Culinary Prompt Builders for GrandChef Lab
 * Used by Gastronomic Engine and AI Service to ensure 
 * consistent, high-quality, and technical output.
 */

export const SYSTEM_IDENTITY = `
Eres el RedactorMaestro de GrandChef Lab: una inteligencia editorial gastronómica autónoma de nivel internacional.

Tu función es generar contenido culinario (Ingredientes, Técnicas, Recetas, Cursos) de la más alta precisión técnica, 
originalidad absoluta y profundidad gastronómica. No repites frases, no usas relleno y tratas cada entrada 
como una pieza de una enciclopedia de elite (tipo Modernist Cuisine o manuales de la CIA).

Reglas Editoriales:
1. Densidad técnica: Explica la ciencia detrás de cada proceso o ingrediente.
2. Narrativa pro: No listas de supermercado. Los textos deben ser densos y profesionales.
3. Sin redundancia: Avanza del concepto molecular al protocolo de cocina.
4. Voz: Profesor de la CIA escribiendo un manual interno para chefs.
`.trim();

export function buildIngredientPrompt(instruction: string, knowledge?: string): string {
  const knowledgeSection = knowledge ? `\n--- CONOCIMIENTO DE SOPORTE ---\n${knowledge}\n` : '';
  return `
ORDEN: Generar un Ingrediente técnico basado en: "${instruction}"
${knowledgeSection}
REQUISITOS DEL OBJETO JSON:
1. id: String minúsculas, sin espacios.
2. name: Nombre profesional.
3. category: Categoría culinaria.
4. family: Familia biológica o técnica.
5. description: Mínimo 300 palabras de descripción técnica, científica e histórica.
6. pairing_notes: Array de strings con sinergias.
7. stories: Objeto JSON con historias/sinergias técnicas (mínimo 3).

DEVUELVE SOLO EL JSON:
{
  "id": "...", "name": "...", "category": "...", "family": "...",
  "description": "...", "pairing_notes": [...], "stories": { "...": "..." }
}
`.trim();
}

export function buildTechniquePrompt(instruction: string): string {
  return `
ORDEN: Generar una Técnica culinaria basada en: "${instruction}"

REQUISITOS DEL OBJETO JSON:
1. id: String minúsculas.
2. name: Nombre formal.
3. category: Basado en (Térmica, Texturización, Fermentación, etc).
4. description: Mínimo 450 palabras explicando el proceso, la ciencia y fallas comunes.
5. difficulty: Uno de ('Basico', 'Intermedio', 'Avanzado', 'Maestro').
6. equipment: Array de herramientas.
7. reagents: Array de químicos/reactivos si aplica.
8. pairing_notes: Aplicaciones recomendadas.

DEVUELVE SOLO EL JSON:
{
  "id": "...", "name": "...", "category": "...", "description": "...",
  "difficulty": "...", "equipment": [...], "reagents": [...], "pairing_notes": [...]
}
`.trim();
}

export function buildRecipePrompt(instruction: string, knowledge?: string): string {
  const knowledgeSection = knowledge ? `\n--- CONOCIMIENTO DE SOPORTE ---\n${knowledge}\n` : '';
  return `
ORDEN: Generar una Receta de alta cocina basada en: "${instruction}"
${knowledgeSection}
REQUISITOS DEL OBJETO JSON:
1. id: String minúsculas.
2. title: Título profesional.
3. source: "Grand Chef".
4. tier: Uno de ('FREE', 'PRO', 'PREMIUM').
5. difficulty: Uno de ('Basico', 'Intermedio', 'Avanzado', 'Maestro').
6. servings: Número entero.
7. times: { prepMin: number, cookMin: number, restMin?: number }.
8. description: Narrativa de armonía (mínimo 150 palabras).
9. utensils: Array de utensilios.
10. ingredients: Array de { name: string, amount: number, unit: string, notes?: string }.
11. steps: Array de strings (mínimo 12 pasos detallados).
12. techniques: Array de IDs de técnicas relacionadas.
13. tags: Array de etiquetas.

DEVUELVE SOLO EL JSON:
{
  "id": "...", "title": "...", "source": "Grand Chef", "tier": "...",
  "difficulty": "...", "servings": 2, "times": { "prepMin": 10, "cookMin": 10 },
  "description": "...", "utensils": [...], "ingredients": [...], "steps": [...],
  "techniques": [...], "tags": [...]
}
`.trim();
}

export function buildCoursePrompt(tier: 'FREE' | 'PRO' | 'PREMIUM', topic: string, knowledge?: string): string {
  const knowledgeSection = knowledge ? `\n--- CONOCIMIENTO DE SOPORTE ---\n${knowledge}\n` : '';
  const tierSpecs: Record<string, string> = {
    FREE: "NIVEL: FREE — 1800 palabras mínimas. Fundamentos con rigor.",
    PRO: "NIVEL: PRO — 9000 palabras mínimas. Dominio técnico aplicado y ciencia.",
    PREMIUM: "NIVEL: PREMIUM — 16000 palabras mínimas. Maestría editorial exhaustiva."
  };

  return `
TEMA DEL CURSO: "${topic}"
${tierSpecs[tier]}
${knowledgeSection}
ESTRUCTURA OBLIGATORIA (4 SECCIONES EN PROSA):
## 1. Introducción conceptual profunda
## 2. Desarrollo técnico progresivo
## 3. Aplicación práctica profesional
## 4. Cierre estratégico creativo

DEVUELVE SOLO ESTE JSON:
{
  "title": "...", "description": "...",
  "full_content": "## 1...\\n\\n## 2...\\n\\n## 3...\\n\\n## 4..."
}
`.trim();
}
