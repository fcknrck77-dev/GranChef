import OpenAI from 'openai';
import getCoreClient from './supabase/core';
import getCoursesClient from './supabase/courses';
import getLogsClient from './supabase/logs';
import getAiClient from './supabase/ai';
import { getCulinaryKnowledge } from './ai_service';

import { 
  SYSTEM_IDENTITY, 
  buildCoursePrompt,
  buildIngredientPrompt,
  buildTechniquePrompt,
  buildRecipePrompt
} from './culinary_prompts';
import { fulfillAiRequest } from './ai_service';

export interface GeneratedCourse {
  title: string;
  description: string;
  tier: 'FREE' | 'PRO' | 'PREMIUM';
  full_content: string;
  reading_time?: string;
}


// ─────────────────────────────────────────────────────────────────────────────
//  USER PROMPT — Instrucción de Generación por Nivel
// ─────────────────────────────────────────────────────────────────────────────
const INGREDIENT_TOPICS = [
  "Plancton Marino: producción, liofilización y potencial de umami marino",
  "Ajo Negro: fermentación enzimática controlada y perfiles de acritud",
  "Yuzu: terpenos cítricos y su rol en la acidez de vanguardia",
  "Katsuobushi: el proceso de ahumado y fermentación del bonito",
  "Sal de Camarga: cristales, trazas minerales y efecto en el sellado",
  "Aceite de Argán: extracción tradicional y notas de frutos secos en cocina",
  "Trufa Blanca de Alba: dimetilsulfuro y la volatilidad del aroma",
  "Pimentón de la Vera: secado al humo y capsaicina controlada",
  "Vainilla de Tahití: piperonal vs vainillina en perfiles aromáticos",
  "Azafrán de la Mancha: crocina y safranal como agentes colorantes y aromáticos",
];

const TECHNIQUE_TOPICS = [
  "Esferificación inversa: control de lactato de calcio y alginato",
  "Clarificación con agar-agar: red de polímeros y separación de sólidos",
  "Liofilización: sublimación del agua y preservación de estructura molecular",
  "Cocción a presión controlada: el efecto en la hidrólisis del colágeno",
  "Infusión por vacío: impregnación de líquidos en matrices vegetales",
  "Destilación por rotovapor: captura de notas top volátiles",
  "Fermentación con Koji: proteólisis y amilólisis acelerada",
  "Niztamalización: el impacto del hidróxido de calcio en el maíz",
  "Curado en seco (Dry Aging): actividad enzimática y concentración de sabor",
  "Decantación centrífuga: separación de fases en caldos y jugos",
];

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
  "La pirámide del umami: proteínas, nucleótidos y sinergia con ácido glutámico libre",
  "Fermentación controlada en panadería: levaduras salvajes vs comerciales",
  "El mundo de los caldos: desde el consomé clarificado hasta el ramen tonkotsu",
  "Técnicas de corte japonesas: Katsuramuki y su aplicación en la estética del plato",
  "Humo líquido vs ahumado natural: química del humo y seguridad alimentaria",
  "Aceites esenciales en cocina: extracción, dilución y potencia aromática",
  "La ciencia de las espumas: sifón iSi, agentes espumantes y estabilidad térmica",
  "Cocreación Chef e IA: cómo usar algoritmos para descubrir maridajes inéditos",
  "Protocolos de servicio de sala: la coreografía entre cocina y comensal",
  "Gestión de costes en alta cocina: ingeniería de menú y escandallos de precisión",
];

function pickTopicsForCycle(tiers: string[]): string[] {
  const shuffled = [...ALL_TOPICS].sort(() => Math.random() - 0.5);
  return tiers.map((_, i) => shuffled[i % shuffled.length]);
}

