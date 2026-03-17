// scripts/reset_and_generate.js
// 1. Borra todos los cursos y ciclos existentes en Supabase
// 2. Lanza el primer ciclo de generación con Gemini (2 FREE + 4 PRO + 8 PREMIUM) con rotación de keys + Groq fallback
// Uso: node scripts/reset_and_generate.js

'use strict';
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const fs = require('fs');

// ─── Cargar .env.local ──────────────────────────────────────────────────────
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) return;
  const eq = trimmed.indexOf('=');
  if (eq < 0) return;
  const key = trimmed.slice(0, eq).trim();
  const val = trimmed.slice(eq + 1).trim();
  if (key && !process.env[key]) process.env[key] = val;
});

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// API Keys rotation list
const GEMINI_KEYS = [
  process.env.GEMINI_API_KEY_1,
  process.env.GEMINI_API_KEY_2,
  process.env.GEMINI_API_KEY_3,
  process.env.GEMINI_API_KEY_4,
  process.env.GEMINI_API_KEY
].filter(Boolean);

let currentKeyIndex = 0;

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Faltan SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local');
  process.exit(1);
}
if (GEMINI_KEYS.length === 0) {
  console.error('❌ Falta GEMINI_API_KEY en .env.local');
  process.exit(1);
}

const supa = createClient(SUPABASE_URL, SUPABASE_KEY);

// ─────────────────────────────────────────────────────────────────────────────
//  SYSTEM IDENTITY
// ─────────────────────────────────────────────────────────────────────────────
const SYSTEM_IDENTITY = `
Eres el RedactorMaestro de GrandChef Lab: una inteligencia editorial gastronómica autónoma de nivel internacional.

Tu función exclusiva es generar manuales culinarios originales, extensos y densos en conocimiento técnico, sin repetir párrafos ni copiar frases de publicaciones existentes. Usas la ciencia, la técnica y la narrativa como un chef usa el fuego: con control absoluto.

Reglas de identidad editorial:
- Cada párrafo debe existir por una razón técnica o narrativa única.
- Nunca repitas una idea ya desarrollada en el mismo texto, aunque cambie la forma.
- Tu voz es la de un profesor de la CIA (Culinary Institute of America) escribiendo un manual interno.
- Avanzas del concepto molecular al protocolo de cocina, nunca al revés.
- Cada sección debe ser independientemente valiosa pero conectada al hilo del curso.
- Prohibido: relleno, frases genéricas, listas de compras, recetas sin contexto técnico, estructura blog.
`.trim();

// ─────────────────────────────────────────────────────────────────────────────
//  BUILD PROMPT
// ─────────────────────────────────────────────────────────────────────────────
function buildPrompt(tier, topic) {
  const tierSpecs = {
    FREE: 'NIVEL: FREE\nEXTENSIÓN MÍNIMA: 1800 palabras reales.\nTONO: Accesible con densidad técnica alta.',
    PRO: 'NIVEL: PRO\nEXTENSIÓN MÍNIMA: 9000 palabras reales.\nTONO: Profesional y metodológico. Incluir ciencia aplicada en cada sección.',
    PREMIUM: 'NIVEL: PREMIUM\nEXTENSIÓN MÍNIMA: 16000 palabras reales.\nTONO: Magistral y exhaustivo. Cobertura completa desde lo molecular hasta lo estratégico-creativo.',
  };

  return `
TEMA DEL CURSO: "${topic}"

${tierSpecs[tier]}

ESTRUCTURA OBLIGATORIA — 4 secciones en prosa continua (sin listas ni viñetas):

## 1. Introducción conceptual profunda
Desde la raíz científica o histórica del tema. Define el "por qué".

## 2. Desarrollo técnico progresivo
Proceso técnico con narrativa fluida. Incluye parámetros, variables críticas, errores frecuentes.

## 3. Aplicación práctica profesional
En cocina viva: presión de tiempo, variantes, adaptaciones por temporada, decisiones estratégicas.

## 4. Cierre estratégico creativo
Visión de alto nivel: diferenciación gastronómica, exploración creativa, qué define al maestro del tema.

REGLAS ABSOLUTAS:
- No menciones IA, AI, modelos, prompts, herramientas ni "como asistente".
- No incluyas tiempo de lectura ni metadatos ajenos a la cocina.

DEVUELVE SOLO ESTE JSON (sin texto fuera del bloque JSON):
{
  "title": "Título editorial refinado",
  "description": "Dos frases max, precisas y atractivas",
  "full_content": "## 1. Introducción conceptual profunda\\n\\n[prosa]\\n\\n## 2. Desarrollo técnico progresivo\\n\\n[prosa]\\n\\n## 3. Aplicación práctica profesional\\n\\n[prosa]\\n\\n## 4. Cierre estratégico creativo\\n\\n[prosa]"
}
`.trim();
}

