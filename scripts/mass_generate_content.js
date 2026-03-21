const fs = require('node:fs');
const path = require('node:path');
const { createClient } = require('@supabase/supabase-js');
const { OpenAI } = require('openai');

function loadDotEnvLocal() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) return;
  const raw = fs.readFileSync(envPath, 'utf8');
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    let val = trimmed.slice(idx + 1).trim();
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
    if (key) process.env[key] = val;
  }
}

loadDotEnvLocal();

const SHARDS = {
  CORE: { url: process.env.SUPABASE_CORE_URL || process.env.SUPABASE_URL, key: process.env.SUPABASE_CORE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY },
  COURSES: { url: process.env.SUPABASE_COURSES_URL, key: process.env.SUPABASE_COURSES_SERVICE_KEY },
  AI_BRAIN: { url: process.env.SUPABASE_AI_URL, key: process.env.SUPABASE_AI_SERVICE_KEY },
  LOGS: { url: process.env.SUPABASE_LOGS_URL, key: process.env.SUPABASE_LOGS_SERVICE_KEY },
};

const clients = {};
function getClient(shard) {
  if (clients[shard]) return clients[shard];
  const conf = SHARDS[shard];
  if (!conf || !conf.url || !conf.key) throw new Error(`Missing config for shard ${shard}`);
  clients[shard] = createClient(conf.url, conf.key);
  return clients[shard];
}

const SYSTEM_IDENTITY = `
Eres el RedactorMaestro de GrandChef Lab: una inteligencia editorial gastronómica autónoma de nivel internacional.
Tu función es generar contenido culinario original, técnico y profesional (Ingredientes, Técnicas, Recetas, Cursos).
No copias, no usas relleno, no repites frases. Cada entrada es magistral.
`.trim();

function getActiveAiClient() {
  const orKey = process.env.OPENROUTER_API_KEY;
  const groqKey = process.env.GROQ_API_KEY;

  if (orKey) {
    return {
      client: new OpenAI({
        apiKey: orKey,
        baseURL: 'https://openrouter.ai/api/v1',
        defaultHeaders: {
          'HTTP-Referer': 'https://grandchefapp.online',
          'X-Title': 'GrandChef Mass Generator',
        }
      }),
      model: process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.3-70b-instruct',
      providerName: 'OpenRouter'
    };
  }
  if (groqKey) {
    return {
      client: new OpenAI({
        apiKey: groqKey,
        baseURL: 'https://api.groq.com/openai/v1',
      }),
      model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
      providerName: 'Groq'
    };
  }
  throw new Error('No AI Provider (Groq or OpenRouter) configured in .env.local');
}

async function generateJSON(prompt) {
  const { client, model, providerName } = getActiveAiClient();
  try {
    const completion = await client.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: SYSTEM_IDENTITY },
        { role: 'user', content: prompt }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7
    });
    return JSON.parse(completion.choices[0].message?.content || '{}');
  } catch (err) {
    console.error(`AI Generation Error (${providerName}):`, err.message);
    return null;
  }
}

async function massGenerateIngredients(targetCount = 200) {
  const supa = getClient('AI_BRAIN');
  console.log(`[ING] Starting expansion to ${targetCount} ingredients...`);
  
  const { count: currentCount } = await supa.from('ingredients').select('*', { count: 'exact', head: true });
  const count = currentCount || 0;
  
  if (count >= targetCount) {
    console.log(`[ING] Already have ${count} ingredients. Skipping.`);
    return;
  }

  const batchSize = 10;
  for (let i = count; i < targetCount; i += batchSize) {
    console.log(`[ING] Batch ${i} to ${i + batchSize}...`);
    const prompt = `Genera una lista de ${batchSize} ingredientes gastronómicos de ALTA GAMA que NO sean comunes (ej: Trufa, Caviar, Ajo negro, Plancton).
    Para cada uno devuelve: { id, name, category, family, description (300 palabras), pairing_notes (array), stories (objeto { nombre: sinergia }) }.
    Devuelve un array de objetos.`;
    
    const data = await generateJSON(prompt);
    if (data && Array.isArray(data)) {
      await supa.from('ingredients').upsert(data, { onConflict: 'id' });
    }
  }
}

