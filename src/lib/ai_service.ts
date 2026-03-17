import { GoogleGenAI } from '@google/genai';
import { getSupabaseAdmin } from './supabaseAdmin';

// ─────────────────────────────────────────────────────────────────────────────
//  SYSTEM IDENTITY - THE REDACTOR MAESTRO (Shared for all content)
// ─────────────────────────────────────────────────────────────────────────────
const SYSTEM_IDENTITY = `
Eres el RedactorMaestro de GrandChef Lab: una inteligencia editorial gastronómica autónoma de nivel internacional.

Tu función es generar contenido culinario (Ingredientes, Técnicas, Recetas) de la más alta precisión técnica, 
originalidad absoluta y profundidad gastronómica. No repites frases, no usas relleno y tratas cada entrada 
como una pieza de una enciclopedia de elite (tipo Modernist Cuisine o manuales de la CIA).

Reglas Editoriales:
1. Densidad técnica: Explica la ciencia detrás de cada ingrediente o técnica.
2. Narrativa pro: No listas de supermercado. Los ingredientes se describen por su comportamiento molecular y organoléptico.
3. Sin redundancia: Si una idea ya se explicó, no vuelvas a ella.
4. Idioma: Español profesional/gastronómico de España o estándar internacional neutro de alto nivel.
`.trim();

// ─────────────────────────────────────────────────────────────────────────────
//  PROMPTS GENERATION
// ─────────────────────────────────────────────────────────────────────────────

function buildIngredientPrompt(instruction: string): string {
  return `
ORDEN: Generar un Ingrediente técnico basado en: "${instruction}"

REQUISITOS DEL OBJETO JSON:
1. id: String minúsculas, sin espacios (ej: 'ajo_negro').
2. name: Nombre profesional.
3. category: Categoría culinaria (Vegetal, Proteína, Hidrocoloide, etc).
4. family: Familia biológica o técnica.
5. description: Mínimo 250 palabras de descripción técnica, científica e histórica profunda.
6. pairing_notes: Array de strings con otros ingredientes compatibles.
7. stories: Objeto JSON donde las llaves son nombres de ingredientes y los valores son breves "historias" o sinergias culinarias (mínimo 3).

DEVUELVE SOLO EL JSON:
{
  "id": "...",
  "name": "...",
  "category": "...",
  "family": "...",
  "description": "...",
  "pairing_notes": ["...", "..."],
  "stories": { "Ingrediente X": "Sinergia técnica..." }
}
`.trim();
}

function buildTechniquePrompt(instruction: string): string {
  return `
ORDEN: Generar una Técnica culinaria basada en: "${instruction}"

REQUISITOS DEL OBJETO JSON:
1. id: String minúsculas (ej: 'esferificacion_inversa').
2. name: Nombre formal.
3. category: Basado en (Térmica, Texturización, Fermentación, etc).
4. description: Mínimo 400 palabras explicando el proceso, la ciencia, los puntos de control y las fallas comunes.
5. difficulty: Uno de ('Basico', 'Intermedio', 'Avanzado', 'Maestro').
6. equipment: Array de herramientas necesarias.
7. reagents: Array de químicos o reactivos si aplica (ej: Alginato).
8. pairing_notes: Aplicaciones recomendadas (ej: "Salsas ácidas", "Frutas").

DEVUELVE SOLO EL JSON:
{
  "id": "...",
  "name": "...",
  "category": "...",
  "description": "...",
  "difficulty": "...",
  "equipment": ["...", "..."],
  "reagents": ["...", "..."],
  "pairing_notes": ["...", "..."]
}
`.trim();
}

function buildRecipePrompt(instruction: string): string {
  return `
ORDEN: Generar una Receta de alta cocina basada en: "${instruction}"

REQUISITOS DEL OBJETO JSON:
1. id: String minúsculas (ej: 'bacalao_confitado_citricos').
2. title: Título sugerente y profesional.
3. source: Siempre "Grand Chef".
4. tier: Uno de ('FREE', 'PRO', 'PREMIUM').
5. difficulty: Uno de ('Basico', 'Intermedio', 'Avanzado', 'Maestro').
6. servings: Número entero realista.
7. times: Objeto { prepMin: number, cookMin: number, restMin?: number } (minutos).
8. description: Narrativa de armonía del plato (mínimo 150 palabras).
9. utensils: Array de utensilios (mínimo 5 si aplica).
10. ingredients: Array de objetos { name: string, amount: number, unit: 'g'|'ml'|'ud'|'cda'|'cdta', notes?: string }.
11. steps: Array de strings (mínimo 12 pasos, muy detallados, con controles, señales visuales, temperaturas cuando aplique, y puntos críticos).
12. techniques: Array de IDs de técnicas relacionadas (strings).
13. tags: Array de etiquetas útiles (strings).

REGLAS ABSOLUTAS:
- No menciones IA/AI, modelos, prompts, herramientas ni "como asistente".
- No uses texto fuera del JSON.

DEVUELVE SOLO EL JSON:
{
  "id": "...",
  "title": "...",
  "source": "Grand Chef",
  "tier": "...",
  "difficulty": "...",
  "servings": 2,
  "times": { "prepMin": 10, "cookMin": 10, "restMin": 0 },
  "description": "...",
  "utensils": ["..."],
  "ingredients": [{ "name": "...", "amount": 100, "unit": "g", "notes": "" }],
  "steps": ["...", "..."],
  "techniques": ["...", "..."],
  "tags": ["..."]
}
`.trim();
}