// ─────────────────────────────────────────────────────────────────────────────
//  TOPICS
// ─────────────────────────────────────────────────────────────────────────────
const ALL_TOPICS = [
  "Reacción de Maillard: control de temperatura, pH y humedad en proteínas cárnicas",
  "Caramelización vs. Maillard: diferencias moleculares y estrategia de sabor",
  "La pirólisis controlada en charring de vegetales y maderas de ahumado",
  "Transferencia de calor: conducción, convección y radiación en cocina profesional",
  "La cocción sous-vide y su impacto en la textura de la fibra muscular",
  "Cocción a baja temperatura de aves: rompimiento del colágeno y pasteurización",
  "Hidrocoloides en salsas madres: gelificación, sinéresis y estabilidad",
  "Agar, carragenanos y gellan: propiedades comparadas en cocina fría y caliente",
  "Xantana y lecitina como emulsionantes de precisión en vinagretas de alta cocina",
  "El almidón como espesante: gelatinización, retrogradación y fallos de brigada",
  "Envejecimiento en seco de vacuno: bioquímica de la proteólisis y control de pérdidas",
  "Colágeno y gelatina: extracción, hidrólisis y uso estratégico en fondos y salsas",
  "Fermentaciones lácteas en cocina salada: kéfir de agua, sueros y ácidos orgánicos",
  "Koji y su rol enzimático: producción de umami, proteólisis y fermentaciones controladas",
];

function pickTopics(tiers) {
  const shuffled = [...ALL_TOPICS].sort(() => Math.random() - 0.5);
  return tiers.map((_, i) => shuffled[i % shuffled.length]);
}

