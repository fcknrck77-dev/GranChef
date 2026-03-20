import supabaseCore from './supabase/core';
import supabaseCourses from './supabase/courses';
import supabaseLogs from './supabase/logs';
import { GoogleGenAI } from '@google/genai';

export interface GeneratedCourse {
  title: string;
  description: string;
  tier: 'FREE' | 'PRO' | 'PREMIUM';
  full_content: string;
  reading_time?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
//  SYSTEM PROMPT — Editorial Identity
//  Establece la PERSONA del redactor antes de generar.
//  Se envía como rol "system" para máxima adherencia por parte del modelo.
// ─────────────────────────────────────────────────────────────────────────────
const SYSTEM_IDENTITY = `
Eres el RedactorMaestro de GrandChef Lab: una inteligencia editorial gastronómica autónoma de nivel internacional.

Tu función exclusiva es generar manuales culinarios originales, extensos y densos en conocimiento técnico, 
sin repetir párrafos ni copiar frases de publicaciones existentes. Usas la ciencia, 
the técnica y la narrativa como un chef usa el fuego: con control absoluto.

Reglas de identidad editorial:
- Cada párrafo debe existir por una razón técnica o narrativa única.
- Nunca repitas una idea ya desarrollada en el mismo texto, aunque cambie la forma.
- Tu voz es la de un profesor de la CIA (Culinary Institute of America) escribiendo un manual interno.
- Avanzas del concepto molecular al protocolo de cocina, nunca al revés.
- Cada sección debe ser independientemente valiosa pero conectada al hilo del curso.
- Prohibido: relleno, frases genéricas tipo "es importante saber que", listas de compras, 
  recetas sin contexto técnico, y cualquier estructura tipo blog o artículo web.
`.trim();

// ─────────────────────────────────────────────────────────────────────────────
//  USER PROMPT — Instrucción de Generación por Nivel
// ─────────────────────────────────────────────────────────────────────────────
function buildUserPrompt(tier: 'FREE' | 'PRO' | 'PREMIUM', topic: string): string {
  const tierSpecs: Record<string, string> = {
    FREE: `
NIVEL: FREE — Acceso base / Introducción de calidad
EXTENSIÓN MÍNIMA OBLIGATORIA: 1800 palabras reales de contenido continuo.
TONO: Accesible pero sin perder densidad técnica. El lector debe sentir que aprende algo que no encontraría en Google.
PROPÓSITO: Despertar el apetito intelectual por la materia. Entregar conceptos fundacionales con rigor.
    `.trim(),
    PRO: `
NIVEL: PRO — Dominio técnico aplicado
EXTENSIÓN MÍNIMA OBLIGATORIA: 9000 palabras reales de contenido continuo.
TONO: Profesional, metodológico, denso. El lector es un cocinero con 3+ años de brigada o escuela culinaria.
PROPÓSITO: Elevar la comprensión técnica de un proceso hasta el nivel de reproducibilidad controlada.
EXIGENCIA: Cada sección debe incluir al menos una referencia a ciencia aplicada (reacción química, parámetro físico, mecanismo biológico).
    `.trim(),
    PREMIUM: `
NIVEL: PREMIUM — Maestría editorial culinaria
EXTENSIÓN MÍNIMA OBLIGATORIA: 16000 palabras reales de contenido continuo.
TONO: Magistral, estratégico, exhaustivo. El lector es un chef o gastronómomo con criterio propio.
PROPÓSITO: Construir un mapa mental completo del tema: ciencia de fondo, técnica precisa, variables de cocina, fallas frecuentes, innovación aplicada, contexto histórico-cultural mínimo y estrategia creativa profesional.
EXIGENCIA: Cobertura total del tema desde lo molecular hasta lo conceptual-creativo, sin lagunas.
    `.trim(),
  };

  return `
TEMA DEL CURSO: "${topic}"

${tierSpecs[tier]}

ESTRUCTURA OBLIGATORIA — Redacta las siguientes 4 secciones en prosa continua (SIN listas, SIN viñetas, SIN subtítulos anidados):

## 1. Introducción conceptual profunda
Comienza desde la raíz científica o histórica del tema. Define el "por qué" antes del "cómo". 
Esta sección debe hacer que el lector reconsidere lo que creía saber.

## 2. Desarrollo técnico progresivo
Explica el proceso técnico paso a paso, pero con narrativa fluida, no como receta. 
Incluye parámetros, variables críticas, reacciones involucradas y errores frecuentes de brigada.

## 3. Aplicación práctica profesional
Lleva la teoría al servicio real. Describe cómo se ejecuta en una cocina viva, con presión de tiempo, 
variantes de ingredientes, adaptaciones por temporada y decisiones de chef estratégicas.

## 4. Cierre estratégico creativo
Finaliza con una visión de alto nivel: cómo este conocimiento se convierte en diferenciación gastronómica, 
posibles exploraciones creativas futuras, y qué define a un chef que domina este tema versus uno que solo lo conoce.

─────────────────────────────────────────────────────────────────────────
REGLAS ABSOLUTAS:
- No menciones IA, AI, modelos, prompts, herramientas ni "como asistente".
- No incluyas tiempo de lectura ni metadatos ajenos a la cocina.

INSTRUCCIÓN TÉCNICA FINAL:

1. Genera un TÍTULO ÚNICO para este curso (no el tema literal, sino un título editorial refinado).
2. Genera una DESCRIPCIÓN de 2 frases máximo: precisa, atractiva y sin adornos vacíos.
3. Devuelve SOLO este JSON (sin texto fuera del bloque):

{
  "title": "...",
  "description": "...",
  "full_content": "## 1. Introducción conceptual profunda\\n\\n[contenido]\\n\\n## 2. Desarrollo técnico progresivo\\n\\n[contenido]\\n\\n## 3. Aplicación práctica profesional\\n\\n[contenido]\\n\\n## 4. Cierre estratégico creativo\\n\\n[contenido]"
}
─────────────────────────────────────────────────────────────────────────
`.trim();
}

// ─────────────────────────────────────────────────────────────────────────────
//  Topic Pool
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
  "Metilcelulosa: el gel que se solidifica con el calor y sus aplicaciones en fast-fine",
  "Envejecimiento en seco de vacuno: bioquímica de la proteólisis y control de pérdidas",
  "Colágeno y gelatina: extracción, hidrólisis y uso estratégico en fondos y salsas",
  "Maduraciones de aves en frigorífico: diferenciación en textura y expresión de sabor",
  "Emulsiones proteicas en charcutería de alta gama: mousselines y patés aireados",
  "Carne de caza: características organolépticas, manejo de acidez y técnicas de brigada",
  "Textura en pescados madurados: autólisis, rigor mortis y ventanas de cocción",
  "Curing y gravlax: osmosis, concentración salina y perfiles aromáticos controlados",
  "La cocción del calamar: umbrales de temperatura, proteínas actomiosínicas y terneza",
  "Crustáceos y reacción de Maillard seca: protocolo de tostar cabezas para bisques",
  "Fermentaciones lácteas en cocina salada: kéfir de agua, sueros y ácidos orgánicos",
  "Koji y su rol enzimático: producción de umami, proteólisis y fermentaciones controladas",
  "Vinagres artesanales en cocina de alta gama: acetificación, maduración y uso estratégico",
  "Miso y sus variantes: proceso de fermentación, grado de umami y aplicaciones en salsas",
  "Shrubs y oxymeles gastronómicos: fermentación acética de frutas como vector de sabor",
  "Esferificación básica e inversa: alginato, calcio y control de pH en el servicio",
  "Nitrógeno líquido: aplicaciones en texturas, aromas y presentación de alta cocina",
  "Centrifugación en cocina: clarificación, separación de fases y aplicaciones creativas",
  "Rotovapor y destilación al vacío: extracción de aromas delicados para salsas y cócteles",
  "Impresión 3D de alimentos: materiales, proteínas viables y limitaciones de cocina en vivo",
  "Emulsiones de grasa de caza: lecitina de soja, temperatura y estabilidad de servicio",
  "La grasa intramuscular del wagyu: marmoleado, punto de fusión y experiencia sensorial",
  "Aceites infusionados al vacío: velocidades de extracción, temperatura óptima y conservación",
  "Clarificación de mantequilla: caseinato, agua residual y punto de humo crítico",
  "Grasas trans en pastelería profesional: impacto técnico, alternativas y estándares actuales",
  "Chocolate: cristalización de la manteca de cacao, temperado y curvas de enfriamiento",
  "La pastelería sin gluten: harinas alternativas, estructura proteica y humedad residual",
  "Merengues: italiano, suizo y francés desde la estabilidad molecular hasta el servicio",
  "Caramelos y confitería: control de saturación, humedad y cristalización del azúcar",
  "Helados y sorbetes: punto de congelación, cristales de hielo y estabilizadores técnicos",
  "Foodpairing y la ciencia del aroma: compuestos volátiles compartidos entre ingredientes dispares",
  "La volatilidad del calor y el aroma: cómo preservar notas top en salsas emulsionadas",
  "Destilados gastronómicos en salsas: alcohol, aromas terciarios y punto de incorporación",
  "Infusiones en frío vs. caliente: velocidad de extracción, perfil aromático y claridad",
  "Proteínas vegetales: estructura, funcionalidad y comportamiento en cocción comparado con carnes",
  "Fermentación de vegetales en salmuera: lactobacilos, acidificación y control de temperatura",
  "Técnicas de deshidratación: curvas de temperatura y humedad para vegetales y frutas",
  "La cocción maillard en vegetales: azúcares reductores, pH y variables de textura",
  "Osmosis en encurtidos rápidos: sal, vinagre, azúcar y control del equilibrio",
  "Mise en place isotérmica en cocina de alta demanda: diseño, flujo y punto crítico",
  "Control HACCP desde la brigada: temperatura, tiempo y superficies en el servicio real",
  "Gestión del desperdicio cero: técnicas de aprovechamiento de cortes y recortes nobles",
  "La escuela del fondo: construcción de stocks oscuros, blancos y fumet sin atajos",
  "Eficiencia en brigada: comunicación, timings y mise en place para menú degustación",
  "La construcción de sabor por capas: base, arco y punto de tensión en el plato final",
  "Acidez como herramienta editorial del plato: uso intencional de ácidos en cocina salada",
  "Sal y salado: percepción sensorial, tipos de sal, momento de aplicación y efecto en producto",
  "Amargor controlado: ingredientes, umbral de percepción y su rol en menús degustación",
  "La pirámide del umami: proteínas, nucleótidos y sinergia con ácido glutámico libre",
];

