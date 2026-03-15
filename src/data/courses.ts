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
  category: 'Técnicas' | 'Ingredientes' | 'Gestión' | 'Creatividad';
  description: string;
  readingTime: string;
  modules: CourseModule[];
  publishedAt: string;
  days_required?: number;
}

export const courses: Course[] = [
  {
    id: 'c1',
    title: "Iniciación a las Texturas Fundamentales",
    instructor: "Chef Instructor - GrandChef Lab",
    tier: 'FREE',
    category: 'Técnicas',
    readingTime: '15 min',
    publishedAt: '2024-03-15',
    description: "Conceptos básicos sobre la modificación de texturas tradicionales en la cocina moderna.",
    modules: [
      {
        id: 'm1',
        title: "El Estado de la Materia Culinaria",
        content: `La comprensión de las texturas básicas es el primer paso hacia la vanguardia. En la cocina tradicional, las texturas se limitan a los estados naturales de los ingredientes cocinados: crujiente, blando, líquido o sólido. 
        
La gastronomía contemporánea desafía estos límites mediante la extracción y purificación de agentes texturizantes que ya existen en la naturaleza, como gelatinas, pectinas y almidones. Al aislar estos componentes, el chef obtiene el control total sobre la reología del plato. En este nivel inicial, exploraremos cómo la simple alteración de la temperatura y el tiempo de cocción puede modificar la estructura celular de los vegetales y las proteínas animales, sentando las bases para técnicas más avanzadas.`
      }
    ]
  },
  {
    id: 'c2',
    title: "Arquitectura del Sabor y Neuro-Gastronomía",
    instructor: "Investigador Creativo - GrandChef Lab",
    tier: 'PRO',
    category: 'Creatividad',
    readingTime: '60 min',
    publishedAt: '2024-03-14',
    description: "Análisis exhaustivo de compuestos volátiles y sinergias moleculares en la creación de menús vanguardistas.",
    modules: [
      {
        id: 'm1',
        title: "Bases Cromatográficas del Food Pairing",
        content: `El paradigma del 'Food Pairing' trasciende la intuición empírica tradicional del chef. A través de la cromatografía de gases acoplada a la espectrometría de masas (GC-MS), podemos diseccionar los perfiles aromáticos de cualquier ingrediente natural hasta su estructura molecular básica. Se ha demostrado empíricamente que ingredientes con altas concentraciones de las mismas moléculas aromáticas clave (como el linalool en el cilantro, los arándanos y la canela) presentan un altísimo índice de afinidad organoléptica, incluso si cultural o geográficamente jamás se habían combinado.

El dominio de esta técnica permite la creación de perfiles de sabor que desafían las expectativas del cerebro humano, generando lo que en neuro-gastronomía se conoce como 'disonancia cognitiva positiva'.`
      },
      {
        id: 'm2',
        title: "Interacciones No Volátiles: Dominando el Kokumi",
        content: `Más allá de los ésteres, aldehídos y cetonas volátiles que impactan el bulbo olfatorio, el diseño de un plato PRO exige el control de los elementos no volátiles: los gustos básicos (dulce, salado, ácido, amargo y umami) y las sensaciones trigeminales (astringencia, temperatura, pungencia).

Sin embargo, el verdadero escalón de maestría reside en el 'Kokumi' (traducido como "sabor rico o pleno"). El Kokumi no es un sabor en sí mismo, sino una sensación de amplitud y persistencia generada por péptidos específicos, particularmente el glutatión. En esta sección, desglosaremos cómo extraer y concentrar estos péptidos mediante fermentaciones prolongadas, curados térmicos controlados y autólisis de levaduras, para inyectar una profundidad tridimensional a salsas madre y caldos de extracción fría.`
      }
    ]
  },
  {
    id: 'c3',
    title: "Termodinámica Crítica y Vacío: El Tratado Definitivo",
    instructor: "Ingeniero Culinario - GrandChef Lab",
    tier: 'PREMIUM',
    category: 'Técnicas',
    readingTime: '180 min',
    publishedAt: '2024-03-13',
    description: "El manual absoluto y enciclopédico sobre el control cronotérmico, cámaras de presión diferencial y transformación molecular forzada.",
    modules: [
      {
        id: 'm1',
        title: "Física Cuántica de la Desnaturalización Proteica",
        content: `Este tratado reserva sus hallazgos para aquellos que comprenden que la cocina es termodinámica aplicada. La desnaturalización de proteínas en medios estancos hipóxicos (sous-vide) representa el mayor avance técnico del último siglo. Sin embargo, su aplicación comercial actual apenas roza la superficie. Cuando sometemos un corte muscular a 54.4°C (exactamente), las enzimas captepsinas nativas entran en un estado de hiperactividad catalítica, desglosando el tejido conectivo intermuscular a una velocidad exponencial antes de desnaturalizarse ellas mismas a los 55°C. 

El control de este delta térmico de apenas 0.6°C es la diferencia entre una pieza de carne excelente y una obra de ingeniería gastronómica. Para lograr esto, los circuladores de inmersión deben ser recalibrados mensualmente utilizando termopares de platino estándar PT100. La carne no se cocina; se muta en un biorreactor de tiempo y temperatura, logrando que el tejido colágeno pase a gelatina hidrosoluble sin que las microfibras sarcoplásmicas expulsen su agua estructural retenida.`
      },
      {
        id: 'm2',
        title: "Infusión Hidrostática e Impregnación al Vacío",
        content: `La máquina de vacío de campana profesional, capaz de alcanzar el 99.9% de vacío (1 mbar o inferior), es drásticamente infrautilizada si solo se usa para conservación. Sus verdaderas capacidades residen en manipular la estructura celular de vegetales y frutas por capilaridad inversa.

Al sumergir, por ejemplo, gajos de manzana en un jarabe filtrado de remolacha y someterlos a una presión negativa extrema, el oxígeno encapsulado en los espacios intersticiales del tejido celular vegetal (el "apoplasto") se expande y es expulsado en forma de burbujas superficiales. Al golpear bruscamente la entrada de aire y retornar la cámara a presión atmosférica normal (1013 mbar), el jarabe de inmersión es forzado violenta y micrométricamente hacia el interior de las células vegetales por diferencial de presión. La manzana adquiere la translucidez del cristal rojo y una textura densa casi cárnica, sin haber elevado su temperatura un solo grado ni alterado su perfil enzimático nativo.`
      },
      {
        id: 'm3',
        title: "Criogenización por Expansión de Nitrógeno (N2)",
        content: `La gestión del nitrógeno líquido a -196°C traspasa la línea de la cocina hacia la ingeniería química criogénica. No lo usamos primariamente por la espectacularidad visual del vapor de condensación superficial en la sala (técnica considerada obsoleta en el más alto nivel), sino por la micro-cristalización ultra-rápida. 

Cuando creamos una emulsión lipídica (helado aerado), la textura es dictaminada inversamente por el tamaño de los cristales de hielo. A -18°C (congelador convencional), los cristales crecen lentamente, rompiendo la emulsión y creando una textura arenosa. Al llover nitrógeno líquido directamente en el rotor de amasado o pacotizar, forzamos un gradiente térmico tan violento que el agua no tiene tiempo de formar redes cristalinas macroscópicas. El resultado es un vidrio amorfo de agua suspendido en la fase grasa, creando una textura infinitamente más densa y sedosa, capaz de retener alcoholes y grasas extremas que colapsarían en un PAC (Poder Anticongelante) convencional.`
      },
      {
        id: 'm4',
        title: "Rotavapor: Destilación Molecular Fraccionada Pura",
        content: `La incorporación del rotavapor (evaporador rotatorio) a la cocina de I+D permite la captura del 'alma' volátil de la materia. Reduciendo la presión interna del matraz al vacío, logramos que el punto de ebullición de líquidos pesados o caldos caiga drásticamente, permitiendo que las aguas e infusiones hiervan violentamente a escasos 30°C.

Esto impide la reacción de Maillard indeseada y la degradación térmica de aldehídos sensibles al calor. Podemos extraer la esencia pura de la tierra húmeda, rosas o setas frescas en un destilado completamente transparente e incoloro, engañando a la corteza visual del comensal. Sirviendo un consomé frío transparente que impacta en el paladar con la fuerza de un fondo oscuro de ternera asada de 48 horas.`
      }
    ]
  },
  {
    id: 'c4',
    title: "Ingeniería Estratégica de Costes y Escalabilidad Estelar",
    instructor: "Director de Operaciones - GrandChef Lab",
    tier: 'PRO',
    category: 'Gestión',
    readingTime: '90 min',
    publishedAt: '2024-03-16',
    description: "Gestión perimetral extrema para maximizar la rentabilidad en líneas de alta producción Michelin.",
    modules: [
      {
        id: 'm1',
        title: "La Ecuación del Rendimiento Operativo (Yield)",
        content: `Ningún proyecto de vanguardia sobrevive únicamente con creatividad. Si el "Yield" o rendimiento operativo cae por debajo del 32% del ticket medio, el restaurante entra silenciosamente en fase terminal.

El análisis métrico de las operaciones en cocina requiere un desglose hipertextual de los costes ocultos. Elaborar una galleta de cristal de patata deshidratada, aunque su coste en materia prima (Food Cost) sea de 0.05€, puede requerir el uso de hornos deshidratadores durante 24 horas y 8 minutos de intervención cronometrada del personal en el pase final. Este "Coste de Tiempo-Hombre y Energía Activa" destruye el margen real de la galleta, convirtiéndola en un parásito financiero para el menú degustación, a menos que su factor wow (Tracción Social o Retorno en Marketing) la compense artificialmente.`
      },
      {
        id: 'm2',
        title: "Sistemas de Optimización de Pase de Servicio",
        content: `La línea de pase (La Salamandra o El Mostrador de Emplatado) representa el cuello de botella físico de cualquier restaurante de alta presión. Cada segundo perdido allí reduce la rotación de la sala y aumenta el riesgo de degradación térmica del plato.

El rediseño del flujo de trabajo exige estandarizar preparaciones satélite (Mis-en-place de Nivel 3): geles estables guardados en biberones térmicos, polvos liofilizados dosificados volumétricamente y emulsiones estabilizadas con goma xantana para evitar cortes por separación de fase bajo los focos de calor. El chef moderno en el pase no cocina, simplemente ensambla y audita calidad mediante tolerancia micrométrica con pinzas técnicas.`
      }
    ]
  }
];
