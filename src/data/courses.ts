export interface CourseModule {
  id: string;
  title: string;
  content: string;
}

export interface Course {
  id: string;
  title: string;
  instructor: string;
  tier: 'FREE' | 'PRO' | 'PREMIUM';
  category: 'Tecnicas' | 'Ingredientes' | 'Gestion' | 'Creatividad';
  description: string;
  readingTime?: string;
  modules?: CourseModule[];
  publishedAt: string;
  days_required?: number;
}

// Fallback corto; la biblioteca completa se carga desde Supabase.
export const courses: Course[] = [
  {
    id: 'local-free-01',
    title: 'Dia 01 - FREE - Fundamentos de texturas',
    instructor: 'Grand Chef',
    tier: 'FREE',
    category: 'Tecnicas',
    publishedAt: '2026-03-16',
    days_required: 1,
    description: 'Bases practicas para entender textura, calor y estructura. Incluye un ejercicio guiado.',
    modules: [
      {
        id: 'm1',
        title: 'Mapa de textura (basico)',
        content: [
          'Objetivo: aprender a describir una textura con precision y reproducirla.',
          'Define el contraste: crujiente/blando, jugoso/seco, elastico/fragil.',
          'Identifica la causa: agua, grasa, aire, gel, almidon, proteina.',
          'Elige un control: temperatura, tiempo, corte, sal, acidez.',
          'Ejercicio: repite la misma verdura en tres cocciones (vapor, salteado, horno) y registra lo que cambia.'
        ].join('\n\n')
      }
    ]
  },
  {
    id: 'local-pro-01',
    title: 'Dia 01 - PRO - Emulsiones estables',
    instructor: 'Grand Chef',
    tier: 'PRO',
    category: 'Tecnicas',
    publishedAt: '2026-03-16',
    days_required: 1,
    description: 'Metodo PRO para construir emulsiones robustas: ratios, cizalla, temperatura y fallos tipicos.',
    modules: [
      {
        id: 'm1',
        title: 'Marco tecnico',
        content: [
          'Una emulsion estable es control de fase grasa, fase acuosa y agente emulsionante.',
          'Variables: ratio (g/g), velocidad de incorporacion, tamano de gota, viscosidad y temperatura.',
          'Checklist: pesa todo, define objetivo (mayonesa, beurre blanc, vinagreta), y establece un protocolo.'
        ].join('\n\n')
      },
      {
        id: 'm2',
        title: 'Diagnostico de fallos',
        content: [
          'Corte por temperatura: la grasa se separa. Solucion: baja temperatura y re-emulsiona con fase acuosa.',
          'Corte por exceso de grasa: falta emulsificante. Solucion: anade fase acuosa + yema/mostaza/lecitina.',
          'Textura granulosa: gota grande. Solucion: mas cizalla o incorporacion mas lenta.'
        ].join('\n\n')
      },
      {
        id: 'm3',
        title: 'Practica controlada',
        content: [
          'Haz 3 lotes de 150 g variando solo una variable (ratio, temperatura o velocidad).',
          'Registra: apariencia, brillo, viscosidad, estabilidad a 10 min y a 60 min.',
          'Cierra con un protocolo de 8 pasos que puedas repetir sin pensar.'
        ].join('\n\n')
      }
    ]
  },
  {
    id: 'local-premium-01',
    title: 'Dia 01 - PREMIUM - Arquitectura del sabor',
    instructor: 'Grand Chef',
    tier: 'PREMIUM',
    category: 'Creatividad',
    publishedAt: '2026-03-16',
    days_required: 1,
    description: 'Sistema premium para disenar platos: tensiones, puentes, persistencia y narrativa sensorial.',
    modules: [
      {
        id: 'm1',
        title: 'El sistema',
        content: [
          'Piensa el plato como una secuencia: ataque, centro, final y retrogusto.',
          'Define 1 protagonista, 1 antagonista (contraste) y 1 puente (coherencia).',
          'Controla persistencia con umami, amargos elegantes y grasas aromaticas.'
        ].join('\n\n')
      },
      {
        id: 'm2',
        title: 'Herramientas de diseno',
        content: [
          'Rueda de tensiones: acido vs graso, dulce vs amargo, tostado vs citrico.',
          'Capas: textura (crujiente), temperatura (caliente/frio), aroma (volatil) y gusto (no volatil).',
          'Estandar: cada capa debe tener una funcion y un control medible.'
        ].join('\n\n')
      },
      {
        id: 'm3',
        title: 'Aplicacion',
        content: [
          'Escribe un menu degustacion de 6 pases con coherencia aromatica.',
          'Asigna a cada pase una tecnica, un puente aromatico y un contraste.',
          'Define mise en place y tiempos de pase por plato.'
        ].join('\n\n')
      }
    ]
  }
];
