export type RecipeTier = 'FREE' | 'PRO' | 'PREMIUM';

export interface RecipeIngredient {
  name: string;
  amount: number;
  unit: 'g' | 'ml' | 'ud' | 'cda' | 'cdta';
  notes?: string;
}

export interface RecipeTimes {
  prepMin: number;
  cookMin: number;
  restMin?: number;
}

export interface Recipe {
  id: string;
  title: string;
  source: string;
  tier: RecipeTier;
  difficulty: 'Basico' | 'Intermedio' | 'Avanzado' | 'Maestro';
  servings: number;
  times: RecipeTimes;
  description: string;
  utensils: string[];
  ingredients: RecipeIngredient[];
  steps: string[];
  techniques: string[]; // technique ids (src/data/techniques.ts)
  tags: string[];
}

function totalMin(t: RecipeTimes) {
  return t.prepMin + t.cookMin + (t.restMin || 0);
}

function splitSentences(step: string) {
  return String(step || '')
    .replace(/\r/g, '')
    // Avoid regex lookbehind for broader browser compatibility.
    .split(/(?:[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function stepNotes(step: string, r: Recipe) {
  const s = step.toLowerCase();

  const notes: string[] = [];

  if (/\bemulsion|emulsionar|vinagreta|mayonesa\b/i.test(step)) {
    notes.push('Control: incorpora el aceite en hilo y mantén cizalla constante; si se corta, añade 1-2 cdas de agua y re-emulsiona poco a poco.');
  }
  if (/\bcaramel|caramelizar\b/i.test(step)) {
    notes.push('Control: trabaja con calor medio y observa el color; detén el punto con la fase líquida caliente para evitar amargor por exceso.');
  }
  if (/\bhorno\b/i.test(step) || r.utensils.some((u) => /horno/i.test(u))) {
    notes.push('Control: precalienta y no abras el horno en los primeros minutos salvo necesidad; la estabilidad térmica define el resultado.');
  }
  if (/\bterm[oó]metro\b/i.test(step) || r.utensils.some((u) => /term[oó]metro/i.test(u))) {
    notes.push('Control: usa termómetro cuando sea posible; mide en el punto más representativo (core) y evita tocar metal del recipiente.');
  }
  if (/\breposar|reposo\b/i.test(step) || r.times.restMin) {
    notes.push('Control: el reposo no es “esperar”: estabiliza temperatura, textura y jugos; cúbrelo para evitar costra si procede.');
  }
  if (/\bcol(ar|ado)|filtr(ar|ado)\b/i.test(step)) {
    notes.push('Control: filtra sin presionar en exceso si buscas claridad; presionar aporta turbidez y amargores.');
  }
  if (/\bsazon|sal|acidez|ajust\b/i.test(step)) {
    notes.push('Control: ajusta en dos fases (a mitad y al final) para no pasarte; prueba con cucharilla limpia y corrige micro-dosis.');
  }
  if (/\bhuevo\b/i.test(step) || r.ingredients.some((i) => /huevo/i.test(i.name))) {
    notes.push('Seguridad: evita contaminaciones cruzadas; limpia superficies y manos tras manipular huevo y respeta tiempos/temperatura.');
  }

  // Generic safety/consistency note for longer recipes
  if (s.length > 0) {
    notes.push('Punto crítico: trabaja limpio, pesa, y evita improvisar ratios en caliente; corrige de forma incremental y documenta el ajuste si repites la receta.');
  }

  return notes;
}

export function recipeDetailedSteps(r: Recipe) {
  const steps: string[] = [];

  steps.push('Lee la receta completa antes de empezar. Define el objetivo: textura final, intensidad y temperatura de servicio.');
  steps.push(`Mise en place: pesa ingredientes, prepara utensilios (${r.utensils.join(', ')}), y deja a mano sal, ácido y un paño limpio.`);

  if (r.times.prepMin > 0) {
    steps.push(`Planifica: reserva ~${r.times.prepMin} min para preparación. Trabaja ordenado: primero cortes/limpiezas, luego mezclas, y al final ajustes.`);
  }
  if (r.times.cookMin > 0) {
    steps.push(`Planifica: reserva ~${r.times.cookMin} min de cocción efectiva. Calienta el equipo con antelación para no forzar el proceso al final.`);
  }
  if (r.times.restMin) {
    steps.push(`Planifica: incluye ~${r.times.restMin} min de reposo/estabilización. No lo elimines: suele ser donde se “cierra” la textura.`);
  }

  for (const base of r.steps) {
    const parts = splitSentences(base);
    if (parts.length === 0) continue;
    for (const p of parts) steps.push(p);

    const notes = stepNotes(base, r);
    for (const n of notes) steps.push(n);
  }

  steps.push('Control final: prueba, ajusta sal/acidez y revisa textura. Si falta impacto, corrige con micro-ajustes, no con golpes grandes.');
  steps.push('Servicio: sirve a la temperatura prevista, limpia bordes, y define un contraste (crujiente/fresco/ácido) si el plato lo pide.');
  steps.push('Si guardas: enfría rápido, tapa y etiqueta. Recalienta con suavidad y vuelve a ajustar al pase.');

  return steps;
}

export const recipes: Recipe[] = [
  // ===== FREE (12) =====
  {
    id: 'free-01',
    title: 'Ensalada de citricos, menta y yogur',
    source: 'GrandChef Lab - Recetario',
    tier: 'FREE',
    difficulty: 'Basico',
    servings: 2,
    times: { prepMin: 12, cookMin: 0 },
    description: 'Receta sencilla para entrenar balance acido-dulce y frescor herbal.',
    utensils: ['Cuchillo', 'Tabla', 'Bol', 'Rallador fino'],
    ingredients: [
      { name: 'Naranja', amount: 220, unit: 'g', notes: 'pelada a vivo' },
      { name: 'Pomelo', amount: 180, unit: 'g', notes: 'pelado a vivo' },
      { name: 'Yogur', amount: 140, unit: 'g' },
      { name: 'Miel', amount: 10, unit: 'g' },
      { name: 'Menta', amount: 6, unit: 'g', notes: 'hojas' },
      { name: 'Limon', amount: 5, unit: 'g', notes: 'ralladura' },
      { name: 'Sal marina', amount: 2, unit: 'g' },
    ],
    steps: [
      'Pelar los citricos a vivo y cortar los gajos. Reservar el jugo que suelten.',
      'Mezclar yogur, miel, sal y ralladura de limon hasta obtener una crema lisa.',
      'Montar los citricos en un bol, anadir el jugo reservado y terminar con menta.',
      'Servir con la crema de yogur al lado o en base. Ajustar acidez con mas ralladura.'
    ],
    techniques: [],
    tags: ['citricos', 'fresco', 'rapido']
  },
  {
    id: 'free-02',
    title: 'Huevo a 63C con mantequilla noisette y sesamo',
    source: 'GrandChef Lab - Recetario',
    tier: 'FREE',
    difficulty: 'Intermedio',
    servings: 1,
    times: { prepMin: 5, cookMin: 60 },
    description: 'Control de tiempo/temperatura y acabado graso-tostado.',
    utensils: ['Cazo', 'Termometro', 'Bol con agua y hielo', 'Cuchara'],
    ingredients: [
      { name: 'Huevo', amount: 1, unit: 'ud' },
      { name: 'Mantequilla', amount: 20, unit: 'g' },
      { name: 'Sesamo tostado', amount: 4, unit: 'g' },
      { name: 'Sal marina', amount: 2, unit: 'g' },
      { name: 'Pimienta negra', amount: 1, unit: 'g' }
    ],
    steps: [
      'Mantener un bano a 63C estable. Cocer el huevo 60 minutos.',
      'Enfriar 1 minuto en agua con hielo para poder cascar sin sobrecocinar.',
      'Dorar la mantequilla hasta noisette (avellana).',
      'Servir el huevo, sazonar y terminar con noisette y sesamo tostado.'
    ],
    techniques: ['t3'],
    tags: ['termica', 'huevo', 'precision']
  },
  {
    id: 'free-03',
    title: 'Crema ligera de calabaza y tomillo',
    source: 'GrandChef Lab - Recetario',
    tier: 'FREE',
    difficulty: 'Basico',
    servings: 3,
    times: { prepMin: 10, cookMin: 25 },
    description: 'Base de crema. Aprende sazonado, textura y final herbal.',
    utensils: ['Cazo', 'Batidora', 'Colador fino'],
    ingredients: [
      { name: 'Calabaza', amount: 600, unit: 'g' },
      { name: 'Puerro', amount: 120, unit: 'g' },
      { name: 'Mantequilla', amount: 25, unit: 'g' },
      { name: 'Sal marina', amount: 6, unit: 'g' },
      { name: 'Tomillo', amount: 3, unit: 'g' },
      { name: 'Agua', amount: 700, unit: 'ml' },
    ],
    steps: [
      'Sudar puerro en mantequilla sin color.',
      'Anadir calabaza, sal y agua. Cocer 20-25 minutos hasta muy tierna.',
      'Triturar fino y colar. Ajustar densidad con agua.',
      'Perfumar con tomillo al final 2 minutos y servir.'
    ],
    techniques: [],
    tags: ['crema', 'vegetal', 'base']
  },
  {
    id: 'free-04',
    title: 'Vinagreta de miso y limon',
    source: 'GrandChef Lab - Recetario',
    tier: 'FREE',
    difficulty: 'Basico',
    servings: 4,
    times: { prepMin: 8, cookMin: 0 },
    description: 'Emulsion sencilla para ensaladas, pescados o verduras.',
    utensils: ['Bol', 'Varilla', 'Cuchara medidora'],
    ingredients: [
      { name: 'Miso', amount: 30, unit: 'g' },
      { name: 'Limon', amount: 25, unit: 'ml', notes: 'zumo' },
      { name: 'Aceite de oliva', amount: 60, unit: 'ml' },
      { name: 'Miel', amount: 8, unit: 'g' },
      { name: 'Agua', amount: 20, unit: 'ml' },
    ],
    steps: [
      'Mezclar miso, miel, limon y agua.',
      'Emulsionar incorporando el aceite en hilo.',
      'Ajustar con mas agua si se quiere mas ligera.'
    ],
    techniques: ['t5'],
    tags: ['emulsion', 'umami', 'rapido']
  },
  {
    id: 'free-05',
    title: 'Aire de citricos (demo)',
    source: 'GrandChef Lab - Recetario',
    tier: 'FREE',
    difficulty: 'Intermedio',
    servings: 2,
    times: { prepMin: 10, cookMin: 0 },
    description: 'Introduccion a espumas con lecitina (version de entrenamiento).',
    utensils: ['Vaso alto', 'Batidora de inmersion', 'Cuchara'],
    ingredients: [
      { name: 'Limon', amount: 60, unit: 'ml', notes: 'zumo' },
      { name: 'Agua', amount: 140, unit: 'ml' },
      { name: 'Lecitina de soja', amount: 2, unit: 'g' },
      { name: 'Sal marina', amount: 1, unit: 'g' },
    ],
    steps: [
      'Mezclar zumo, agua, sal y lecitina en vaso alto.',
      'Inclinar el vaso y batir en superficie para incorporar aire.',
      'Recoger la espuma estable con cuchara y servir de inmediato.'
    ],
    techniques: ['t2'],
    tags: ['texturizacion', 'espuma', 'citricos']
  },
  {
    id: 'free-06',
    title: 'Setas salteadas con ajo negro y soja',
    source: 'GrandChef Lab - Recetario',
    tier: 'FREE',
    difficulty: 'Basico',
    servings: 2,
    times: { prepMin: 8, cookMin: 10 },
    description: 'Umami rapido y glaseado sencillo.',
    utensils: ['Sarten', 'Espatula', 'Cuchillo'],
    ingredients: [
      { name: 'Shiitake', amount: 240, unit: 'g' },
      { name: 'Ajo negro', amount: 10, unit: 'g' },
      { name: 'Salsa de soja', amount: 18, unit: 'ml' },
      { name: 'Aceite de oliva', amount: 10, unit: 'ml' },
    ],
    steps: [
      'Calentar sarten fuerte, saltear setas con aceite hasta dorar.',
      'Anadir ajo negro aplastado y desleir con soja.',
      'Reducir 30-60 s hasta glasear. Servir.'
    ],
    techniques: [],
    tags: ['umami', 'rapido', 'sarten']
  },
  {
    id: 'free-07',
    title: 'Pescado blanco con aceite de naranja',
    source: 'GrandChef Lab - Recetario',
    tier: 'FREE',
    difficulty: 'Intermedio',
    servings: 2,
    times: { prepMin: 10, cookMin: 12 },
    description: 'Coccion suave y salsa de citricos.',
    utensils: ['Sarten', 'Cazo pequeno', 'Cuchara'],
    ingredients: [
      { name: 'Pescado blanco', amount: 300, unit: 'g' },
      { name: 'Naranja', amount: 40, unit: 'ml', notes: 'zumo' },
      { name: 'Aceite de oliva', amount: 25, unit: 'ml' },
      { name: 'Sal marina', amount: 4, unit: 'g' },
    ],
    steps: [
      'Sazonar el pescado.',
      'Cocinar en sarten a fuego medio-bajo hasta punto.',
      'Reducir el zumo de naranja 1-2 min y emulsionar con aceite fuera del fuego.',
      'Napado final y servir.'
    ],
    techniques: [],
    tags: ['pescado', 'citricos', 'salsa']
  },
  {
    id: 'free-08',
    title: 'Verduras al horno con romero y miel',
    source: 'GrandChef Lab - Recetario',
    tier: 'FREE',
    difficulty: 'Basico',
    servings: 3,
    times: { prepMin: 12, cookMin: 30 },
    description: 'Textura por horneado y glaseado sencillo.',
    utensils: ['Horno', 'Bandeja', 'Bol'],
    ingredients: [
      { name: 'Zanahoria', amount: 300, unit: 'g' },
      { name: 'Remolacha', amount: 300, unit: 'g' },
      { name: 'Aceite de oliva', amount: 20, unit: 'ml' },
      { name: 'Miel', amount: 12, unit: 'g' },
      { name: 'Romero', amount: 3, unit: 'g' },
      { name: 'Sal marina', amount: 6, unit: 'g' },
    ],
    steps: [
      'Cortar verduras en piezas similares. Mezclar con aceite y sal.',
      'Hornear a 200C 25-30 min.',
      'Glasear con miel y romero 2 min mas. Servir.'
    ],
    techniques: [],
    tags: ['horno', 'vegetal', 'glaseado']
  },
  {
    id: 'free-09',
    title: 'Arroz basico con kombu (umami)',
    source: 'GrandChef Lab - Recetario',
    tier: 'FREE',
    difficulty: 'Basico',
    servings: 2,
    times: { prepMin: 5, cookMin: 18, restMin: 10 },
    description: 'Aprende infusion umami y reposo.',
    utensils: ['Cazo con tapa', 'Colador'],
    ingredients: [
      { name: 'Arroz', amount: 180, unit: 'g' },
      { name: 'Agua', amount: 270, unit: 'ml' },
      { name: 'Kombu', amount: 4, unit: 'g' },
      { name: 'Sal marina', amount: 2, unit: 'g' },
    ],
    steps: [
      'Lavar arroz hasta que el agua salga clara.',
      'Cocer con agua, kombu y sal 12-15 min tapado.',
      'Reposar 10 min. Retirar kombu y airear el arroz.'
    ],
    techniques: [],
    tags: ['arroz', 'umami', 'base']
  },
  {
    id: 'free-10',
    title: 'Tostada de cacao, miel y naranja (postre rapido)',
    source: 'GrandChef Lab - Recetario',
    tier: 'FREE',
    difficulty: 'Basico',
    servings: 2,
    times: { prepMin: 8, cookMin: 2 },
    description: 'Contraste tostado-dulce-acido en 10 minutos.',
    utensils: ['Tostadora', 'Rallador fino', 'Cuchillo'],
    ingredients: [
      { name: 'Pan tostado', amount: 2, unit: 'ud' },
      { name: 'Miel', amount: 18, unit: 'g' },
      { name: 'Cacao', amount: 6, unit: 'g' },
      { name: 'Naranja', amount: 6, unit: 'g', notes: 'ralladura' },
    ],
    steps: [
      'Tostar pan.',
      'Aplicar miel, espolvorear cacao y terminar con ralladura de naranja.'
    ],
    techniques: [],
    tags: ['postre', 'rapido', 'tostado']
  },
  {
    id: 'free-11',
    title: 'Encurtido rapido de pepino y lima',
    source: 'GrandChef Lab - Recetario',
    tier: 'FREE',
    difficulty: 'Basico',
    servings: 3,
    times: { prepMin: 10, cookMin: 0, restMin: 20 },
    description: 'Aprende osmosis y balance acido-dulce.',
    utensils: ['Bol', 'Cuchillo', 'Cuchara'],
    ingredients: [
      { name: 'Pepino', amount: 280, unit: 'g' },
      { name: 'Lima', amount: 25, unit: 'ml', notes: 'zumo' },
      { name: 'Azucar', amount: 10, unit: 'g' },
      { name: 'Sal marina', amount: 5, unit: 'g' },
    ],
    steps: [
      'Cortar pepino fino.',
      'Mezclar con lima, azucar y sal.',
      'Reposar 20 min, escurrir ligeramente y servir.'
    ],
    techniques: [],
    tags: ['encurtido', 'rapido', 'acido']
  },
  {
    id: 'free-12',
    title: 'Crema de chocolate blanco y lavanda (vasito)',
    source: 'GrandChef Lab - Recetario',
    tier: 'FREE',
    difficulty: 'Intermedio',
    servings: 3,
    times: { prepMin: 10, cookMin: 5, restMin: 60 },
    description: 'Postre base con infusion floral.',
    utensils: ['Cazo', 'Varilla', 'Vasos', 'Nevera'],
    ingredients: [
      { name: 'Nata', amount: 200, unit: 'ml' },
      { name: 'Chocolate blanco', amount: 120, unit: 'g' },
      { name: 'Lavanda', amount: 1, unit: 'g' },
      { name: 'Sal marina', amount: 1, unit: 'g' },
    ],
    steps: [
      'Calentar nata y perfumar con lavanda 2-3 min sin hervir. Colar.',
      'Fundir chocolate blanco y emulsionar con la nata caliente.',
      'Envasar en vasos y reposar en frio 1 h.'
    ],
    techniques: [],
    tags: ['postre', 'floral', 'crema']
  },

  // ===== PRO (12) =====
  {
    id: 'pro-01',
    title: 'Esferas de soja con caldo umami (esferificacion basica)',
    source: 'GrandChef Lab - Recetario',
    tier: 'PRO',
    difficulty: 'Intermedio',
    servings: 4,
    times: { prepMin: 25, cookMin: 10 },
    description: 'Tecnica de esferificacion aplicada a un caldo ligero.',
    utensils: ['Bascula de precision', 'Batidora de inmersion', 'Cucharas medidoras', 'Bol', 'Colador fino'],
    ingredients: [
      { name: 'Salsa de soja', amount: 120, unit: 'ml' },
      { name: 'Agua', amount: 280, unit: 'ml' },
      { name: 'Alginato de sodio', amount: 3, unit: 'g' },
      { name: 'Calcio', amount: 6, unit: 'g', notes: 'bano (lactato o cloruro)' },
      { name: 'Kombu', amount: 3, unit: 'g' },
      { name: 'Shiitake', amount: 20, unit: 'g' },
    ],
    steps: [
      'Preparar caldo: infusionar kombu y shiitake en agua caliente 10 min y colar. Mezclar con soja.',
      'Triturar el liquido con alginato 2 min y reposar 10 min para eliminar burbujas.',
      'Preparar bano de calcio en agua.',
      'Dosificar con cuchara y formar esferas 45-60 s. Enjuagar en agua limpia.',
      'Servir las esferas en el caldo templado.'
    ],
    techniques: ['t1'],
    tags: ['esferificacion', 'umami', 'tecnica']
  },
  {
    id: 'pro-02',
    title: 'Aire de yuzu sobre pescado blanco',
    source: 'GrandChef Lab - Recetario',
    tier: 'PRO',
    difficulty: 'Intermedio',
    servings: 2,
    times: { prepMin: 20, cookMin: 12 },
    description: 'Aplicacion de aire estable con final citrico.',
    utensils: ['Vaso alto', 'Batidora de inmersion', 'Sarten', 'Cuchara'],
    ingredients: [
      { name: 'Pescado blanco', amount: 320, unit: 'g' },
      { name: 'Yuzu', amount: 40, unit: 'ml', notes: 'zumo' },
      { name: 'Agua', amount: 140, unit: 'ml' },
      { name: 'Lecitina de soja', amount: 2, unit: 'g' },
      { name: 'Sal marina', amount: 4, unit: 'g' },
      { name: 'Aceite de oliva', amount: 10, unit: 'ml' }
    ],
    steps: [
      'Cocinar el pescado en sarten con aceite a fuego medio-bajo.',
      'Mezclar yuzu, agua, sal y lecitina. Batir en superficie hasta formar aire estable.',
      'Servir el pescado y terminar con el aire de yuzu.'
    ],
    techniques: ['t2'],
    tags: ['aire', 'citricos', 'pescado']
  },
  {
    id: 'pro-03',
    title: 'Gel de tomate con albahaca (agar) y aceite de oliva',
    source: 'GrandChef Lab - Recetario',
    tier: 'PRO',
    difficulty: 'Intermedio',
    servings: 4,
    times: { prepMin: 15, cookMin: 8, restMin: 45 },
    description: 'Gel firme y limpio. Practica hidratacion, ebullicion y cuajado de agar.',
    utensils: ['Cazo', 'Varilla', 'Molde', 'Nevera'],
    ingredients: [
      { name: 'Tomate', amount: 400, unit: 'g', notes: 'triturado y colado' },
      { name: 'Agar-agar', amount: 3, unit: 'g' },
      { name: 'Sal marina', amount: 4, unit: 'g' },
      { name: 'Aceite de oliva', amount: 20, unit: 'ml' },
      { name: 'Albahaca', amount: 6, unit: 'g' },
    ],
    steps: [
      'Mezclar tomate colado con agar y sal en frio.',
      'Llevar a ebullicion 45-60 s removiendo.',
      'Verter en molde y enfriar 45 min hasta cuajar.',
      'Cortar en cubos y terminar con aceite y albahaca.'
    ],
    techniques: ['t4'],
    tags: ['agar', 'gel', 'tomate']
  },
  {
    id: 'pro-04',
    title: 'Pollo sous-vide con glaseado de miso y miel',
    source: 'GrandChef Lab - Recetario',
    tier: 'PRO',
    difficulty: 'Intermedio',
    servings: 2,
    times: { prepMin: 15, cookMin: 90 },
    description: 'Coccion precisa y glaseado umami.',
    utensils: ['Ronner', 'Bolsa al vacio', 'Sarten', 'Cazo'],
    ingredients: [
      { name: 'Pollo', amount: 320, unit: 'g', notes: 'muslos deshuesados' },
      { name: 'Miso', amount: 30, unit: 'g' },
      { name: 'Miel', amount: 12, unit: 'g' },
      { name: 'Salsa de soja', amount: 10, unit: 'ml' },
      { name: 'Aceite de oliva', amount: 10, unit: 'ml' },
    ],
    steps: [
      'Mezclar miso, miel y soja para el glaseado.',
      'Cocinar pollo sous-vide 75C 90 min. Secar.',
      'Dorar en sarten y lacar con el glaseado 30-60 s.',
      'Reposar 2 min y servir.'
    ],
    techniques: ['t3'],
    tags: ['sous-vide', 'umami', 'glaseado']
  },
  {
    id: 'pro-05',
    title: 'Consome claro (clarificacion) con setas',
    source: 'GrandChef Lab - Recetario',
    tier: 'PRO',
    difficulty: 'Avanzado',
    servings: 4,
    times: { prepMin: 20, cookMin: 55 },
    description: 'Caldo limpio para entrenar tecnica de clarificacion y control de ebullicion.',
    utensils: ['Olla', 'Colador fino', 'Pano fino', 'Cazo'],
    ingredients: [
      { name: 'Caldo de pollo', amount: 1200, unit: 'ml' },
      { name: 'Claras de huevo', amount: 120, unit: 'g', notes: 'aprox 4 claras' },
      { name: 'Shiitake', amount: 120, unit: 'g' },
      { name: 'Sal marina', amount: 6, unit: 'g' },
    ],
    steps: [
      'Mezclar caldo frio con claras y setas picadas.',
      'Calentar suave sin remover hasta formar balsa.',
      'Mantener hervor minimo 35-40 min.',
      'Colar con cuidado y ajustar sal.'
    ],
    techniques: ['t14'],
    tags: ['caldo', 'clarificacion', 'umami']
  },
  {
    id: 'pro-06',
    title: 'Emulsion estable de citricos (vinagreta avanzada)',
    source: 'GrandChef Lab - Recetario',
    tier: 'PRO',
    difficulty: 'Intermedio',
    servings: 6,
    times: { prepMin: 12, cookMin: 0 },
    description: 'Emulsion mas estable y redonda para pescados y verduras.',
    utensils: ['Bol', 'Varilla', 'Rallador fino'],
    ingredients: [
      { name: 'Limon', amount: 30, unit: 'ml', notes: 'zumo' },
      { name: 'Naranja', amount: 30, unit: 'ml', notes: 'zumo' },
      { name: 'Aceite de oliva', amount: 80, unit: 'ml' },
      { name: 'Mostaza', amount: 1, unit: 'cda' },
      { name: 'Sal marina', amount: 4, unit: 'g' },
    ],
    steps: [
      'Mezclar citricos, mostaza y sal.',
      'Emulsionar con aceite en hilo hasta napar.',
      'Reposar 3 min y ajustar acidez.'
    ],
    techniques: ['t5'],
    tags: ['emulsion', 'citricos', 'salsa']
  },
  {
    id: 'pro-07',
    title: 'Pickles rapidos con balance dulce-acido',
    source: 'GrandChef Lab - Recetario',
    tier: 'PRO',
    difficulty: 'Intermedio',
    servings: 4,
    times: { prepMin: 15, cookMin: 5, restMin: 60 },
    description: 'Pickling con salmuera aromatica y reposo.',
    utensils: ['Cazo', 'Tarro', 'Cuchillo'],
    ingredients: [
      { name: 'Vinagre de arroz', amount: 180, unit: 'ml' },
      { name: 'Agua', amount: 180, unit: 'ml' },
      { name: 'Azucar', amount: 40, unit: 'g' },
      { name: 'Sal marina', amount: 12, unit: 'g' },
      { name: 'Pepino', amount: 220, unit: 'g' },
      { name: 'Zanahoria', amount: 180, unit: 'g' },
    ],
    steps: [
      'Hervir vinagre, agua, azucar y sal.',
      'Verter caliente sobre verduras cortadas.',
      'Enfriar y reposar 1 h minimo.'
    ],
    techniques: ['t19'],
    tags: ['encurtido', 'balance', 'acido']
  },
  {
    id: 'pro-08',
    title: 'Cremoso de chocolate negro y cafe (textura)',
    source: 'GrandChef Lab - Recetario',
    tier: 'PRO',
    difficulty: 'Intermedio',
    servings: 4,
    times: { prepMin: 15, cookMin: 8, restMin: 90 },
    description: 'Postre tecnico: emulsion y reposo para textura cremosa.',
    utensils: ['Cazo', 'Varilla', 'Bol', 'Nevera'],
    ingredients: [
      { name: 'Chocolate negro', amount: 180, unit: 'g' },
      { name: 'Nata', amount: 220, unit: 'ml' },
      { name: 'Cafe', amount: 20, unit: 'ml', notes: 'espresso' },
      { name: 'Sal marina', amount: 2, unit: 'g' },
    ],
    steps: [
      'Calentar nata y mezclar con cafe.',
      'Verter sobre chocolate y emulsionar con varilla.',
      'Reposar en frio 90 min antes de servir.'
    ],
    techniques: ['t5'],
    tags: ['postre', 'cafe', 'chocolate']
  },
  {
    id: 'pro-09',
    title: 'Deshidratado simple: chips de remolacha',
    source: 'GrandChef Lab - Recetario',
    tier: 'PRO',
    difficulty: 'Intermedio',
    servings: 3,
    times: { prepMin: 12, cookMin: 120 },
    description: 'Textura crujiente por deshidratacion controlada.',
    utensils: ['Horno', 'Bandeja', 'Mandolina (opcional)'],
    ingredients: [
      { name: 'Remolacha', amount: 320, unit: 'g' },
      { name: 'Sal marina', amount: 4, unit: 'g' },
      { name: 'Aceite de oliva', amount: 10, unit: 'ml' },
    ],
    steps: [
      'Cortar lamina fina, secar superficie.',
      'Pincelar con aceite y sal.',
      'Deshidratar a 90-100C 2 h (puerta entreabierta).'
    ],
    techniques: ['t17'],
    tags: ['crujiente', 'deshidratacion', 'vegetal']
  },
  {
    id: 'pro-10',
    title: 'Fermentacion rapida: col estilo chucrut (demo)',
    source: 'GrandChef Lab - Recetario',
    tier: 'PRO',
    difficulty: 'Avanzado',
    servings: 6,
    times: { prepMin: 20, cookMin: 0, restMin: 720 },
    description: 'Entrenamiento de salado y ambiente. Version corta de laboratorio.',
    utensils: ['Bol', 'Tarro', 'Peso'],
    ingredients: [
      { name: 'Col', amount: 800, unit: 'g' },
      { name: 'Sal marina', amount: 16, unit: 'g' },
      { name: 'Comino', amount: 2, unit: 'g' },
    ],
    steps: [
      'Cortar col, mezclar con sal y masajear hasta soltar liquido.',
      'Anadir comino, compactar en tarro y cubrir con su propio liquido.',
      'Fermentar 8-12 h a temperatura ambiente (demo). Refrigerar.'
    ],
    techniques: ['t15'],
    tags: ['fermentacion', 'salmuera', 'umami']
  },
  {
    id: 'pro-11',
    title: 'Ahumado en frio (aroma) sobre mantequilla',
    source: 'GrandChef Lab - Recetario',
    tier: 'PRO',
    difficulty: 'Avanzado',
    servings: 6,
    times: { prepMin: 10, cookMin: 0, restMin: 30 },
    description: 'Aromatizacion por humo sin calor (demo).',
    utensils: ['Campana (opcional)', 'Recipiente', 'Soplete (opcional)'],
    ingredients: [
      { name: 'Mantequilla', amount: 180, unit: 'g' },
      { name: 'Te lapsang', amount: 3, unit: 'g' },
    ],
    steps: [
      'Ahumar en frio con lapsang o virutas en recipiente cerrado 5-8 min.',
      'Reposar 30 min en frio para redondear aroma.'
    ],
    techniques: ['t16'],
    tags: ['ahumado', 'aroma', 'grasa']
  },
  {
    id: 'pro-12',
    title: 'Glaseado espejo (version de entrenamiento)',
    source: 'GrandChef Lab - Recetario',
    tier: 'PRO',
    difficulty: 'Avanzado',
    servings: 6,
    times: { prepMin: 25, cookMin: 10, restMin: 120 },
    description: 'Glaseado brillante para postres. Control de temperatura.',
    utensils: ['Cazo', 'Termometro', 'Colador fino'],
    ingredients: [
      { name: 'Azucar', amount: 180, unit: 'g' },
      { name: 'Agua', amount: 90, unit: 'ml' },
      { name: 'Nata', amount: 120, unit: 'ml' },
      { name: 'Gelatina', amount: 8, unit: 'g' },
      { name: 'Chocolate blanco', amount: 120, unit: 'g' },
    ],
    steps: [
      'Hidratar gelatina. Calentar agua y azucar, anadir nata.',
      'Fundir chocolate y emulsionar. Anadir gelatina fuera del fuego.',
      'Colar y reposar. Usar a 32-34C sobre pieza congelada.'
    ],
    techniques: ['t23'],
    tags: ['postre', 'glaseado', 'temperatura']
  },

  // ===== PREMIUM (12) =====
  {
    id: 'premium-01',
    title: 'Nitro-helado instantaneo de mango (laboratorio)',
    source: 'GrandChef Lab - Recetario',
    tier: 'PREMIUM',
    difficulty: 'Maestro',
    servings: 4,
    times: { prepMin: 15, cookMin: 5 },
    description: 'Criogenia aplicada: textura ultrafina con nitrogeno liquido.',
    utensils: ['Dewar (N2)', 'Guantes criogenicos', 'Espatula', 'Bol metal'],
    ingredients: [
      { name: 'Mango', amount: 500, unit: 'g' },
      { name: 'Nata', amount: 200, unit: 'ml' },
      { name: 'Azucar', amount: 60, unit: 'g' },
      { name: 'Sal marina', amount: 2, unit: 'g' },
    ],
    steps: [
      'Triturar mango con nata, azucar y sal hasta liso.',
      'Verter nitrogeno poco a poco mientras se mezcla hasta granizado fino.',
      'Trabajar con espatula para textura de helado y servir de inmediato.'
    ],
    techniques: ['t5'],
    tags: ['nitrogeno', 'helado', 'criogenia']
  },
  {
    id: 'premium-02',
    title: 'Gel laminado y montaje geometrico (plating)',
    source: 'GrandChef Lab - Recetario',
    tier: 'PREMIUM',
    difficulty: 'Avanzado',
    servings: 4,
    times: { prepMin: 25, cookMin: 10, restMin: 60 },
    description: 'Laminado de gel y corte limpio para presentacion de alta precision.',
    utensils: ['Cazo', 'Bandeja', 'Cuchillo fino', 'Regla (opcional)'],
    ingredients: [
      { name: 'Agua', amount: 400, unit: 'ml' },
      { name: 'Agar-agar', amount: 4, unit: 'g' },
      { name: 'Yuzu', amount: 25, unit: 'ml' },
      { name: 'Azucar', amount: 20, unit: 'g' },
    ],
    steps: [
      'Hervir agua con agar y azucar 60 s. Anadir yuzu fuera del fuego.',
      'Verter capa fina en bandeja y enfriar 1 h.',
      'Cortar laminas y montar en geometria sobre plato.'
    ],
    techniques: ['t28', 't24'],
    tags: ['laminado', 'plating', 'precision']
  },
  {
    id: 'premium-03',
    title: 'Menu: pescado + esferas + aire (composicion)',
    source: 'GrandChef Lab - Recetario',
    tier: 'PREMIUM',
    difficulty: 'Maestro',
    servings: 2,
    times: { prepMin: 45, cookMin: 20 },
    description: 'Composicion completa con multiples texturas: esferas, aire y salsa.',
    utensils: ['Bascula de precision', 'Batidora', 'Sarten', 'Bol', 'Colador fino'],
    ingredients: [
      { name: 'Pescado blanco', amount: 320, unit: 'g' },
      { name: 'Salsa de soja', amount: 90, unit: 'ml' },
      { name: 'Agua', amount: 210, unit: 'ml' },
      { name: 'Alginato de sodio', amount: 3, unit: 'g' },
      { name: 'Calcio', amount: 6, unit: 'g' },
      { name: 'Lecitina de soja', amount: 2, unit: 'g' },
      { name: 'Limon', amount: 30, unit: 'ml', notes: 'zumo' },
      { name: 'Aceite de oliva', amount: 15, unit: 'ml' },
      { name: 'Sal marina', amount: 4, unit: 'g' },
    ],
    steps: [
      'Preparar base de esferas (soja+agua+alginato) y reposar. Preparar bano de calcio.',
      'Cocinar pescado al punto y mantener caliente.',
      'Formar esferas y enjuagar.',
      'Preparar aire de limon con lecitina.',
      'Emplatar: pescado, esferas, aire y aceite final.'
    ],
    techniques: ['t1', 't2'],
    tags: ['composicion', 'texturas', 'premium']
  },
  {
    id: 'premium-04',
    title: 'Fermentacion controlada: koji (aplicacion demo)',
    source: 'GrandChef Lab - Recetario',
    tier: 'PREMIUM',
    difficulty: 'Maestro',
    servings: 6,
    times: { prepMin: 30, cookMin: 0, restMin: 1440 },
    description: 'Aplicacion de fermentacion enzimntica (demo) para umami y profundidad.',
    utensils: ['Recipiente', 'Termometro', 'Guantes', 'Nevera'],
    ingredients: [
      { name: 'Koji', amount: 60, unit: 'g' },
      { name: 'Sal marina', amount: 10, unit: 'g' },
      { name: 'Agua', amount: 200, unit: 'ml' },
    ],
    steps: [
      'Mezclar koji con agua y sal para base.',
      'Reposar en frio 24 h (demo) y colar.',
      'Usar como potenciador umami en salsas o marinados.'
    ],
    techniques: ['t15'],
    tags: ['koji', 'fermentacion', 'umami']
  },
  {
    id: 'premium-05',
    title: 'Liofilizacion (concepto) y crujiente extremo',
    source: 'GrandChef Lab - Recetario',
    tier: 'PREMIUM',
    difficulty: 'Avanzado',
    servings: 4,
    times: { prepMin: 20, cookMin: 180 },
    description: 'Entrenamiento de deshidratacion avanzada para textura crujiente.',
    utensils: ['Liofilizador (opcional)', 'Horno', 'Bandeja'],
    ingredients: [
      { name: 'Fresa', amount: 300, unit: 'g' },
      { name: 'Azucar', amount: 20, unit: 'g' },
    ],
    steps: [
      'Cortar fruta en piezas uniformes y espolvorear azucar.',
      'Secar en horno muy bajo o liofilizar (segun equipo).',
      'Guardar en recipiente hermetico.'
    ],
    techniques: ['t18'],
    tags: ['crujiente', 'avanzado', 'seco']
  },
  {
    id: 'premium-06',
    title: 'Ahumado en frio + mantequilla noisette (salsa)',
    source: 'GrandChef Lab - Recetario',
    tier: 'PREMIUM',
    difficulty: 'Avanzado',
    servings: 6,
    times: { prepMin: 15, cookMin: 8, restMin: 20 },
    description: 'Salsa grasa aromatizada por humo y tostado.',
    utensils: ['Cazo', 'Recipiente', 'Colador fino'],
    ingredients: [
      { name: 'Mantequilla', amount: 220, unit: 'g' },
      { name: 'Te lapsang', amount: 3, unit: 'g' },
      { name: 'Sal marina', amount: 2, unit: 'g' },
    ],
    steps: [
      'Hacer noisette con mantequilla.',
      'Ahumar en frio con lapsang en recipiente cerrado.',
      'Colar y ajustar sal.'
    ],
    techniques: ['t16'],
    tags: ['ahumado', 'noisette', 'salsa']
  },
  {
    id: 'premium-07',
    title: 'Destilacion aromatica (concepto) para citricos',
    source: 'GrandChef Lab - Recetario',
    tier: 'PREMIUM',
    difficulty: 'Maestro',
    servings: 6,
    times: { prepMin: 25, cookMin: 0, restMin: 60 },
    description: 'Extraccion aromatica limpia para uso en cocteleria o salsas.',
    utensils: ['Destilador (opcional)', 'Recipiente', 'Filtro'],
    ingredients: [
      { name: 'Limon', amount: 40, unit: 'g', notes: 'piel' },
      { name: 'Naranja', amount: 40, unit: 'g', notes: 'piel' },
      { name: 'Agua', amount: 500, unit: 'ml' },
    ],
    steps: [
      'Infusionar pieles en agua y destilar (si se dispone).',
      'Reposar 1 h y filtrar.',
      'Usar como base aromatica.'
    ],
    techniques: ['t12'],
    tags: ['destilacion', 'aroma', 'citricos']
  },
  {
    id: 'premium-08',
    title: 'Caramelo amargo con cafe y sal (postre)',
    source: 'GrandChef Lab - Recetario',
    tier: 'PREMIUM',
    difficulty: 'Avanzado',
    servings: 6,
    times: { prepMin: 20, cookMin: 15, restMin: 60 },
    description: 'Control de caramelizacion y amargor equilibrado.',
    utensils: ['Cazo', 'Termometro', 'Molde'],
    ingredients: [
      { name: 'Azucar', amount: 220, unit: 'g' },
      { name: 'Nata', amount: 180, unit: 'ml' },
      { name: 'Cafe', amount: 30, unit: 'ml', notes: 'espresso' },
      { name: 'Sal marina', amount: 3, unit: 'g' },
    ],
    steps: [
      'Caramelizar azucar hasta ambar oscuro.',
      'Anadir nata caliente con cuidado y remover.',
      'Incorporar cafe y sal. Verter en molde y reposar 1 h.'
    ],
    techniques: ['t9'],
    tags: ['caramelo', 'amargo', 'cafe']
  },
  {
    id: 'premium-09',
    title: 'Crispy por expansion (snack)',
    source: 'GrandChef Lab - Recetario',
    tier: 'PREMIUM',
    difficulty: 'Maestro',
    servings: 4,
    times: { prepMin: 20, cookMin: 25 },
    description: 'Textura extrema mediante expansion controlada (demo).',
    utensils: ['Horno', 'Sarten', 'Pinzas'],
    ingredients: [
      { name: 'Arroz', amount: 150, unit: 'g', notes: 'cocido y seco' },
      { name: 'Aceite de oliva', amount: 20, unit: 'ml' },
      { name: 'Sal marina', amount: 3, unit: 'g' },
    ],
    steps: [
      'Secar arroz cocido hasta muy bajo contenido de humedad.',
      'Freir rapido o hornear fuerte para expandir y crujir.',
      'Sazonar y servir.'
    ],
    techniques: ['t29'],
    tags: ['crujiente', 'snack', 'tecnica']
  },
  {
    id: 'premium-10',
    title: 'Plating geometrico: contraste (guia premium)',
    source: 'GrandChef Lab - Recetario',
    tier: 'PREMIUM',
    difficulty: 'Avanzado',
    servings: 2,
    times: { prepMin: 25, cookMin: 10 },
    description: 'Guia de montaje con foco en contraste y lectura visual.',
    utensils: ['Pinzas', 'Aro de emplatar', 'Biberon'],
    ingredients: [
      { name: 'Gel de tomate', amount: 120, unit: 'g' },
      { name: 'Aire de citricos', amount: 60, unit: 'g' },
      { name: 'Sal marina', amount: 2, unit: 'g' },
    ],
    steps: [
      'Definir geometria del plato y puntos de foco.',
      'Montar elementos en capas: base, contraste, final.',
      'Ajustar altura, brillo y huecos (espacio negativo).'
    ],
    techniques: ['t24'],
    tags: ['plating', 'geometria', 'premium']
  },
  {
    id: 'premium-11',
    title: 'Esferificacion + gelificacion combinada (lab)',
    source: 'GrandChef Lab - Recetario',
    tier: 'PREMIUM',
    difficulty: 'Maestro',
    servings: 4,
    times: { prepMin: 35, cookMin: 10, restMin: 30 },
    description: 'Combinacion de dos tecnicas para un bocado complejo.',
    utensils: ['Bascula de precision', 'Bol', 'Cazo', 'Colador'],
    ingredients: [
      { name: 'Salsa de soja', amount: 100, unit: 'ml' },
      { name: 'Alginato de sodio', amount: 3, unit: 'g' },
      { name: 'Calcio', amount: 6, unit: 'g' },
      { name: 'Agar-agar', amount: 3, unit: 'g' },
      { name: 'Agua', amount: 300, unit: 'ml' },
    ],
    steps: [
      'Preparar esferas de soja.',
      'Preparar gel neutro con agar y cortar en dados.',
      'Montar ambos con caldo templado para contraste de texturas.'
    ],
    techniques: ['t1', 't4'],
    tags: ['doble-tecnica', 'textura', 'lab']
  },
  {
    id: 'premium-12',
    title: 'Sistema de servicio: timing y consistencia (premium)',
    source: 'GrandChef Lab - Recetario',
    tier: 'PREMIUM',
    difficulty: 'Avanzado',
    servings: 10,
    times: { prepMin: 30, cookMin: 0 },
    description: 'Protocolo de mise en place y timing para ejecutar sin variacion.',
    utensils: ['Checklists', 'Etiquetas', 'Cronometro'],
    ingredients: [
      { name: 'Plan de servicio', amount: 1, unit: 'ud' },
      { name: 'Mise en place', amount: 1, unit: 'ud' },
    ],
    steps: [
      'Definir estaciones y responsabilidades.',
      'Establecer checkpoints de calidad por pase.',
      'Medir y ajustar tiempos reales para consistencia.'
    ],
    techniques: ['t22'],
    tags: ['gestion', 'servicio', 'premium']
  },
];

export function recipeTotalTimeLabel(r: Recipe) {
  const t = totalMin(r.times);
  const h = Math.floor(t / 60);
  const m = t % 60;
  if (h <= 0) return `${m} min`;
  return `${h} h ${m} min`;
}
