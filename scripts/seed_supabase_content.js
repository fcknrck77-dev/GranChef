/* eslint-disable no-console */
const fs = require('node:fs');
const path = require('node:path');
const { createClient } = require('@supabase/supabase-js');
const { OpenAI } = require('openai');
const fetch = global.fetch;

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

function pad(num, width) {
  const s = String(num);
  return s.length >= width ? s : '0'.repeat(width - s.length) + s;
}

function buildIngredients() {
  // Keep this deterministic so censorship (index-based) stays stable across runs.
  const groups = [
    { family: 'Citricos', category: 'Frutas', names: ['Limon', 'Lima', 'Naranja', 'Pomelo', 'Mandarina', 'Bergamota', 'Yuzu', 'Kumquat'] },
    { family: 'Hierbas', category: 'Aromaticos', names: ['Albahaca', 'Menta', 'Romero', 'Tomillo', 'Cilantro', 'Eneldo', 'Salvia', 'Hierbabuena'] },
    { family: 'Especias', category: 'Especias', names: ['Pimienta negra', 'Pimienta rosa', 'Comino', 'Cardamomo', 'Canela', 'Anis', 'Clavo', 'Coriandro'] },
    { family: 'Umami', category: 'Potenciadores', names: ['Miso', 'Salsa de soja', 'Kombu', 'Shiitake', 'Parmigiano', 'Tomate seco', 'Anchoa', 'Levadura nutricional'] },
    { family: 'Fermentados', category: 'Fermentados', names: ['Koji', 'Kimchi', 'Chucrut', 'Kefir', 'Vinagre de arroz', 'Vinagre de Jerez', 'Gochujang', 'Garum'] },
    { family: 'Lacteos', category: 'Lacteos', names: ['Yogur', 'Nata', 'Mantequilla', 'Queso azul', 'Ricotta', 'Kefir de leche', 'Leche de coco', 'Creme fraiche'] },
    { family: 'Marinos', category: 'Marinos', names: ['Alga nori', 'Alga wakame', 'Huevo de trucha', 'Bottarga', 'Bonito seco', 'Caviar', 'Erizo', 'Sal marina'] },
    { family: 'Tostados', category: 'Tostados', names: ['Cafe', 'Cacao', 'Avellana', 'Almendra', 'Sarraceno tostado', 'Cebolla tostada', 'Sesamo tostado', 'Pan tostado'] },
    { family: 'Florales', category: 'Florales', names: ['Agua de azahar', 'Rosa', 'Lavanda', 'Jazmín', 'Flor de saúco', 'Hibisco', 'Manzanilla', 'Violeta'] },
    { family: 'Amargos', category: 'Amargos', names: ['Endivia', 'Radicchio', 'Pomelo', 'Cacao 90%', 'Cafe espresso', 'Rucula', 'Te matcha', 'Ajenjo'] },
    { family: 'Dulces', category: 'Dulces', names: ['Vainilla', 'Miel', 'Caramelo', 'Panela', 'Azucar muscovado', 'Sirope de arce', 'Dulce de leche', 'Chocolate blanco'] },
    { family: 'Frutos secos', category: 'Frutos secos', names: ['Pistacho', 'Nuez', 'Pecan', 'Anacardo', 'Macadamia', 'Cacahuete', 'Pinon', 'Castana'] },
    { family: 'Tropicales', category: 'Frutas', names: ['Mango', 'Pina', 'Maracuya', 'Guayaba', 'Coco', 'Papaya', 'Lichi', 'Platano'] },
    { family: 'Ahumados', category: 'Ahumados', names: ['Pimenton ahumado', 'Sal ahumada', 'Te lapsang', 'Chipotle', 'Aceite ahumado', 'Mantequilla noisette', 'Bacon', 'Trufa negra'] },
    { family: 'Vegetales', category: 'Vegetales', names: ['Apio', 'Hinojo', 'Remolacha', 'Zanahoria', 'Puerro', 'Ajo negro', 'Coliflor', 'Calabaza'] },
    { family: 'Texturizantes', category: 'Tecnicos', names: ['Alginato de sodio', 'Lecitina de soja', 'Agar-agar', 'Goma xantana', 'Gelatina', 'Pectina NH', 'Iota carragenato', 'Metilcelulosa'] }
  ];

  const raw = [];
  for (const g of groups) {
    for (const name of g.names) {
      raw.push({
        name,
        category: g.category,
        family: g.family,
        description: `Ingrediente de la familia ${g.family}. Úsalo para construir contrastes y puentes aromáticos.`
      });
    }
  }

  const base = ['Cítrico', 'Herbal', 'Especiado', 'Umami', 'Tostado', 'Floral', 'Ahumado', 'Lácteo'];
  const forms = ['Polvo de', 'Extracto de', 'Gel de', 'Aire de', 'Infusion de', 'Reduccion de'];
  let k = 1;
  while (raw.length < 200) {
    const fam = groups[k % groups.length].family;
    const cat = groups[k % groups.length].category;
    const form = forms[k % forms.length];
    const token = base[k % base.length];
    raw.push({
      name: `${form} ${token} ${k}`,
      category: cat,
      family: fam,
      description: `Derivado técnico (${token}) para pruebas controladas de sabor y textura.`
    });
    k++;
  }

  const trimmed = raw.slice(0, 200);
  const names = trimmed.map((x) => x.name);

  return trimmed.map((x, idx) => {
    const partners = [
      names[(idx + 7) % names.length],
      names[(idx + 19) % names.length],
      names[(idx + 31) % names.length],
      names[(idx + 43) % names.length]
    ];

    const stories = {};
    if (idx < 12) {
      stories[partners[0]] = `Cuando se combina con ${partners[0]}, aparece un puente aromático de alta estabilidad.`;
      stories[partners[1]] = `Con ${partners[1]}, el perfil se expande con un final más largo.`;
    }

    return {
      id: `ing-${pad(idx + 1, 3)}`,
      name: x.name,
      category: x.category,
      family: x.family,
      description: x.description,
      pairing_notes: partners,
      stories
    };
  });
}

