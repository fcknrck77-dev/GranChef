import OpenAI from 'openai';
import getAiClient from './supabase/ai';
import getLogsClient from './supabase/logs';
import { getSupabase } from './supabaseClient';
import { 
  SYSTEM_IDENTITY, 
  buildIngredientPrompt, 
  buildTechniquePrompt, 
  buildRecipePrompt,
  buildCoursePrompt 
} from './culinary_prompts';

// ─────────────────────────────────────────────────────────────────────────────
//  AI CLIENT CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────

function getAiProvider(preference: 'OpenRouter' | 'Groq' = 'OpenRouter') {
  const orKey = process.env.OPENROUTER_API_KEY;
  const groqKeys = [process.env.GROQ_API_KEY, process.env.GROQ_API_KEY_2].filter(Boolean);

  if (preference === 'OpenRouter' && orKey) {
    return {
      client: new OpenAI({
        apiKey: orKey,
        baseURL: 'https://openrouter.ai/api/v1',
        defaultHeaders: {
          'HTTP-Referer': 'https://grandchefapp.online',
          'X-Title': 'GrandChef Lab',
        }
      }),
      model: process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.3-70b-instruct',
      provider: 'OpenRouter'
    };
  }

  if (groqKeys.length > 0) {
    // Basic rotation or pick first available (for now we loop in the failover loop)
    const key = groqKeys[0]; 
    return {
      client: new OpenAI({
        apiKey: key as string,
        baseURL: 'https://api.groq.com/openai/v1',
      }),
      model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
      provider: 'Groq'
    };
  }

  throw new Error('No AI Provider (OpenRouter/Groq) available');
}

// ─────────────────────────────────────────────────────────────────────────────
//  KNOWLEDGE RETRIEVAL
// ─────────────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
//  KNOWLEDGE RETRIEVAL
// ─────────────────────────────────────────────────────────────────────────────

export async function getCulinaryKnowledge(topic: string) {
  const supaAiBrain = getAiClient();
  if (!supaAiBrain) return "";
  
  try {
    const { data, error } = await supaAiBrain
      .from('culinary_knowledge')
      .select('pair_key, body')
      .textSearch('fts', topic, {
        config: 'spanish'
      })
      .limit(3);

    if (error || !data || data.length === 0) return "";
    
    return data.map(k => `--- CONOCIMIENTO EXTRACTADO (${k.pair_key}) ---\n${k.body}`).join('\n\n');
  } catch (err) {
    console.error('[AI KNOWLEDGE] Error fetching knowledge:', err);
    return "";
  }
}

function buildTestPrompt(courseTitle: string, tier: string, courseContent: string): string {
  const count = tier === 'FREE' ? 10 : (tier === 'PRO' ? 25 : 50);
  return `
ORDEN: Generar un Examen de evaluation para el curso: "${courseTitle}"
NIVEL: ${tier} (${count} preguntas obligatorias).

REQUISITOS DEL OBJETO JSON:
1. questions: Array de exactamente ${count} objetos. Cada objeto:
   - question: Texto de la pregunta técnica.
   - options: Array de 4 opciones (strings).
   - correct: Índice de la opción correcta (0-3).

IMPORTANTE:
- Las preguntas deben ser extremadamente profesionales y alineadas con el contenido: ${courseContent.slice(0, 500)}...
- Sin respuestas obvias. Nivel experto.

DEVUELVE SOLO EL JSON:
{
  "questions": [
    { "question": "...", "options": ["...", "...", "...", "..."], "correct": 0 }
  ]
}
`.trim();
}

// ─────────────────────────────────────────────────────────────────────────────
//  AI SERVICE LOGIC (MULTI-PROVIDER WITH FAILOVER)
// ─────────────────────────────────────────────────────────────────────────────