async function massGenerateTechniques(targetCount = 100) {
  const supa = getClient('AI_BRAIN');
  console.log(`[TECH] Starting expansion to ${targetCount} techniques...`);
  
  const { count } = await supa.from('techniques').select('*', { count: 'exact', head: true });
  if (count >= targetCount) {
    console.log(`[TECH] Already have ${count} techniques. Skipping.`);
    return;
  }

  const batchSize = 5;
  for (let i = count; i < targetCount; i += batchSize) {
    console.log(`[TECH] Batch ${i} to ${i + batchSize}...`);
    const prompt = `Genera ${batchSize} técnicas culinarias profesionales de nivel avanzado (ej: Esferificación, Liofilización, Clarificación por congelación).
    Para cada una: { id, name, category, description (400 palabras), difficulty, equipment, reagents, pairing_notes }.
    Devuelve un array de objetos.`;
    
    const data = await generateJSON(prompt);
    if (data && Array.isArray(data)) {
      await supa.from('techniques').upsert(data, { onConflict: 'id' });
    }
  }
}

async function massGenerateRecipes(targetCount = 200) {
  const supa = getClient('AI_BRAIN');
  console.log(`[RECIPE] Starting expansion to ${targetCount} recipes...`);
  
  const { count } = await supa.from('recipes').select('*', { count: 'exact', head: true });
  if (count >= targetCount) {
    console.log(`[RECIPE] Already have ${count} recipes. Skipping.`);
    return;
  }

  const batchSize = 5;
  for (let i = count; i < targetCount; i += batchSize) {
    const tier = i < 70 ? 'FREE' : (i < 140 ? 'PRO' : 'PREMIUM');
    console.log(`[RECIPE] Batch ${i} to ${i + batchSize} (${tier})...`);
    const prompt = `Genera ${batchSize} recetas "escrupulosamente perfectas" de nivel profesional para el plan ${tier}.
    Deben ser platos de alta cocina original.
    Cada una: { id, title, source: "Grand Chef", tier: "${tier}", difficulty, servings, times, description, utensils, ingredients (con cantidades precisas), steps (mínimo 12 pasos), techniques (IDs de técnicas), tags }.
    Devuelve un array de objetos.`;
    
    const data = await generateJSON(prompt);
    if (data && Array.isArray(data)) {
      await supa.from('recipes').upsert(data, { onConflict: 'id' });
    }
  }
}

async function massGenerateCourses(targetCount = 60) {
  const supa = getClient('COURSES');
  console.log(`[COURSE] Starting expansion to ${targetCount} courses...`);
  
  const { count } = await supa.from('courses').select('*', { count: 'exact', head: true });
  if (count >= targetCount) {
    console.log(`[COURSE] Already have ${count} courses. Skipping.`);
    return;
  }

  const batchSize = 1; // Courses are large, do 1 by 1
  for (let i = count; i < targetCount; i++) {
    const tier = i < 20 ? 'FREE' : (i < 40 ? 'PRO' : 'PREMIUM');
    console.log(`[COURSE] Course ${i + 1} of ${targetCount} (${tier})...`);
    const prompt = `Genera un CURSO magistral completo sobre un tema de alta cocina para el plan ${tier}. 
    Tema único, no repetido.
    Estructura: { id, title, description, instructor: "Grand Chef", category, tier: "${tier}", days_required: ${i + 1}, reading_time, modules: [{ id, title, content (muy profundo) }] }.
    Devuelve el objeto JSON directo.`;
    
    const course = await generateJSON(prompt);
    if (course) {
      const { data, error } = await supa.from('courses').upsert(course, { onConflict: 'id' }).select();
      if (data && data[0]) {
        // Generate Test for this course
        const testCount = tier === 'FREE' ? 10 : (tier === 'PRO' ? 25 : 50);
        const testPrompt = `Genera un EXAMEN técnico de ${testCount} preguntas para el curso "${course.title}".
        Basado en este contenido: ${JSON.stringify(course.modules)}.
        Devuelve: { questions: [{ question, options: [4], correct: index }] }.`;
        
        const testData = await generateJSON(testPrompt);
        if (testData) {
          await supa.from('course_tests').insert({
            course_id: data[0].id,
            questions: testData.questions,
            pass_percentage: 60,
            unlock_price: 2.50
          });
        }
      }
    }
  }
}

async function main() {
  console.log('--- GRANDCHEF MASSIVE GENERATION START ---');
  await massGenerateIngredients(200);
  await massGenerateTechniques(100);
  await massGenerateRecipes(200);
  await massGenerateCourses(60);
  console.log('--- ALL SYSTEMS POPULATED ---');
}

main();