// ─────────────────────────────────────────────────────────────────────────────
//  MAIN CYCLE
// ─────────────────────────────────────────────────────────────────────────────
export async function generateCourseCycle() {
  const supaLogs = getLogsClient();
  const supaCourses = getCoursesClient();
  
  if (!supaLogs || !supaCourses) throw new Error('Supabase Shards (LOGS or COURSES) not configured');

  const cycleId = `cycle-${new Date().toISOString().split('T')[0]}-${Math.floor(Math.random() * 1000)}`;
  const { data: cycle, error: cycleErr } = await supaLogs.from('engine_cycles').insert({
    cycle_id: cycleId,
    status: 'processing'
  }).select().single();

  if (cycleErr) throw cycleErr;

  try {
    const orKey = process.env.OPENROUTER_API_KEY;
    const groqKey1 = process.env.GROQ_API_KEY;
    const groqKey2 = process.env.GROQ_API_KEY_2;
    
    const getAiConfigs = () => {
      const configs = [];
      if (orKey) {
        configs.push({
          client: new OpenAI({
            apiKey: orKey,
            baseURL: 'https://openrouter.ai/api/v1',
            defaultHeaders: { 'HTTP-Referer': 'https://grandchefapp.online', 'X-Title': 'GrandChef Engine' }
          }),
          model: process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.3-70b-instruct',
          name: 'OpenRouter'
        });
      }
      if (groqKey1) {
        configs.push({
          client: new OpenAI({
            apiKey: groqKey1,
            baseURL: 'https://api.groq.com/openai/v1',
          }),
          model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
          name: 'Groq-1'
        });
      }
      if (groqKey2) {
        configs.push({
          client: new OpenAI({
            apiKey: groqKey2,
            baseURL: 'https://api.groq.com/openai/v1',
          }),
          model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
          name: 'Groq-2'
        });
      }
      return configs;
    };

    const aiConfigs = getAiConfigs();
    if (aiConfigs.length === 0) throw new Error('No AI Provider (OpenRouter/Groq) configured');

    const tiers: ('FREE' | 'PRO' | 'PREMIUM')[] = [
      'FREE', 'FREE',
      'PRO', 'PRO', 'PRO', 'PRO',
      'PREMIUM', 'PREMIUM', 'PREMIUM', 'PREMIUM', 'PREMIUM', 'PREMIUM', 'PREMIUM', 'PREMIUM'
    ];

    const topics = pickTopicsForCycle(tiers);

    for (let i = 0; i < tiers.length; i++) {
      const tier = tiers[i];
      const topic = topics[i];

      const knowledge = await getCulinaryKnowledge(topic);
      const userPrompt = buildCoursePrompt(tier, topic, knowledge);

      let response;
      let success = false;

      for (const config of aiConfigs) {
        try {
          console.log(`[GrandChef Engine] Generating ${tier} course: "${topic}" using ${config.name} (${config.model})...`);
          response = await config.client.chat.completions.create({
            model: config.model,
            messages: [{ role: 'system', content: SYSTEM_IDENTITY }, { role: 'user', content: userPrompt }],
            response_format: { type: 'json_object' },
            temperature: 0.8
          });
          success = true;
          break;
        } catch (genErr) {
          console.error(`[GrandChef Engine] ${config.name} failed for topic "${topic}":`, (genErr as any).message);
        }
      }

      if (!success || !response) {
        console.error(`[GrandChef Engine] All AI providers failed for topic "${topic}". Skipping.`);
        continue;
      }

      let result: GeneratedCourse;
      try {
        const textResponse = response.choices[0].message?.content || '{}';
        result = JSON.parse(textResponse);
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

      console.log(`[GrandChef Engine] ✓ ${tier} course saved: "${result.title}" (${wordCount} words)`);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 2. GENERATE LABORATORY CONTENT (Ingredients & Techniques)
    // ─────────────────────────────────────────────────────────────────────────
    const supaAiBrain = getAiClient();
    if (supaAiBrain) {
      const randomIngs = [...INGREDIENT_TOPICS].sort(() => Math.random() - 0.5).slice(0, 3);
      const randomTechs = [...TECHNIQUE_TOPICS].sort(() => Math.random() - 0.5).slice(0, 3);

      for (const t of randomIngs) {
        try {
          const req = await supaLogs.from('ai_requests').insert({ kind: 'ingredients', instruction: t, status: 'pending' }).select().single();
          if (req.data) await fulfillAiRequest(req.data.id);
        } catch (e) {
          console.error(`[GrandChef Engine] Laboratory Ing Error:`, e);
        }
      }
      for (const t of randomTechs) {
        try {
          const req = await supaLogs.from('ai_requests').insert({ kind: 'techniques', instruction: t, status: 'pending' }).select().single();
          if (req.data) await fulfillAiRequest(req.data.id);
        } catch (e) {
          console.error(`[GrandChef Engine] Laboratory Tech Error:`, e);
        }
      }
    }

    await supaLogs.from('engine_cycles').update({
      status: 'completed',
      completed_at: new Date().toISOString()
    }).eq('id', cycle.id);

    console.log(`[GrandChef Engine] ✓ Full Cycle ${cycleId} completed.`);
    return { ok: true, cycleId };

  } catch (err: any) {
    console.error('[GrandChef Engine] Cycle failed:', err);
    await supaLogs.from('engine_cycles').update({ status: 'failed' }).eq('id', cycle.id);
    throw err;
  }
}