function buildTechniques() {
  const baseList = [
    { name: 'Esferificación inversa', category: 'Texturización', difficulty: 'Avanzado' },
    { name: 'Aires y espumas', category: 'Texturización', difficulty: 'Básico' },
    { name: 'Gelificación con agar-agar', category: 'Texturización', difficulty: 'Básico' },
    { name: 'Gelificación con pectina', category: 'Texturización', difficulty: 'Intermedio' },
    { name: 'Emulsión estable', category: 'Texturización', difficulty: 'Intermedio' },
    { name: 'Sous-vide', category: 'Térmica', difficulty: 'Intermedio' },
    { name: 'Confitado a baja temperatura', category: 'Térmica', difficulty: 'Intermedio' },
    { name: 'Nitro-congelación', category: 'Térmica', difficulty: 'Maestro' },
    { name: 'Caramelización controlada', category: 'Térmica', difficulty: 'Básico' },
    { name: 'Infusión en frío', category: 'Extracción', difficulty: 'Básico' },
    { name: 'Infusión en caliente', category: 'Extracción', difficulty: 'Básico' },
    { name: 'Destilación aromática', category: 'Extracción', difficulty: 'Avanzado' },
    { name: 'Extracción por grasa', category: 'Extracción', difficulty: 'Intermedio' },
    { name: 'Clarificación', category: 'Extracción', difficulty: 'Intermedio' },
    { name: 'Fermentación controlada', category: 'Extracción', difficulty: 'Avanzado' },
    { name: 'Ahumado en frío', category: 'Extracción', difficulty: 'Intermedio' },
    { name: 'Deshidratación', category: 'Térmica', difficulty: 'Intermedio' },
    { name: 'Liofilización', category: 'Térmica', difficulty: 'Avanzado' },
    { name: 'Pickling rápido', category: 'Extracción', difficulty: 'Básico' },
    { name: 'Curado osmótico', category: 'Extracción', difficulty: 'Intermedio' },
    { name: 'Templado de chocolate', category: 'Térmica', difficulty: 'Intermedio' },
    { name: 'Baño María preciso', category: 'Térmica', difficulty: 'Básico' },
    { name: 'Glaseado espejo', category: 'Presentación', difficulty: 'Avanzado' },
    { name: 'Plating geométrico', category: 'Presentación', difficulty: 'Intermedio' },
    { name: 'Texturas en contraste', category: 'Presentación', difficulty: 'Intermedio' },
    { name: 'Salseado con precisión', category: 'Presentación', difficulty: 'Básico' },
    { name: 'Microplane y rallado', category: 'Presentación', difficulty: 'Básico' },
    { name: 'Gel laminado', category: 'Texturización', difficulty: 'Avanzado' },
    { name: 'Crispy por expansión', category: 'Térmica', difficulty: 'Avanzado' },
    { name: 'Aireado mecánico', category: 'Texturización', difficulty: 'Intermedio' }
  ];

  const list = [...baseList];
  const modifiers = [' de precisión', ' al vacío', ' en frío', ' acelerada', ' enzimática', ' molecular'];
  let i = 0;
  while (list.length < 50) {
    const baseObj = baseList[i % baseList.length];
    const mod = modifiers[i % modifiers.length];
    list.push({
      ...baseObj,
      name: `${baseObj.name}${mod} ${i}`
    });
    i++;
  }

  const equipmentByCategory = {
    'Texturización': ['Báscula de precisión', 'Batidora de inmersión', 'Colador fino'],
    'Térmica': ['Ronner', 'Termómetro', 'Bolsas al vacío'],
    'Extracción': ['Recipiente hermético', 'Filtro', 'Cazo'],
    'Presentación': ['Pinzas', 'Biberón', 'Aro de emplatar']
  };

  const reagentsByName = (name) => {
    const n = name.toLowerCase();
    if (n.includes('esfer')) return ['Alginato de sodio', 'Calcio'];
    if (n.includes('aires') || n.includes('espumas')) return ['Lecitina de soja'];
    if (n.includes('agar')) return ['Agar-agar'];
    if (n.includes('pectina')) return ['Pectina'];
    return [];
  };

  const pairingByCategory = (cat) => {
    if (cat === 'Texturización') return ['Texturizantes', 'Cítricos', 'Lácteos', 'Umami'];
    if (cat === 'Térmica') return ['Tostados', 'Ahumados', 'Vegetales', 'Marinos'];
    if (cat === 'Extracción') return ['Florales', 'Hierbas', 'Especias', 'Fermentados'];
    return ['Presentación', 'Florales', 'Cítricos', 'Dulces'];
  };

  return list.map((t, idx) => ({
    id: `tech-${pad(idx + 1, 2)}`,
    name: t.name,
    category: t.category,
    description: `Protocolo ${t.difficulty.toLowerCase()} para ${t.name}. Enfoque en repetibilidad y control.`,
    difficulty: t.difficulty,
    equipment: equipmentByCategory[t.category] || ['Utillaje base'],
    reagents: reagentsByName(t.name),
    pairing_notes: pairingByCategory(t.category)
  }));
}