export async function fulfillAiRequest(requestId: string) {
  const supaLogs = getLogsClient();
  const supaAiBrain = getAiClient();
  
  if (!supaLogs || !supaAiBrain) throw new Error('Supabase Shards (LOGS or AI_BRAIN) not configured');

  const { data: request, error: fetchErr } = await supaLogs
    .from('ai_requests')
    .select('*')
    .eq('id', requestId)
    .single();

  if (fetchErr || !request) throw new Error('Request not found');

  await supaLogs.from('ai_requests').update({ status: 'processing' }).eq('id', requestId);

  try {
    let userPrompt = '';
    let targetTable = '';
    const knowledge = await getCulinaryKnowledge(request.instruction);

    if (request.kind === 'ingredients') {
      userPrompt = buildIngredientPrompt(request.instruction, knowledge);
      targetTable = 'ingredients';
    } else if (request.kind === 'techniques') {
      userPrompt = buildTechniquePrompt(request.instruction);
      targetTable = 'techniques';
    } else if (request.kind === 'recipes') {
      userPrompt = buildRecipePrompt(request.instruction, knowledge);
      targetTable = 'recipes';
    } else if (request.kind === 'courses') {
      userPrompt = buildCoursePrompt((request.payload?.tier || 'FREE') as any, request.instruction, knowledge);
      targetTable = 'courses';
    } else if (request.kind === 'course_tests') {
      const { courseTitle, tier, courseContent } = request.payload || {};
      userPrompt = buildTestPrompt(courseTitle || 'Curso', tier || 'FREE', courseContent || '');
      targetTable = 'course_tests';
    } else {
      throw new Error(`Unsupported kind: ${request.kind}`);
    }

    let completion;
    let usedProvider = '';

    const attemptConfigs: { name: string, key: string, base: string, model: string }[] = [];
    if (process.env.OPENROUTER_API_KEY) {
      attemptConfigs.push({ name: 'OpenRouter', key: process.env.OPENROUTER_API_KEY, base: 'https://openrouter.ai/api/v1', model: process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.3-70b-instruct' });
    }
    if (process.env.GROQ_API_KEY) {
      attemptConfigs.push({ name: 'Groq-1', key: process.env.GROQ_API_KEY, base: 'https://api.groq.com/openai/v1', model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile' });
    }
    if (process.env.GROQ_API_KEY_2) {
      attemptConfigs.push({ name: 'Groq-2', key: process.env.GROQ_API_KEY_2, base: 'https://api.groq.com/openai/v1', model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile' });
    }

    let success = false;
    for (const conf of attemptConfigs) {
      try {
        console.log(`[AI SERVICE] Attempting with ${conf.name}...`);
        const client = new OpenAI({
          apiKey: conf.key,
          baseURL: conf.base,
          defaultHeaders: conf.name === 'OpenRouter' ? { 'HTTP-Referer': 'https://grandchefapp.online', 'X-Title': 'GrandChef Lab' } : {}
        });

        completion = await client.chat.completions.create({
          model: conf.model,
          messages: [{ role: 'system', content: SYSTEM_IDENTITY }, { role: 'user', content: userPrompt }],
          response_format: { type: 'json_object' },
          temperature: 0.7
        });
        usedProvider = conf.name;
        success = true;
        break;
      } catch (err) {
        console.warn(`[AI SERVICE] ${conf.name} failed: ${(err as any).message}`);
      }
    }

    if (!success || !completion) throw new Error('All AI providers (OpenRouter/Groq-1/Groq-2) failed.');

    const resultText = completion.choices[0].message?.content || '{}';
    const resultJson = JSON.parse(resultText);
    console.log(`[AI SERVICE] Success using ${usedProvider}`);

    // Insert into final table (normalize to DB schema)
    let rowToInsert: any = resultJson;
    let finalShard = supaAiBrain; // Default

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
    } else if (request.kind === 'courses') {
      const coursesShard = getSupabase('COURSES');
      if (coursesShard) finalShard = coursesShard;
      rowToInsert = {
        id: resultJson.id,
        title: resultJson.title,
        description: resultJson.description,
        instructor: resultJson.instructor || 'Grand Chef',
        category: resultJson.category || 'Técnicas',
        tier: resultJson.tier || 'FREE',
        days_required: resultJson.days_required || 1,
        reading_time: resultJson.reading_time || '',
        modules: resultJson.modules || []
      };
    } else if (request.kind === 'course_tests') {
      const coursesShard = getSupabase('COURSES');
      if (coursesShard) finalShard = coursesShard;
      rowToInsert = {
        course_id: request.payload?.course_id,
        questions: resultJson.questions,
        pass_percentage: 60,
        unlock_price: 2.50
      };
    }

    const { error: insertErr } = await (finalShard as any).from(targetTable).upsert(rowToInsert, { onConflict: request.kind === 'course_tests' ? undefined : 'id' });
    if (insertErr) throw insertErr;

    // Update request in LOGS shard
    await supaLogs.from('ai_requests').update({ 
      status: 'completed',
      payload: resultJson 
    }).eq('id', requestId);

    console.log(`[AI SERVICE] ✓ Fulfilled ${request.kind} request: ${resultJson.name || resultJson.title || 'Exam'}`);
    return { ok: true, data: resultJson };

  } catch (err: any) {
    console.error(`[AI SERVICE] Error fulfilling request ${requestId}:`, err);
    await supaLogs.from('ai_requests').update({ status: 'failed' }).eq('id', requestId);
    throw err;
  }
}