async function performGroqFallback(promptText) {
  if (!GROQ_API_KEY) throw new Error('No Groq API key available for fallback');
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        { role: 'system', content: SYSTEM_IDENTITY },
        { role: 'user', content: promptText }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    })
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Groq error ${res.status}: ${txt}`);
  }
  const json = await res.json();
  return json.choices?.[0]?.message?.content;
}

// ─────────────────────────────────────────────────────────────────────────────
//  MAIN
// ─────────────────────────────────────────────────────────────────────────────
async function main() {
  const { GoogleGenAI } = await import('@google/genai');

  let ai = new GoogleGenAI({ apiKey: GEMINI_KEYS[currentKeyIndex] });

  // STEP 1: Clear
  console.log('\n🗑️  Borrando cursos existentes...');
  const { error: e1 } = await supa.from('courses').delete().gt('id', '00000000-0000-0000-0000-000000000000');
  if (e1) console.warn('⚠️  courses:', e1.message); else console.log('✓ Cursos eliminados');

  console.log('🗑️  Borrando ciclos anteriores...');
  const { error: e2 } = await supa.from('engine_cycles').delete().gt('id', '00000000-0000-0000-0000-000000000000');
  if (e2) console.warn('⚠️  cycles:', e2.message); else console.log('✓ Ciclos eliminados');

  // STEP 2: Create cycle
  const cycleId = `cycle-${new Date().toISOString().split('T')[0]}-gemini-v1`;
  const { data: cycle, error: cycleErr } = await supa
    .from('engine_cycles')
    .insert({ cycle_id: cycleId, status: 'processing' })
    .select()
    .single();

  if (cycleErr) { console.error('❌ Error ciclo:', cycleErr.message); process.exit(1); }
  console.log(`\n🚀 Ciclo iniciado: ${cycleId}\n`);

  // STEP 3: Generate
  const tiers = [
    'FREE', 'FREE',
    'PRO', 'PRO', 'PRO', 'PRO',
    'PREMIUM', 'PREMIUM', 'PREMIUM', 'PREMIUM', 'PREMIUM', 'PREMIUM', 'PREMIUM', 'PREMIUM'
  ];
  const topics = pickTopics(tiers);
  let saved = 0, failed = 0;

  // Keep track of day_number per tier
  const tierDayNumbers = { FREE: 1, PRO: 1, PREMIUM: 1 };

  for (let i = 0; i < tiers.length; i++) {
    const tier = tiers[i];
    const topic = topics[i];
    const dayNumber = tierDayNumbers[tier]++;
    
    console.log(`[${i + 1}/${tiers.length}] ${tier} (Day ${dayNumber}): "${topic}"...`);

    const promptText = buildPrompt(tier, topic);
    let resultText = null;
    let useGroq = false;

    // Retry loop for Gemini keys
    let attempt = 0;
    while (!resultText && !useGroq && attempt < GEMINI_KEYS.length) {
      try {
        const response = await ai.models.generateContent({
          model: GEMINI_MODEL,
          contents: promptText,
          config: {
            systemInstruction: SYSTEM_IDENTITY,
            responseMimeType: 'application/json',
            temperature: 0.8
          }
        });
        resultText = response.text;
      } catch (err) {
        if (err.status === 429 || err.message.includes('429')) {
           console.warn(`  ⚠️  Rate limit con API key index ${currentKeyIndex}, rotando a la siguiente...`);
           currentKeyIndex = (currentKeyIndex + 1) % GEMINI_KEYS.length;
           ai = new GoogleGenAI({ apiKey: GEMINI_KEYS[currentKeyIndex] });
           // Esperar un poco antes de volver a intentar
           await new Promise(r => setTimeout(r, 2000));
        } else {
           console.error(`  ❌ Gemini error no-429: ${err.message}`);
           useGroq = true; // Si es un error distinto a limit, fallamos hacia Groq de una vez
        }
      }
      attempt++;
    }

    if (!resultText && GROQ_API_KEY) {
        console.warn(`  🔀 Usando Groq como fallback...`);
        try {
            resultText = await performGroqFallback(promptText);
        } catch (groqErr) {
            console.error(`  ❌ Groq error: ${groqErr.message}`);
        }
    }


    if (!resultText) {
        console.error('  ❌ Todos los métodos fallaron. Saltando.');
        failed++;
        continue;
    }

    try {
      const result = JSON.parse(resultText);
      if (!result.title || !result.full_content) {
        throw new Error("Estructura JSON invalida: faltan title o full_content");
      }

      const words = result.full_content.split(/\s+/).length;
      const { error: insErr } = await supa.from('courses').insert({
        title: result.title,
        description: result.description,
        instructor: 'Grand Chef',
        tier,
        days_required: dayNumber,
        full_content: result.full_content,
        generation_cycle_id: cycleId,
        modules: [{ id: 'full', title: 'Curso Completo', content: result.full_content }]
      });

      if (insErr) { console.error('  ❌ DB insert error:', insErr.message); failed++; continue; }
      console.log(`  ✓ "${result.title}" (${words} palabras)`);
      saved++;

    } catch (err) {
      console.error(`  ❌ Error procesando resultado: ${err.message}`);
      failed++;
    }

    // Delay entre todos los calls
    if (i < tiers.length - 1) {
      process.stdout.write(`  ⏱️  Esperando 4s...`);
      await new Promise(r => setTimeout(r, 4000));
      process.stdout.write(' listo\n');
    }
  }

  // STEP 4: Close cycle
  await supa.from('engine_cycles')
    .update({ status: failed === tiers.length ? 'failed' : 'completed', completed_at: new Date().toISOString() })
    .eq('id', cycle.id);

  console.log('\n═══════════════════════════════════════════');
  console.log(`✅ CICLO COMPLETADO`);
  console.log(`   Cursos guardados : ${saved}/${tiers.length}`);
  console.log(`   Fallidos         : ${failed}`);
  console.log(`   Ciclo ID         : ${cycleId}`);
  console.log('═══════════════════════════════════════════\n');
}

main().catch(err => {
  console.error('\n❌ Error fatal:', err.message);
  process.exit(1);
});
