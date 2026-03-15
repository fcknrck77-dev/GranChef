export interface Technique {
  id: string;
  name: string;
  category: 'Texturización' | 'Térmica' | 'Extracción' | 'Presentación';
  description: string;
  difficulty: 'Básico' | 'Intermedio' | 'Avanzado' | 'Maestro';
  equipment: string[];
  reagents?: string[]; // Aditivos químicos
  pairingNotes: string[]; // Qué ingredientes suelen ir mejor con esta técnica
}

export const techniques: Technique[] = [
  {
    id: 't1',
    name: 'Esferificación Inversa',
    category: 'Texturización',
    description: 'Creación de esferas de centro líquido utilizando gluconolactato de calcio en el producto y un baño de alginato de sodio.',
    difficulty: 'Avanzado',
    equipment: ['Cucharas medidoras', 'Báscula de precisión', 'Baño de alginato'],
    reagents: ['Alginato de Sodio', 'Gluconolactato de Calcio'],
    pairingNotes: ['Líquidos con calcio', 'Lácteos', 'Alcoholes rectificados']
  },
  {
    id: 't2',
    name: 'Aires y Espumas',
    category: 'Texturización',
    description: 'Incorporación de burbujas de aire en un líquido para crear texturas etéreas mediante el uso de lecitina de soja.',
    difficulty: 'Básico',
    equipment: ['Batidora de inmersión', 'Sifón (opcional)'],
    reagents: ['Lecitina de Soja', 'Sucrem'],
    pairingNotes: ['Zumos cítricos', 'Infusiones', 'Caldos ligeros']
  },
  {
    id: 't3',
    name: 'Cocción al Vacío (Sous-Vide)',
    category: 'Térmica',
    description: 'Cocción a baja temperatura constante durante largos periodos, manteniendo los jugos y aromas integrales.',
    difficulty: 'Intermedio',
    equipment: ['Ronner', 'Envasadora al vacío'],
    reagents: [],
    pairingNotes: ['Carnes rojas', 'Pescados azules', 'Hortalizas de raíz']
  },
  {
    id: 't4',
    name: 'Gelificación con Agar-Agar',
    category: 'Texturización',
    description: 'Uso de polisacáridos de algas rojas para crear gelatinas calientes que no se funden a temperatura ambiente.',
    difficulty: 'Básico',
    equipment: ['Cazos', 'Moldes de silicona'],
    reagents: ['Agar-Agar'],
    pairingNotes: ['Frutas tropicales', 'Vinagres', 'Confituras']
  },
  {
    id: 't5',
    name: 'Nitro-Cocción',
    category: 'Térmica',
    description: 'Uso de nitrógeno líquido (-196°C) para congelaciones instantáneas que crean cristales de hielo imperceptibles.',
    difficulty: 'Maestro',
    equipment: ['Dewar de nitrógeno', 'Pinzas criogénicas', 'Gafas de seguridad'],
    reagents: ['Nitrógeno Líquido'],
    pairingNotes: ['Helados', 'Mousses de chocolate', 'Aceites infusionados']
  },
  {
    id: 't6',
    name: 'Deshidratación Osmótica',
    category: 'Extracción',
    description: 'Extracción de agua mediante presión osmótica (sal/azúcar) para concentrar sabores y cambiar texturas.',
    difficulty: 'Intermedio',
    equipment: ['Deshidratador', 'Cámaras de vacío'],
    reagents: ['Maltodextrina', 'Sal Maldon'],
    pairingNotes: ['Tomates', 'Setas', 'Frutas de hueso']
  },
  {
    id: 't7',
    name: 'Papel Comestible',
    category: 'Presentación',
    description: 'Creación de láminas ultra-finas y translúcidas a partir de purés ligadas con almidones modificados.',
    difficulty: 'Avanzado',
    equipment: ['Deshidratador', 'Silpat'],
    reagents: ['Kuzu', 'Almidón de patata'],
    pairingNotes: ['Crujientes decorativos', 'Wrap de vegetales']
  },
  {
    id: 't8',
    name: 'Clarificación Químico-Física',
    category: 'Extracción',
    description: 'Obtención de caldos cristalinos sin perder sabor mediante el uso de enzimas o congelación/descongelación (consomés gelificados).',
    difficulty: 'Intermedio',
    equipment: ['Filtros de café', 'Congelador'],
    reagents: ['Gelatina en láminas'],
    pairingNotes: ['Caldos de ave', 'Consomés complejos', 'Infusiones']
  },
  {
    id: 't9',
    name: 'Impregnación al Vacío',
    category: 'Texturización',
    description: 'Sustitución del aire intra-celular de un vegetal por un líquido aromatizado mediante ciclos de vacío extremo.',
    difficulty: 'Avanzado',
    equipment: ['Envasadora de campana profesional'],
    reagents: [],
    pairingNotes: ['Sandía con Sangría', 'Manzana con Lima', 'Pepino con Ginebra']
  },
  {
    id: 't10',
    name: 'Estabilización de Cremosos (Grolet)',
    category: 'Texturización',
    description: 'Técnica de emulsión ultra-estable para ganaches y cremas de fruta con estructura de "memoria de forma".',
    difficulty: 'Maestro',
    equipment: ['Robot de cocina de alto cizallamiento', 'Manga pastelera'],
    reagents: ['Pectina NH', 'Masa de gelatina'],
    pairingNotes: ['Frutos rojos', 'Chocolate de origen', 'Frutos secos']
  },
  {
    id: 't11',
    name: 'Destilación mediante Rotovapor',
    category: 'Extracción',
    description: 'Extracción de esencias puras y aromas volátiles a temperaturas extremadamente bajas mediante la reducción de la presión atmosférica.',
    difficulty: 'Maestro',
    equipment: ['Rotovapor', 'Bomba de vacío', 'Sistema de recirculación'],
    reagents: [],
    pairingNotes: ['Esencia de tierra húmeda', 'Alcoholes aromatizados', 'Aguas vegetales']
  },
  {
    id: 't12',
    name: 'Fermentación Láctica',
    category: 'Extracción',
    description: 'Fermentación controlada con bacterias lácticas para crear sabores ácidos complejos. Base de kimchi, encurtidos y leches fermentadas.',
    difficulty: 'Intermedio',
    equipment: ['Tarros herméticos', 'Termómetro', 'pH-Metro'],
    reagents: ['Sal no yodada', 'Suero de leche (opcional)'],
    pairingNotes: ['Col', 'Remolacha', 'Zanahorias', 'Leche']
  },
  {
    id: 't13',
    name: 'Ahumado en Frío y Caliente',
    category: 'Térmica',
    description: 'Impregnación de sabor a humo mediante la combustión controlada de maderas aromáticas (roble, manzano, cerezo) a distintas temperaturas.',
    difficulty: 'Intermedio',
    equipment: ['Ahumador', 'Gun de humo', 'Keg de vidrio'],
    reagents: ['Astillas de madera', 'Hierbas secas'],
    pairingNotes: ['Salmón', 'Wagyu', 'Mantequilla', 'Sal', 'Quesos curados']
  },
  {
    id: 't14',
    name: 'Emulsión en Frío (Lecitina)',
    category: 'Texturización',
    description: 'Creación de emulsiones estables y ligeras sin calor, usando lecitina de soja como emulsionante natural para vinagretas y salsas densas.',
    difficulty: 'Básico',
    equipment: ['Turmix', 'Báscula'],
    reagents: ['Lecitina de Soja'],
    pairingNotes: ['Aceite de oliva virgen extra', 'Vinagres', 'Mostaza']
  },
  {
    id: 't15',
    name: 'Gelificación con Metilcelulosa',
    category: 'Texturización',
    description: 'Gel termorreversible único: sólido en caliente, líquido en frío. Permite crear espaguetis calientes que se funden al servir.',
    difficulty: 'Avanzado',
    equipment: ['Termómetro de precisión', 'Jeringa culinaria'],
    reagents: ['Metilcelulosa F50'],
    pairingNotes: ['Caldos umami', 'Salsas de tomate', 'Aceites aromáticos']
  },
  {
    id: 't16',
    name: 'Confitado en Aceite',
    category: 'Térmica',
    description: 'Cocción lenta sumergida en materia grasa a temperatura inferior al punto de ebullición para una textura melosa e hipertierna.',
    difficulty: 'Básico',
    equipment: ['Cazuela de fondo grueso', 'Termómetro'],
    reagents: [],
    pairingNotes: ['Ajo', 'Pato', 'Tomate', 'Bacalao']
  },
  {
    id: 't17',
    name: 'Maillard y Costrificación',
    category: 'Térmica',
    description: 'Control científico de la reacción de Maillard: temperatura de costra óptima (155-180°C), secado previo y gestión del vapor.',
    difficulty: 'Básico',
    equipment: ['Plancha de hierro fundido', 'Termómetro de infrarrojos'],
    reagents: [],
    pairingNotes: ['Carne roja', 'Pan', 'Cebolla', 'Champiñones']
  },
  {
    id: 't18',
    name: 'Liofilización',
    category: 'Extracción',
    description: 'Secado a ultra-baja temperatura y presión de vacío que conserva el 95% de los nutrientes, color y aroma del alimento original.',
    difficulty: 'Maestro',
    equipment: ['Liofilizador industrial', 'Cámara de vacío'],
    reagents: [],
    pairingNotes: ['Fresas', 'Café', 'Quesos frescos', 'Hierbas']
  },
  {
    id: 't19',
    name: 'Cristalización de Azúcar',
    category: 'Presentación',
    description: 'Control de los estadios del azúcar (hebra, bola, caramelo, vidrio) para crear esculturas, isomalt decorativo y espun-sugar.',
    difficulty: 'Avanzado',
    equipment: ['Termómetro de azúcar', 'Soplete', 'Alfombrilla de silicona'],
    reagents: ['Isomalt', 'Glucosa líquida'],
    pairingNotes: ['Violetas', 'Pétalos de rosa', 'Cítricos']
  },
  {
    id: 't20',
    name: 'Esferificación Directa',
    category: 'Texturización',
    description: 'Técnica original de Ferran Adrià: alginato en el producto forma una membrana al contacto con el baño de cloruro cálcico.',
    difficulty: 'Intermedio',
    equipment: ['Cucharas de esferificación', 'Baño de calcio'],
    reagents: ['Alginato de Sodio', 'Cloruro de Calcio'],
    pairingNotes: ['Zumos de fruta', 'Vinos', 'Aceites saborizados']
  },
  {
    id: 't21',
    name: 'Infusión a Vacío',
    category: 'Extracción',
    description: 'Extracción de aromas mediante vacío a temperatura ambiente, preservando compuestos volátiles que se evaporarían con calor.',
    difficulty: 'Intermedio',
    equipment: ['Envasadora de campana', 'Bolsas de vacío'],
    reagents: [],
    pairingNotes: ['Aceite con hierbas frescas', 'Mantequilla aromatizada', 'Vinagres de frutas']
  },
  {
    id: 't22',
    name: 'Sifón y Espumas Calientes',
    category: 'Texturización',
    description: 'Uso del sifón ISI para crear espumas calientes y frías, mousses y cremas ligeras con textura estable mediante óxido nitroso.',
    difficulty: 'Básico',
    equipment: ['Sifón de cocina (ISI)', 'Cargas de N₂O'],
    reagents: ['Gelatina en láminas (para caliente)', 'Lecitina (para frío)'],
    pairingNotes: ['Patatas', 'Trufas', 'Foie', 'Manzanas']
  },
  {
    id: 't23',
    name: 'Cocina al Vapor de Alta Presión',
    category: 'Térmica',
    description: 'Cocción en autoclave culinario a >100°C en vapor de agua, que destruye fibras celulares y crea texturas imposibles con calor seco.',
    difficulty: 'Avanzado',
    equipment: ['Autoclave culinaria', 'Termómetro de penetración'],
    reagents: [],
    pairingNotes: ['Legumbres', 'Algas', 'Carne muy fibrosa']
  },
  {
    id: 't24',
    name: 'Glaseado Espejado (Mirror Glaze)',
    category: 'Presentación',
    description: 'Técnica pastelera para crear superficies de acabado perfectamente reflectantes usando gelatina, glucosa y colorantes liposolubles.',
    difficulty: 'Avanzado',
    equipment: ['Rejilla metálica', 'Termómetro', 'Batidora de pie'],
    reagents: ['Gelatina en láminas', 'Glucosa', 'Chocolate blanco'],
    pairingNotes: ['Mousse de chocolate', 'Bavarian de frutas', 'Cheesecakes']
  },
  {
    id: 't25',
    name: 'Koji y Enzimática',
    category: 'Extracción',
    description: 'Uso del hongo Aspergillus oryzae (koji) para producir proteasas y amilasas que crean sabores de umami profundo en proteínas y almidones.',
    difficulty: 'Maestro',
    equipment: ['Cámara de clima controlado', 'Esporas de Koji'],
    reagents: ['Esporas Aspergillus oryzae'],
    pairingNotes: ['Carne de vacuno', 'Pescados grasos', 'Legumbres', 'Arroz']
  },
  {
    id: 't26',
    name: 'Maduración Acelerada por Enzimas',
    category: 'Extracción',
    description: 'Uso de bromelína (piña), papaína (papaya) o proteasas fúngicas para tiernizar y desarrollar sabor en carnes en horas en lugar de semanas.',
    difficulty: 'Avanzado',
    equipment: ['Envasadora al vacío', 'Báscula de precisión'],
    reagents: ['Jugo de piña fresco', 'Extracto de papaya'],
    pairingNotes: ['Carne de vacuno', 'Pulpo', 'Calamar']
  },
  {
    id: 't27',
    name: 'Esponjado al Microondas',
    category: 'Texturización',
    description: 'Técnica que usa el microondas para expandir masa de bizcocho en segundos, creando una estructura esponjosa compacta sin horno.',
    difficulty: 'Básico',
    equipment: ['Microondas de alta potencia', 'Sifón ISI'],
    reagents: ['Lecitina de soja'],
    pairingNotes: ['Zanahoria', 'Coco', 'Chocolate', 'Frutos secos']
  },
  {
    id: 't28',
    name: 'Confit de Cítricos',
    category: 'Extracción',
    description: 'Blanqueado repetitivo y confitado en almíbar progresivo para eliminar el amargor de la piel y crear cáscaras translúcidas y joyas comestibles.',
    difficulty: 'Intermedio',
    equipment: ['Cazo de acero inoxidable', 'Termómetro'],
    reagents: ['Glucosa', 'Pectina NH'],
    pairingNotes: ['Naranja', 'Limón Meyer', 'Pomelo', 'Yuzu']
  },
  {
    id: 't29',
    name: 'Acetificación y Vinagres Artesanos',
    category: 'Extracción',
    description: 'Producción de vinagres de alta complejidad mediante fermentación acética controlada con madre de vinagre viva.',
    difficulty: 'Avanzado',
    equipment: ['Barrica de madera', 'pH-metro', 'Airlock'],
    reagents: ['Madre de vinagre (Acetobacter)'],
    pairingNotes: ['Sidra de manzana', 'Vino blanco', 'Frutas fermentadas']
  },
  {
    id: 't30',
    name: 'Tallado y Escultura Culinaria',
    category: 'Presentación',
    description: 'Arte de la escultura vegetal (mukimono japonés) y de hielo: técnicas de tallado preciso para presentaciones de alto impacto visual.',
    difficulty: 'Maestro',
    equipment: ['Juego de gubias japonesas', 'Mandolina', 'Herramientas de escultura'],
    reagents: [],
    pairingNotes: ['Daikon', 'Zanahoria', 'Melón', 'Sandía']
  }
];
