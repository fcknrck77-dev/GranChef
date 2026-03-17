export interface Technique {
  id: string;
  name: string;
  category: 'Texturizacion' | 'Termica' | 'Extraccion' | 'Presentacion';
  description: string;
  difficulty: 'Basico' | 'Intermedio' | 'Avanzado' | 'Maestro';
  equipment: string[];
  reagents?: string[];
  pairingNotes: string[];
}

function pad(num: number, width: number) {
  const s = String(num);
  return s.length >= width ? s : '0'.repeat(width - s.length) + s;
}

function buildTechniques(): Technique[] {
  const list: Array<{ name: string; category: Technique['category']; difficulty: Technique['difficulty'] }> = [
    { name: 'Esferificacion inversa', category: 'Texturizacion', difficulty: 'Avanzado' },
    { name: 'Aires y espumas', category: 'Texturizacion', difficulty: 'Basico' },
    { name: 'Gelificacion con agar-agar', category: 'Texturizacion', difficulty: 'Basico' },
    { name: 'Gelificacion con pectina', category: 'Texturizacion', difficulty: 'Intermedio' },
    { name: 'Emulsion estable', category: 'Texturizacion', difficulty: 'Intermedio' },
    { name: 'Sous-vide', category: 'Termica', difficulty: 'Intermedio' },
    { name: 'Confitado a baja temperatura', category: 'Termica', difficulty: 'Intermedio' },
    { name: 'Nitro-congelacion', category: 'Termica', difficulty: 'Maestro' },
    { name: 'Caramelizacion controlada', category: 'Termica', difficulty: 'Basico' },
    { name: 'Infusion en frio', category: 'Extraccion', difficulty: 'Basico' },
    { name: 'Infusion en caliente', category: 'Extraccion', difficulty: 'Basico' },
    { name: 'Destilacion aromatica', category: 'Extraccion', difficulty: 'Avanzado' },
    { name: 'Extraccion por grasa', category: 'Extraccion', difficulty: 'Intermedio' },
    { name: 'Clarificacion', category: 'Extraccion', difficulty: 'Intermedio' },
    { name: 'Fermentacion controlada', category: 'Extraccion', difficulty: 'Avanzado' },
    { name: 'Ahumado en frio', category: 'Extraccion', difficulty: 'Intermedio' },
    { name: 'Deshidratacion', category: 'Termica', difficulty: 'Intermedio' },
    { name: 'Liofilizacion', category: 'Termica', difficulty: 'Avanzado' },
    { name: 'Pickling rapido', category: 'Extraccion', difficulty: 'Basico' },
    { name: 'Curado osmotico', category: 'Extraccion', difficulty: 'Intermedio' },
    { name: 'Templado de chocolate', category: 'Termica', difficulty: 'Intermedio' },
    { name: 'Bano maria preciso', category: 'Termica', difficulty: 'Basico' },
    { name: 'Glaseado espejo', category: 'Presentacion', difficulty: 'Avanzado' },
    { name: 'Plating geometrico', category: 'Presentacion', difficulty: 'Intermedio' },
    { name: 'Texturas en contraste', category: 'Presentacion', difficulty: 'Intermedio' },
    { name: 'Salseado con precision', category: 'Presentacion', difficulty: 'Basico' },
    { name: 'Microplane y rallado', category: 'Presentacion', difficulty: 'Basico' },
    { name: 'Gel laminado', category: 'Texturizacion', difficulty: 'Avanzado' },
    { name: 'Crispy por expansion', category: 'Termica', difficulty: 'Avanzado' },
    { name: 'Aireado mecanico', category: 'Texturizacion', difficulty: 'Intermedio' }
  ];

  const equipmentByCategory: Record<Technique['category'], string[]> = {
    Texturizacion: ['Bascula de precision', 'Batidora de inmersion', 'Colador fino'],
    Termica: ['Ronner', 'Termometro', 'Bolsas al vacio'],
    Extraccion: ['Recipiente hermetico', 'Filtro', 'Cazo'],
    Presentacion: ['Pinzas', 'Biberon', 'Aro de emplatar']
  };

  const reagentsByName = (name: string) => {
    if (name.toLowerCase().includes('esfer')) return ['Alginato de sodio', 'Calcio (lactato/cloruro)'];
    if (name.toLowerCase().includes('aire') || name.toLowerCase().includes('espuma')) return ['Lecitina de soja'];
    if (name.toLowerCase().includes('gel')) return ['Agar-agar', 'Pectina NH'];
    if (name.toLowerCase().includes('ferment')) return ['Sal', 'Cultivo iniciador (opcional)'];
    return [];
  };

  const pairingByCategory = (cat: Technique['category']) => {
    if (cat === 'Texturizacion') return ['Texturizantes', 'Citricos', 'Lacteos', 'Umami'];
    if (cat === 'Termica') return ['Tostados', 'Ahumados', 'Vegetales', 'Marinos'];
    if (cat === 'Extraccion') return ['Florales', 'Hierbas', 'Especias', 'Fermentados'];
    return ['Presentacion', 'Florales', 'Citricos', 'Dulces'];
  };

  return list.map((t, idx) => ({
    id: `tech-${pad(idx + 1, 2)}`,
    name: t.name,
    category: t.category,
    description: `Protocolo ${t.difficulty.toLowerCase()} para ${t.name}. Enfoque en repetibilidad y control.`,
    difficulty: t.difficulty,
    equipment: equipmentByCategory[t.category] || ['Utillaje basico'],
    reagents: reagentsByName(t.name),
    pairingNotes: pairingByCategory(t.category)
  }));
}

export const techniques: Technique[] = buildTechniques();