// ─────────────────────────────────────────────────────────────────────────────
//  AI SERVICE LOGIC (GEMINI)
// ─────────────────────────────────────────────────────────────────────────────

export async function fulfillAiRequest(requestId: string) {
  const supa = getSupabaseAdmin();
  if (!supa) throw new Error('Supabase Admin not configured');

  const { data: request, error: fetchErr } = await supa
    .from('ai_requests')
    .select('*')
    .eq('id', requestId)
    .single();

  if (fetchErr || !request) throw new Error('Request not found');

  await supa.from('ai_requests').update({ status: 'processing' }).eq('id', requestId);

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-pro';

    let userPrompt = '';
    let targetTable = '';

    if (request.kind === 'ingredients') {
      userPrompt = buildIngredientPrompt(request.instruction);
      targetTable = 'ingredients';
    } else if (request.kind === 'techniques') {
      userPrompt = buildTechniquePrompt(request.instruction);
      targetTable = 'techniques';
    } else if (request.kind === 'recipes') {
      userPrompt = buildRecipePrompt(request.instruction);
      targetTable = 'recipes';
    } else {
      // For now, only these three are fully handled here. Courses are in gastronomic_engine.
      throw new Error(`Unsupported kind: ${request.kind}`);
    }

    const response = await ai.models.generateContent({
      model: modelName,
      contents: userPrompt,
      config: {
        systemInstruction: SYSTEM_IDENTITY,
        responseMimeType: 'application/json',
        temperature: 0.7
      }
    });

    const resultText = response.text;
    const resultJson = JSON.parse(resultText || '{}');

    // Insert into final table (normalize to DB schema)
    let rowToInsert: any = resultJson;
    if (request.kind === 'recipes') {
      rowToInsert = {
        id: String(resultJson.id || '').trim(),
        title: String(resultJson.title || '').trim(),
        source: String(resultJson.source || 'Grand Chef').trim() || 'Grand Chef',
        tier: String(resultJson.tier || '').trim(),
        difficulty: String(resultJson.difficulty || 'Basico').trim() || 'Basico',
        servings: Number.isFinite(Number(resultJson.servings)) ? Number(resultJson.servings) : 2,
        times: resultJson.times && typeof resultJson.times === 'object' ? resultJson.times : { prepMin: 10, cookMin: 10 },
        description: String(resultJson.description || '').trim(),
        utensils: Array.isArray(resultJson.utensils) ? resultJson.utensils : [],
        ingredients: Array.isArray(resultJson.ingredients) ? resultJson.ingredients : [],
        steps: Array.isArray(resultJson.steps) ? resultJson.steps : [],
        techniques: Array.isArray(resultJson.techniques) ? resultJson.techniques : [],
        tags: Array.isArray(resultJson.tags) ? resultJson.tags : [],
      };
      if (!rowToInsert.id || !rowToInsert.title || !rowToInsert.tier) {
        throw new Error('Invalid recipe output: missing id/title/tier');
      }
    }

    const { error: insertErr } = await supa.from(targetTable).upsert(rowToInsert, { onConflict: 'id' });
    if (insertErr) throw insertErr;

    // Update request
    await supa.from('ai_requests').update({ 
      status: 'completed',
      payload: resultJson 
    }).eq('id', requestId);

    console.log(`[AI SERVICE] ✓ Fulfilled ${request.kind} request: ${resultJson.name}`);
    return { ok: true, data: resultJson };

  } catch (err: any) {
    console.error(`[AI SERVICE] Error fulfilling request ${requestId}:`, err);
    await supa.from('ai_requests').update({ status: 'failed' }).eq('id', requestId);
    throw err;
  }
}