function normalizeText(block) {
  return block
    .replace(/\r/g, ' ')
    .replace(/[ \t]+/g, ' ')
    .replace(/\s{3,}/g, ' ')
    .trim();
}

function buildParagraphBank() {
  const files = ['culinary_data_rich.txt', 'big_text.txt', 'extracted_data.txt'];
  const bank = [];

  for (const f of files) {
    const p = path.join(process.cwd(), f);
    if (!fs.existsSync(p)) continue;
    const raw = fs.readFileSync(p, 'utf8');
    const chunks = raw.split(/\n\s*\n/);
    for (const chunk of chunks) {
      const clean = normalizeText(chunk);
      const wc = clean.split(/\s+/).length;
      if (wc >= 40) bank.push(clean);
    }
  }

  if (bank.length < 200) {
    bank.push(
      'Control de servicio: cada pase debe salir con la misma temperatura, textura y brillo. Registra el peso final del plato, la temperatura en el centro y el tiempo que pasa en caliente.',
      'Estandariza el mise en place con bandejas etiquetadas, filmadas y con fecha. Usa rotación FIFO y pesa cada subreceta.',
      'Define un vocabulario sensorial común: ataque (primer aroma), centro (gusto dominante), final (persistencia), textura (boca) y temperatura.',
      'Cada iteración de prueba debe registrar lote, hora, operador, equipos usados, calibración y observaciones de control. Sin datos no hay mejora.',
      'Aplica ingeniería de menús: calcula escandallo, margen y tiempo de pase. Un plato excelente debe ser rentable y ejecutable en hora pico.',
      'Cuando una técnica falle, etiqueta el fallo (corte, sobrecocción, falta de gel) y vincúlalo a una causa física.'
    );
  }

  return bank;
}

