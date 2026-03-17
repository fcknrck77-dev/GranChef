export interface Ingredient {
  id: string;
  name: string;
  category: string;
  description: string;
  pairingNotes: string[];
  family: string;
  stories?: Record<string, string>;
}

function pad(num: number, width: number) {
  const s = String(num);
  return s.length >= width ? s : '0'.repeat(width - s.length) + s;
}

function buildIngredients(): Ingredient[] {
  // Deterministic list: censorship (index-based) stays stable across runs.
  const groups = [
    { family: 'Citricos', category: 'Frutas', names: ['Limon', 'Lima', 'Naranja', 'Pomelo', 'Mandarina', 'Bergamota', 'Yuzu', 'Kumquat'] },
    { family: 'Hierbas', category: 'Aromaticos', names: ['Albahaca', 'Menta', 'Romero', 'Tomillo', 'Cilantro', 'Eneldo', 'Salvia', 'Hierbabuena'] },
    { family: 'Especias', category: 'Especias', names: ['Pimienta negra', 'Pimienta rosa', 'Comino', 'Cardamomo', 'Canela', 'Anis', 'Clavo', 'Coriandro'] },
    { family: 'Umami', category: 'Potenciadores', names: ['Miso', 'Salsa de soja', 'Kombu', 'Shiitake', 'Parmigiano', 'Tomate seco', 'Anchoa', 'Levadura nutricional'] },
    { family: 'Fermentados', category: 'Fermentados', names: ['Koji', 'Kimchi', 'Chucrut', 'Kefir', 'Vinagre de arroz', 'Vinagre de Jerez', 'Gochujang', 'Garum'] },
    { family: 'Lacteos', category: 'Lacteos', names: ['Yogur', 'Nata', 'Mantequilla', 'Queso azul', 'Ricotta', 'Creme fraiche', 'Leche de coco', 'Kefir de leche'] },
    { family: 'Marinos', category: 'Marinos', names: ['Alga nori', 'Alga wakame', 'Huevo de trucha', 'Bottarga', 'Bonito seco', 'Caviar', 'Erizo', 'Sal marina'] },
    { family: 'Tostados', category: 'Tostados', names: ['Cafe', 'Cacao', 'Avellana', 'Almendra', 'Sarraceno tostado', 'Cebolla tostada', 'Sesamo tostado', 'Pan tostado'] },
    { family: 'Florales', category: 'Florales', names: ['Agua de azahar', 'Rosa', 'Lavanda', 'Jazmin', 'Flor de sauco', 'Hibisco', 'Manzanilla', 'Violeta'] },
    { family: 'Amargos', category: 'Amargos', names: ['Endivia', 'Radicchio', 'Pomelo rosa', 'Cacao 90%', 'Cafe espresso', 'Rucula', 'Te matcha', 'Ajenjo'] },
    { family: 'Dulces', category: 'Dulces', names: ['Vainilla', 'Miel', 'Caramelo', 'Panela', 'Azucar muscovado', 'Sirope de arce', 'Dulce de leche', 'Chocolate blanco'] },
    { family: 'Frutos secos', category: 'Frutos secos', names: ['Pistacho', 'Nuez', 'Pecan', 'Anacardo', 'Macadamia', 'Cacahuete', 'Pinon', 'Castana'] },
    { family: 'Tropicales', category: 'Frutas', names: ['Mango', 'Pina', 'Maracuya', 'Guayaba', 'Coco', 'Papaya', 'Lichi', 'Platano'] },
    { family: 'Ahumados', category: 'Ahumados', names: ['Pimenton ahumado', 'Sal ahumada', 'Te lapsang', 'Chipotle', 'Aceite ahumado', 'Mantequilla noisette', 'Bacon', 'Trufa negra'] },
    { family: 'Vegetales', category: 'Vegetales', names: ['Apio', 'Hinojo', 'Remolacha', 'Zanahoria', 'Puerro', 'Ajo negro', 'Coliflor', 'Calabaza'] },
    { family: 'Texturizantes', category: 'Tecnicos', names: ['Alginato de sodio', 'Lecitina de soja', 'Agar-agar', 'Goma xantana', 'Gelatina', 'Pectina NH', 'Iota carragenato', 'Metilcelulosa'] }
  ];

  const raw: Array<{ name: string; category: string; family: string; description: string }> = [];
  for (const g of groups) {
    for (const name of g.names) {
      raw.push({
        name,
        category: g.category,
        family: g.family,
        description: `Ingrediente de la familia ${g.family}. Usalo para construir contrastes y puentes aromaticos.`
      });
    }
  }

  const base = ['Citrico', 'Herbal', 'Especiado', 'Umami', 'Tostado', 'Floral', 'Ahumado', 'Lacteo'];
  const forms = ['Polvo de', 'Extracto de', 'Gel de', 'Aire de', 'Infusion de', 'Reduccion de'];
  let k = 1;
  while (raw.length < 100) {
    const g = groups[k % groups.length];
    const form = forms[k % forms.length];
    const token = base[k % base.length];
    raw.push({
      name: `${form} ${token} ${k}`,
      category: g.category,
      family: g.family,
      description: `Derivado tecnico (${token}) para pruebas controladas de sabor y textura.`
    });
    k++;
  }

  const trimmed = raw.slice(0, 100);
  const names = trimmed.map((x) => x.name);

  return trimmed.map((x, idx) => {
    const partners = [
      names[(idx + 7) % names.length],
      names[(idx + 19) % names.length],
      names[(idx + 31) % names.length],
      names[(idx + 43) % names.length]
    ];

    const stories: Record<string, string> = {};
    if (idx < 12) {
      stories[partners[0]] = `Cuando se combina con ${partners[0]}, aparece un puente aromatico de alta estabilidad.`;
      stories[partners[1]] = `Con ${partners[1]}, el perfil se expande con un final mas largo.`;
      stories[partners[2]] = `Junto a ${partners[2]}, el contraste se vuelve mas nitido y controlable.`;
    }

    return {
      id: `ing-${pad(idx + 1, 3)}`,
      name: x.name,
      category: x.category,
      family: x.family,
      description: x.description,
      pairingNotes: partners,
      stories: Object.keys(stories).length ? stories : undefined
    };
  });
}

export const ingredients: Ingredient[] = buildIngredients();

