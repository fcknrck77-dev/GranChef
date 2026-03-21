/* eslint-disable no-console */
const fs = require('node:fs');
const path = require('node:path');
const { createClient } = require('@supabase/supabase-js');

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
        const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
        if (!(key in process.env)) process.env[key] = val;
    }
}

async function getOllamaResponse(prompt, model = 'phi') {
    try {
        const response = await fetch('http://127.0.0.1:11434/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model,
                prompt: `Eres el Sistema Maestro de GrandChef. Genera contenido culinario profesional. ${prompt}`,
                stream: false
            })
        });
        const data = await response.json();
        return data.response.trim();
    } catch (e) {
        console.warn(`[Ollama] Failed: ${e.message}`);
        return null;
    }
}

async function main() {
    loadDotEnvLocal();
    const coreSupa = createClient(process.env.SUPABASE_CORE_URL, process.env.SUPABASE_CORE_SERVICE_KEY);
    const netSupa = createClient(process.env.SUPABASE_NETWORKING_URL || process.env.SUPABASE_CORE_URL, process.env.SUPABASE_NETWORKING_SERVICE_KEY || process.env.SUPABASE_CORE_SERVICE_KEY);

    console.log('🤖 INICIANDO GRANJA DE BOTS - Humanización Activa');

    const chefNames = [
        'Ferran Valles', 'Elena Santamaría', 'Jordi Roca', 'Marta Segura', 'Quique Dacosta', 'Carme Ruscalleda', 'Andoni Aduriz', 'Martín Berasategui', 'Dabiz Muñoz', 'Eneko Atxa',
        'Ángel León', 'Joan Roca', 'Paco Pérez', 'Dani García', 'Albert Adrià', 'Nandu Jubany', 'Sergi Arola', 'Toño Pérez', 'Diego Guerrero', 'Mario Sandoval',
        'Francis Paniego', 'Erlantz Gorostiza', 'Nacho Manzano', 'Susi Díaz', 'Begoña Rodrigo', 'Pepa Muñoz', 'Lucía Freitas', 'María José San Román', 'Fina Puigdevall', 'Macarena de Castro',
        'Javi Estévez', 'Aitor Arregui', 'Kiko Moya', 'Ricard Camarena', 'Oriol Castro', 'Eduard Xatruch', 'Mateu Casañas', 'Rafa Zafra', 'Rodrigo de la Calle', 'Iván Cerdeño',
        'Aurelio Morales', 'Mario Payán', 'Ricardo Sanz', 'Toshiya Kai', 'Hideki Matsuhisa', 'Koy Shunka', 'Naoaki Kasui', 'Keiko Tagaki', 'Hiroshi Kobayashi', 'Kenji Ueno'
    ];

    const chefSpecialties = [
        'Fermentaciones Bioquímicas', 'Vanguardia Crítica', 'Pastelería Molecular', 'Caza y Recolección Estacional', 'Caldos de Alta Densidad', 
        'Maduración de Pescados Azules', 'Micología Aplicada', 'Panificación de Masa Madre Salvaje', 'Gelatinas Técnicas', 'Emulsiones de Grasa Animal',
        'Cocina de Paisaje', 'Desarrollo de Garums Modernos', 'Hidrolatos Culinarios', 'Crioconcentración', 'Encurtidos de Tercera Ola'
    ];
    
    const chefRoles = ['Chef Ejecutivo', 'I+D Responsable', 'Director Gastronómico', 'Sous Chef Senior', 'Sommelier Innovación', 'Científico de Alimentos'];        
    
    // 1. Generate 50 Bots
    console.log('--- Generando 50 Perfiles de Chefs Virtuales ---');
    for (let i = 0; i < 50; i++) { // Changed loop to 0-49 for array indexing
        const spec = chefSpecialties[i % chefSpecialties.length];
        const role = chefRoles[i % chefRoles.length]; // Use chefRoles
        const timestamp = Date.now().toString(36);
        const name = chefNames[i]; // Use chefNames
        const email = `botchef${i + 1}_${timestamp}@grandchef_virtual.ai`; // Adjusted for 1-based numbering in email
        
        const { data: user, error: uErr } = await coreSupa.from('app_users').insert({
            name,
            email,
            status: 'active',
            plan: 'PRO',
            notes: `${role} especializado en ${spec}`, // Use role in notes
        }).select('id').single();

        if (uErr) {
            console.error(`Error creating bot user ${i}:`, uErr.message);
            continue;
        }

        const botId = user.id;
        console.log(`[Bot ${i + 1}] Creado: ${name} (ID: ${botId})`);

        // 2. Generate 4 Social Posts per Bot with varied types
        console.log(`[Bot ${i + 1}] Generando publicaciones...`);
        const postTypes = ['discovery', 'tip', 'question', 'pairing'];
        const postsCreated = [];

        for (let j = 1; j <= 4; j++) {
            const type = postTypes[j % postTypes.length];
            const prompt = `Genera un post de tipo '${type}' extremadamente técnico sobre ${spec}. 
               - Si es 'discovery', habla de un hallazgo científico.
               - Si es 'tip', da un consejo de alta cocina.
               - Si es 'question', haz una pregunta técnica a la comunidad.
               - Si es 'pairing', propón un maridaje molecular de ${spec} con ingredientes inusuales.
               Máximo 220 caracteres. Sin hashtags genéricos.`;
               
            const content = await getOllamaResponse(prompt) || `Documentando avances en ${spec}...`;
            
            // Randomize created_at within the last 7 days
            const daysAgo = Math.random() * 7;
            const createdAt = new Date(Date.now() - daysAgo * 24 * 3600 * 1000).toISOString();

            const { data: post, error: pErr } = await coreSupa.from('social_posts').insert({
                user_id: botId,
                content,
                type,
                metadata: { specialty: spec, bot: true, role },
                created_at: createdAt
            }).select('id').single();

            if (pErr) {
                 console.error(`  - Failed to add post: ${pErr.message}`);
                 if (pErr.message.includes('relation "social_posts" does not exist')) {
                     console.error('⛔ DETENIENDO: La tabla social_posts no existe. Ejecuta el SQL primero.');
                     return;
                 }
            } else {
                 console.log(`  - Post ${j} (${type}) publicado.`);
                 if (post) postsCreated.push(post.id);
            }
        }

        // 3. Interactions (Simulate other bots liking these posts)
        if (postsCreated.length > 0 && i > 0) {
            console.log(`[Bot ${i + 1}] Simulando interacciones de red...`);
            // Every bot has a chance to like a few random posts from the previous bots
            const likeCount = Math.floor(Math.random() * 5) + 1;
            for (let k = 0; k < likeCount; k++) {
                // This is a simplified simulation: just adding to a hypothetical 'likes' table
                // or just logging activity for now if table doesn't exist.
                // If you have a 'social_likes' table:
                // await coreSupa.from('social_likes').insert({ user_id: botId, post_id: some_recent_post_id });
            }
        }
    }

    console.log('🚀 GRANJA DE BOTS HUMANIZADA Y COMPLETADA.');
}

main().catch(console.error);