async function buildCourses() {
  const limits = { FREE: 5, PRO: 10, PREMIUM: 15 };
  const produced = { FREE: 0, PRO: 0, PREMIUM: 0 };

  const paragraphBank = buildParagraphBank();
  let paragraphCursor = 0;
  const nextParagraph = () => {
    const p = paragraphBank[paragraphCursor % paragraphBank.length];
    paragraphCursor += 1;
    return p;
  };

  const scenarios = [
    'servicio de degustacion de 10 pasos en casa de campo con brasas',
    'menu de temporada km0 con trazabilidad absoluta de productor',
    'barra fria de crudos y curaciones al minuto',
    'pasteleria de restaurante con postres calientes al pase',
    'cocina vegetal de vanguardia con fermentos de larga maduracion',
    'robata y parrilla japonesa para volumen alto',
    'asados reversos con reposo controlado en horno mixto',
    'cocteleria gastronomica con mise en place isotermica',
    'banquete premium con emplatado simultaneo para 120 pax',
    'servicio brunch de hotel 5* con rotacion continua',
    'cocina nórdica moderna con ahumados suaves',
    'I+D de salsas madre estabilizadas para regenerar en sala',
    'omakase de mar y vegetales en barra caliente',
    'cena pop-up en viñedo con cocina móvil'
  ];

  const techniques = [
    'control de temperatura al core con sonda de aguja',
    'gelificacion mixta agar-pectina para napas brillantes',
    'emulsion caliente estabilizada con mantequilla noisette y miso rojo',
    'fermentacion lactica lenta aplicada a guarniciones crujientes',
    'ahumado en frio con serrin de manzano y secado intermedio',
    'reduccion triple para jugos con brillo espejo',
    'esferificacion inversa aplicada a caldos grasos',
    'texturizacion con sifon y lecitina de girasol',
    'plancha alta potencia con reposo en mantequilla clarificada',
    'regeneracion en ronner y final en salamandra de cuarzo',
    'coccion mixta vapor-seco con pre-secado controlado',
    'maduracion en seco de vegetales para concentracion de umami',
    'retrogradacion de almidon en cereales ancestrales',
    'equilibrio de grasas saturadas e insaturadas en emulsiones calientes'
  ];

  const dishes = [
    'rodaballo asado en hueso con pilpil aireado',
    'pato madurado al heno con demi glace de frutos rojos',
    'zanahoria fermentada y glaseada en mantequilla avellanada',
    'tartar de remolacha ahumada con praliné de semillas',
    'arroz meloso de alcachofas y salicornia',
    'ostras tibias en mantequilla noisette y vinagre de Jerez',
    'lomo alto a baja temperatura con crosta de koji',
    'merengue invertido de alubia blanca con praliné salado',
    'cremoso de calabaza asada y miso blanco',
    'consomé de jamón clarificado con aromáticos cítricos',
    'postre de chocolate 75% con toffee salado y helado de levadura',
    'parfait de foie y cacao ahumado',
    'mollete de brioche al vapor con panceta lacada',
    'caballa marinada con emulsión de yuzu kosho'
  ];

  const tiers = [
    { tier: 'FREE', moduleCount: 1, minWords: 2000 },
    { tier: 'PRO', moduleCount: 3, minWords: 9000 },
    { tier: 'PREMIUM', moduleCount: 5, minWords: 16000 }
  ];

  const topicsByTier = {
    FREE: [
      'Cuchillos y cortes de precisión para servicio rápido',
      'Fondos vegetales ultra claros y sazón exacta',
      'Marinadas base y emulsiones en frío',
      'Organización de partida y limpieza activa',
      'Tipos de cocción básica y escaldado perfecto'
    ],
    PRO: [
      'Asado inverso y reposo controlado en carnes rojas',
      'Fermentación de frutas para cocina salada',
      'Pastelería de pase caliente con mise en place isotérmica',
      'Robata y brasa japonesa aplicada a pescados grasos',
      'Texturas con hidrocoloides: agar y gellan',
      'Esferificación básica y control de pH',
      'Fondos oscuros de alta reducción y colágeno',
      'Curados en sal y azúcar para pescados',
      'Cocción al vacío (sous-vide) de vegetales de raíz',
      'Control de mermas y escandallos avanzados'
    ],
    PREMIUM: [
      'Narrativa gastronómica y arquitectura de menú degustación',
      'Proteínas nobles: texturas extremas y estabilidad al pase',
      'Salsas espejo: reducción triple y control de brillo',
      'Plating geométrico, altura y flujo de pase simultáneo',
      'Fermentos complejos y misos express de precisión',
      'Ingeniería de prebatch y logística de regeneración premium',
      'Auditoría sensorial, trazabilidad y consistencia de marca',
      'Postres de restaurante con control de agua y cristales',
      'Koji y aplicaciones en maduración prolongada de carnes',
      'Técnicas de extracción por ultrasonidos y liofilización',
      'Ahumados en frío y maderas seleccionadas para maridaje',
      'Cocina criogénica con nitrógeno líquido seguro',
      'Neurogastronomía y diseño de experiencias en sala',
      'Equilibrio de grasas y acidez en menús de 20 pases',
      'Desarrollo de concepto y pitch para inversores culinarios'
    ]
  };

  const categories = ['Técnicas', 'Ingredientes', 'Gestión', 'Creatividad'];
  const wordCount = (s) => String(s || '').trim().split(/\s+/).filter(Boolean).length;
  const targetWords = { FREE: 2000, PRO: 9000, PREMIUM: 16000 };

  const buildContinuousContent = async (tier, topic, scenario, tech, dish, offset) => {
    const cycleMs = 96 * 3600 * 1000;
    const generationCycleId = `cycle-${Math.floor(Date.now() / cycleMs)}`;
    const target = targetWords[tier];
    const prompt = [
      `Eres un redactor gastronómico editorial de nivel internacional especializado en cursos culinarios.`,
      `Corpus: alta cocina contemporánea, ciencia culinaria, foodpairing, eficiencia operativa y narrativa gastronómica creativa.`,
      `Objetivo: redactar un curso continuo profesional en español con exactamente estas secciones, en este orden y sin subdividir: 1 Introducción conceptual profunda; 2 Desarrollo técnico progresivo; 3 Aplicación práctica profesional; 4 Cierre estratégico creativo.`,
      `Prohibiciones: no módulos, no capítulos, no listas redundantes, no repetición de párrafos ni conceptos, no tono genérico, no estructura blog.`,
      `Regla absoluta: no menciones IA/AI, modelos, prompts, herramientas ni "como asistente".`,
      `Regla absoluta: no incluyas tiempo de lectura ni metadatos ajenos a la cocina.`,
      `Estilo: manual interno de escuela culinaria internacional, alta densidad técnica, elegancia narrativa, progresión cognitiva real.`,
      `Extensión objetivo aproximada: ${target} palabras para el plan ${tier}. No reutilices frases de libros ni de ningún contenido previo; todo debe ser original y distinto a cualquier curso anterior.`,
      `Contexto del curso: tema "${topic}", escenario "${scenario}", técnica eje "${tech}", plato ancla "${dish}".`,
      `Incluye escandallo, control de temperatura, seguridad alimentaria, trazabilidad, narrativa de marca y propuesta de iteración A/B.`,
      `Entrega solo el texto final con las cuatro secciones en párrafos continuos.`
    ].join('\n');

    const orKey = process.env.OPENROUTER_API_KEY;
    const groqKey1 = process.env.GROQ_API_KEY;
    const groqKey2 = process.env.GROQ_API_KEY_2;
    
    const getAiConfigs = () => {
      const configs = [];
      if (orKey) {
        configs.push({
          apiKey: orKey,
          baseURL: 'https://openrouter.ai/api/v1',
          headers: { 'HTTP-Referer': 'https://grandchefapp.online', 'X-Title': 'GrandChef Seeder' },
          model: process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.3-70b-instruct',
          name: 'OpenRouter'
        });
      }
      if (groqKey1) {
        configs.push({
          apiKey: groqKey1,
          baseURL: 'https://api.groq.com/openai/v1',
          model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
          name: 'Groq-1'
        });
      }
      if (groqKey2) {
        configs.push({
          apiKey: groqKey2,
          baseURL: 'https://api.groq.com/openai/v1',
          model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
          name: 'Groq-2'
        });
      }
      return configs;
    };

    const aiConfigs = getAiConfigs();
    if (aiConfigs.length === 0) throw new Error('No AI Provider (OpenRouter/Groq) configured in .env.local');

    let content = null;
    let success = false;

    for (const config of aiConfigs) {
      try {
        console.log(`[buildContinuousContent] Attempting with ${config.name} (${config.model}) for ${tier}...`);
        const client = new OpenAI({
          apiKey: config.apiKey,
          baseURL: config.baseURL,
          defaultHeaders: config.headers || {}
        });

        const completion = await client.chat.completions.create({
          model: config.model,
          messages: [
            { role: 'system', content: 'Eres el RedactorMaestro de GrandChef Lab: redacción editorial gastronómica de nivel internacional, precisión técnica y estilo de escuela culinaria.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7
        });
        content = completion.choices[0].message?.content;
        if (content) {
          success = true;
          break;
        }
      } catch (e) {
        console.warn(`[buildContinuousContent] ${config.name} failed: ${e.message}`);
      }
    }

    if (!success || !content) throw new Error('Generación fallida: todos los proveedores de AI fallaron.');
    return { content, generationCycleId };
  };

  const expandToMinWords = (tierObj, modules) => {
    const minWords = tierObj.minWords;
    let total = modules.reduce((acc, m) => acc + wordCount(m.content), 0);
    if (total >= minWords) return modules;

    const enrichers = [
      'Caso de servicio: pase completo con 40 cubiertos en 30 minutos. Mide tiempo en pasaplatos, estabilidad de salsa y consistencia de sal.',
      'Microcaso: la salsa se corta en minuto 12. Acción: bajar a 50C, emulsionar con agua helada en hilo y corregir con lecitina 0.2%.',
      'Auditoría sensorial: panel interno puntúa ataque, centro, final, textura y temperatura. Registrar en hoja de control.',
      'Plantilla de control: lote, fecha, operador, equipo, calibración, tiempos, temperatura core, observaciones y acción correctiva.'
    ];

    const last = modules[modules.length - 1];
    let guard = 0;
    while (total < minWords) {
      last.content += `\n\n${enrichers[guard % enrichers.length]}\n\n${nextParagraph()}`;
      total = modules.reduce((acc, m) => acc + wordCount(m.content), 0);
      guard++;
      if (guard > 800) break;
    }
    return modules;
  };

  const courses = [];
  const tiersList = ['FREE', 'PRO', 'PREMIUM'];
  for (const tierKey of tiersList) {
    const tierObj = tiers.find((t) => t.tier === tierKey);
    const topics = topicsByTier[tierKey];
    for (let idx = 0; idx < topics.length; idx++) {
      if (produced[tierKey] >= limits[tierKey]) break;
      const topic = topics[idx];
      const scenario = scenarios[(idx + topic.length) % scenarios.length];
      const tech = techniques[(idx + tierKey.length) % techniques.length];
      const dish = dishes[(idx * 2 + topic.length) % dishes.length];
      const { content: generated, generationCycleId } = await buildContinuousContent(
        tierKey,
        topic,
        scenario,
        tech,
        dish,
        produced[tierKey]
      );

      // Asegurar longitud mínima
      let baseContent = generated;
      const minWords = targetWords[tierKey];
      while (wordCount(baseContent) < minWords) {
        baseContent += '\n\n' + nextParagraph();
      }

      const modules = [{
        id: `c${tierKey}-${idx + 1}-full`,
        title: `Curso completo: ${topic}`,
        content: baseContent
      }];

      expandToMinWords(tierObj, modules);
      const totalWords = modules.reduce((acc, m) => acc + wordCount(m.content), 0);
      courses.push({
        title: `${tierKey} · ${topic}`,
        description:
          tierKey === 'FREE'
            ? `Ruta esencial: ${topic}. Repetibilidad y control básico.`
            : tierKey === 'PRO'
              ? `Clinic PRO: ${topic}. Protocolos, costes y recuperación de fallos.`
              : `Master Premium: ${topic}. Laboratorio aplicado, pruebas A/B y narrativa de marca.`,
        instructor: 'Grand Chef',
        category: categories[idx % categories.length],
        tier: tierKey,
        days_required: produced[tierKey] + 1,
        generation_cycle_id: generationCycleId,
        modules
      });
      produced[tierKey] += 1;
    }
  }

  return courses;
}

async function upsertAll(client, table, rows, options) {
  const chunkSize = 200;
  let done = 0;
  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunk = rows.slice(i, i + chunkSize);
    const res = await client.from(table).upsert(chunk, options);
    if (res.error) throw res.error;
    done += chunk.length;
  }
  return done;
}

function buildTestsForCourse(course, cid) {
  const text = (course.modules?.[0]?.content || '').replace(/\s+/g, ' ').trim();
  const sentences = text.split(/(?<=[.!?])\s+/).filter((s) => s.length > 20);
  const pick = (i) => sentences[i % sentences.length] || course.title || 'Tema introductorio';

  const questions = [];
  for (let i = 0; i < 5; i++) {
    const stem = pick(i) || 'Concepto base relativo al módulo';
    const correct = `Según el curso, ${stem.slice(0, 50)}`;
    const distractors = [
      'Implica ignorar el control de temperatura y sal.',
      'Consiste en servir sin prueba de pase ni escandallo.',
      'Se basa en usar ingredientes al azar sin trazabilidad.'
    ];
    questions.push({
      question: `P${i + 1}: ${course.title} — ${stem.slice(0, 140)}...`,
      options: [correct, ...distractors],
      correct_index: 0
    });
  }
  
  return {
    course_id: cid,
    questions: questions,
    pass_percentage: 60,
    unlock_price: 2.50,
    release_answers_at: new Date(Date.now() + 96 * 3600 * 1000).toISOString()
  };
}

async function main() {
  loadDotEnvLocal();
  
  const getSupa = (urlVar, keyVar) => {
    const url = process.env[urlVar] || process.env[`NEXT_PUBLIC_${urlVar}`];
    const key = process.env[keyVar] || process.env[`NEXT_PUBLIC_${keyVar}`] || process.env.SUPABASE_SERVICE_ROLE_KEY;
    console.log(`[getSupa] ${urlVar}: url=[${url ? url.slice(0, 30) : 'null'}] key=[${key ? key.slice(0, 20) : 'null'}]`);
    if (!url || !key) return null;
    try {
      return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
    } catch (e) {
      console.error(`[getSupa] Failed to create client for ${urlVar}:`, e.message);
      return null;
    }
  }

  const coreSupa = getSupa('SUPABASE_CORE_URL', 'SUPABASE_CORE_SERVICE_KEY') || getSupa('SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY');
  const coursesSupa = getSupa('SUPABASE_COURSES_URL', 'SUPABASE_COURSES_SERVICE_KEY') || coreSupa;
  const aiSupa = getSupa('SUPABASE_AI_URL', 'SUPABASE_AI_SERVICE_KEY') || getSupa('SUPABASE_AI_BRAIN_URL', 'SUPABASE_AI_BRAIN_SERVICE_KEY') || coreSupa;

  if (!coreSupa) throw new Error('No se pudo inicializar el cliente Supabase CORE.');

  const ingredients = buildIngredients();
  const techniques = buildTechniques();
  let courses;
  try {
    courses = await buildCourses();
  } catch (err) {
    console.error('[buildCourses] crashed:', err);
    throw err;
  }

  console.log(`Seeding:
    - AI_BRAIN: ingredients=${ingredients.length}, techniques=${techniques.length}
    - COURSES: courses=${courses.length}`);

  // Seeding AI_BRAIN
  if (aiSupa) {
    await upsertAll(aiSupa, 'ingredients', ingredients, { onConflict: 'id' });
    console.log('Seed ingredients: OK (AI_BRAIN)');
    await upsertAll(aiSupa, 'techniques', techniques, { onConflict: 'id' });
    console.log('Seed techniques: OK (AI_BRAIN)');
  }

  // Seeding COURSES
  if (coursesSupa) {
    await coursesSupa.from('courses').delete().neq('tier', '');
    await upsertAll(coursesSupa, 'courses', courses, { onConflict: 'tier,days_required' });
    console.log('Seed courses: OK (COURSES)');

    // Attach tests
    const { data: storedCourses, error: fetchErr } = await coursesSupa.from('courses').select('id,title').order('created_at', { ascending: false }).limit(courses.length);
    if (fetchErr) throw fetchErr;
    const idByTitle = new Map((storedCourses || []).map((c) => [c.title, c.id]));

    const tests = [];
    for (const c of courses) {
      const cid = idByTitle.get(c.title);
      if (!cid) continue;
      const testObj = buildTestsForCourse(c, cid);
      tests.push(testObj);
    }

    if (tests.length > 0) {
      await coursesSupa.from('course_tests').delete().neq('course_id', null);
      const chunk = 200;
      for (let i = 0; i < tests.length; i += chunk) {
        const slice = tests.slice(i, i + chunk);
        const res = await coursesSupa.from('course_tests').insert(slice);
        if (res.error) throw res.error;
      }
      console.log(`Seed course_tests: OK (${tests.length} preguntas en COURSES)`);
    }
  }

  console.log('Seeding process completed.');
}

main().catch(console.error);
main().catch((e) => {
  console.error('Seed failed:', e?.message || e);
  process.exit(1);
});