function pickTopicsForCycle(tiers: string[]): string[] {
  const shuffled = [...ALL_TOPICS].sort(() => Math.random() - 0.5);
  return tiers.map((_, i) => shuffled[i % shuffled.length]);
}

// ─────────────────────────────────────────────────────────────────────────────
//  MAIN CYCLE
// ─────────────────────────────────────────────────────────────────────────────
export async function generateCourseCycle() {
  const supaLogs = supabaseLogs;
  const supaCourses = supabaseCourses;
  
  if (!supaLogs || !supaCourses) throw new Error('Supabase Shards (LOGS or COURSES) not configured');

  const cycleId = `cycle-${new Date().toISOString().split('T')[0]}-${Math.floor(Math.random() * 1000)}`;
  const { data: cycle, error: cycleErr } = await supaLogs.from('engine_cycles').insert({
    cycle_id: cycleId,
    status: 'processing'
  }).select().single();

  if (cycleErr) throw cycleErr;

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const model = process.env.GEMINI_MODEL || 'gemini-2.5-pro';

    const tiers: ('FREE' | 'PRO' | 'PREMIUM')[] = [
      'FREE', 'FREE',
      'PRO', 'PRO', 'PRO', 'PRO',
      'PREMIUM', 'PREMIUM', 'PREMIUM', 'PREMIUM', 'PREMIUM', 'PREMIUM', 'PREMIUM', 'PREMIUM'
    ];

    const topics = pickTopicsForCycle(tiers);

    for (let i = 0; i < tiers.length; i++) {
      const tier = tiers[i];
      const topic = topics[i];

      console.log(`[GrandChef Engine (Gemini)] Generating ${tier} course: "${topic}"...`);

      const systemPrompt = SYSTEM_IDENTITY;
      const userPrompt = buildUserPrompt(tier, topic);

      let response;
      try {
        response = await ai.models.generateContent({
          model,
          contents: userPrompt,
          config: {
            systemInstruction: systemPrompt,
            responseMimeType: 'application/json',
            temperature: 0.8
          }
        });
      } catch (genErr) {
        console.error(`[GrandChef Engine] Error generating course "${topic}":`, genErr);
        continue;
      }

      let result: GeneratedCourse;
      try {
        const textResponse = response.text;
        result = JSON.parse(textResponse || '{}');
        if (!result.title || !result.full_content) {
          console.error(`[GrandChef Engine] Invalid course output for topic "${topic}". Skipping.`);
          continue;
        }
      } catch (parseErr) {
        console.error(`[GrandChef Engine] Failed to parse JSON for topic "${topic}":`, parseErr);
        continue;
      }

      const wordCount = result.full_content.split(/\s+/).length;

      const { error: courseErr } = await supaCourses.from('courses').insert({
        title: result.title,
        description: result.description,
        instructor: 'Grand Chef',
        tier: tier,
        full_content: result.full_content,
        generation_cycle_id: cycleId,
        modules: [{ id: 'full', title: 'Curso Completo', content: result.full_content }]
      });

      if (courseErr) {
        console.error(`[GrandChef Engine] DB insert error for "${topic}":`, courseErr);
        continue;
      }

      console.log(`[GrandChef Engine] ✓ ${tier} course saved in COURSES shard: "${result.title}" (${wordCount} words)`);
    }

    await supaLogs.from('engine_cycles').update({
      status: 'completed',
      completed_at: new Date().toISOString()
    }).eq('id', cycle.id);

    console.log(`[GrandChef Engine] ✓ Cycle ${cycleId} completed in LOGS shard.`);
    return { ok: true, cycleId };

  } catch (err: any) {
    console.error('[GrandChef Engine] Cycle failed:', err);
    await supaLogs.from('engine_cycles').update({ status: 'failed' }).eq('id', cycle.id);
    throw err;
  }
}
