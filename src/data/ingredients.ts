export interface Ingredient {
  id: string;
  name: string;
  category: string;
  description: string;
  pairingNotes: string[];
  family: string;
  stories?: Record<string, string>;
}

export const ingredients: Ingredient[] = [
  {
    "id": "1",
    "name": "Café",
    "category": "Tostados",
    "family": "Tostados",
    "description": "Granos tostados con perfiles que van desde lo ácido a lo achocolatado. Base de la cafeína molecular.",
    "pairingNotes": [
      "Cardamomo",
      "Naranja",
      "Rosa",
      "Chocolate Negro",
      "Vainilla"
    ],
    "stories": {
      "Cardamomo": "La armonía beduina. Molienda conjunta para un perfil floral y terroso.",
      "Naranja": "Contraste cítrico que realza los aceites del café tostado.",
      "Rosa": "El amargor del café actúa como antídoto a la dulzura floral abrumadora."
    }
  },
  {
    "id": "molecular-1",
    "name": "Alginato de Sodio",
    "category": "Técnicos",
    "family": "Texturizantes",
    "description": "Polisacárido extraído de algas pardas. Esencial para la esferificación directa.",
    "pairingNotes": ["Cloruro de Calcio", "Lactato de Calcio", "Líquidos Acuosos"],
    "stories": {
      "Lactato de Calcio": "La base del 'Caviar Gastronómico'. Reacción de gelificación instantánea."
    }
  },
  {
    "id": "molecular-2",
    "name": "Lecitina de Soja",
    "category": "Técnicos",
    "family": "Emulsionantes",
    "description": "Fosfolípido natural. Permite crear 'aires' y espumas estables de gran ligereza.",
    "pairingNotes": ["Cítricos", "Aceites Aromáticos", "Agua"],
    "stories": {
      "Cítricos": "Crea nubes de sabor ácido que flotan sobre platos de pescado."
    }
  },
  {
    "id": "japanese-1",
    "name": "Yuzu",
    "category": "Frutas",
    "family": "Cítricos Japoneses",
    "description": "Cítrico japonés con notas que recuerdan a la mandarina, el pomelo y la lima.",
    "pairingNotes": ["Miso", "Pescado Blanco", "Chocolate Blanco", "Matcha"],
    "stories": {
      "Matcha": "Equilibrio zen entre lo amargo vegetal y el ácido punzante."
    }
  },
  {
    "id": "premium-1",
    "name": "Trufa Negra Melanosporum",
    "category": "Hongos",
    "family": "Diamantes Negros",
    "description": "Hongo subterráneo de aroma complejo, terroso y animal. El culmen del lujo gastronómico.",
    "pairingNotes": ["Huevo", "Patata", "Mantequilla", "Ternera"],
    "stories": {
      "Huevo": "Los lípidos del huevo absorben los compuestos volátiles de la trufa de forma mágica."
    }
  },
  {
    "id": "3",
    "name": "Cacahuete",
    "category": "Tostados",
    "family": "Tostados",
    "description": "Ingrediente versátil de la familia Tostados.",
    "pairingNotes": [
      "Apio",
      "Brócoli"
    ],
    "stories": {
      "Apio": "Véase  Apio  y  cacahuete,  p.  136",
      "Brócoli": "La  cru jiente  mantequilla  de  cacahuete  está  hecha  para  el  brócoli,  que  atrapa  las  migajas  de  cacahuete  en  sus  flores  sin  abrir.  Se  puede comprobar  con  una  ensalada  aliñada  como  la  de  Cacahuete  y  coco,  en  la  p.  32.  Y  si  se  le  da  bien  picar  las  cabezuela..."
    }
  },
  {
    "id": "4",
    "name": "Hígado",
    "category": "Otros",
    "family": "Otros",
    "description": "Ingrediente versátil de la familia Otros.",
    "pairingNotes": [
      "Salvia",
      "Ternera",
      "Tocino"
    ],
    "stories": {
      "Salvia": "Véase  Salvia  e hígado,  p.  461",
      "Ternera": "Véase  Te rnera  e hígado,  p.  63",
      "Tocino": "Me  pregunto  si  la  clave  de  esta  combinación  clásica  puede  residir  en  que  el  lúgado  contiene  poca  grasa  mientras  que  el  tocino  tiene  grasa  de  sobra.  Se  fríen  lonchas  de  tocino hasta  que  estén  cru jientes  y  se  dejan  aparte,  pero  al  calor,  mientras  se  fríe ..."
    }
  },
  {
    "id": "5",
    "name": "Ternera",
    "category": "Carnes",
    "family": "Carnes",
    "description": "Ingrediente versátil de la familia Carnes.",
    "pairingNotes": [
      "Aceituna",
      "Ajo",
      "Anchoa",
      "Apio",
      "Brócoli",
      "Cebolla",
      "Cerdo",
      "Chlrivia",
      "Clavo",
      "Coco",
      "Col",
      "Enebro",
      "Huevo",
      "Jengibre",
      "Lima",
      "Limón",
      "Menta",
      "Mora",
      "Nabo",
      "Nuez",
      "Pera"
    ],
    "stories": {
      "Aceituna": "Véase  Aceitu na y ter nera,  p.  255",
      "Ajo": "El  ajo  saca a  relucir  el  carácter  ca rn oso  de  la  te rn era.  Se  puede  combinar  un  costillar  de  ternera asado  con  puré  de  patatas  con  ajo,  o  elaborar  una  salsa  para  rodajas  finas  de  tern era  teriyaki  ablandando  un  puñado  de  dientes  de  ajo  pelados  en  caldo ...",
      "Anchoa": "Véase  A nchoa  y  ter nera,  p.  236  Ternera  y  an ís: Véase  A ní s y  ternera,  p. 267",
      "Apio": "Véase  Apio  y  ternera,  p.  139",
      "Brócoli": "Véase  Brócoli  y  ter nera,  p.  183  Ternera  y  caca huete : Véase  Cacahuete  y  ternera,  p.  35  Ternera  y  caf é:  Véase  Café  y  ter nera,  p.  31  Ternera  y  ca nela : La  canela,  que  se  utiliza  en  muchos  platos  de  ca rn e  griegos,  es  un  ingrediente  clave del  pastitsio, ...",
      "Cerdo": "Véase  Cerdo  y  ternera,  p.  53",
      "Cebolla": "El  sándwich  Philly original,  de  carne  y  queso,  ideado  por  Pat  y Harry  Olivieri,  de  Filadelfia,  para  poder ofrecer  algo  un  poco  dif erente  en  su  carrito  de  perritos  calientes,  consist ía simple­ mente  en  lonchas  finas  de  filete  y  cebollas  en  un  panecillo  blanco...",
      "Chlrivia": "Véase  Chirivía  y  ternera,  p.  324",
      "Clavo": "Véase  Clavo  y  ternera,  p.  318",
      "Coco": "El  beef  penang  del  Blue  Elephant  era  inolvidable,  pero  el  beef  rendang  del  Fatty  Crab  me  hizo  caer  de  la  silla.  Tanto  el  penang  como  el  rendang  son  estofados  con  coco,  salados  y  dulces,  y  cocidos  a fuego  lento,  oriundos  del  sudeste  asiático .  El  rendang,...",
      "Col": "Véase  Col  y  ternera,  p.  175",
      "Enebro": "El  plato  corso  premonata  (o  pre bonata)  incluye  ternera,  cabrito  o  cabra  servida  en  una  suculenta  salsa  de  vino,  toma­ te,  pimientos  y  fiu tos  de  enebro,  cocid a a  fuego lento. Tan  siniestro  como  las  calle juelas  de  Calvi  a medianoche.  Ternera  y  ene ldo : Véase ...",
      "Huevo": "Ante  la  inevitable  llegada  de  la  Directiva  Europea  de  Sanidad  y  Seguridad  9/24675  (F),  «T artare  de  ternera  (grave  peli­ gro  de  muerte)»,  debe  usted  pedir  uno  ahora  mismo,  antes  de  que  sea  demasiado  tarde.  La  ternera  cruda  tiene  un  leve  sabor  a amorúaco  co...",
      "Jengibre": "Véase  Jengibre  y  ternera,  p.  448",
      "Lima": "Véase  Lima  y  ternera,  p.  434",
      "Limón": "Véase  Limón  y  ternera,  p.  441  Ternera  y  ma risco : Véase  Marisco  y ternera,  p. 209",
      "Menta": "Véase  Menta  y  ternera,  p.  475",
      "Mora": "Véase  Mora  y  ternera,  p.  480",
      "Nabo": "Una  tarde  de  invierno  metimos  el  coche  entre  un  montón  de  camiones  aparcados  en  batería  y, tras  pasar  bajo  un  dintel  de  poca  altura,  entramos  en  el  edificio,  iluminado  con  luces  de  neón.  Los  camioneros  estaban  sentados ante  mesas  altas  con  tablero  de  for­ ...",
      "Nuez": "Las  nueces  encurtidas  se  pusieron  de  moda  en  In­ glaterra  en  el  siglo  xvm.  Se  conse rvan  en  vinagre,  cuando  la  nuez  todavía  está verde,  antes  de  que  se  haya formado  la  cáscara.  Si  quiere  hacerlas  usted  mismo,  habrá  que  recoger  las  nueces  en  verano.  Son  un...",
      "Pera": "La  pera  nashi  y la  ternera  se  combinan  en  dos  popu­ lares  platos  coreanos,  uno  con  carne  cruda  y el  otro  con  carne  cocina ­ da.  El  yuk hwe  es  un  plato  para  ocasiones  especiales,  hecho  con  finas  lonchas  de  carne  cruda  marinadas  en  soja,  sésan10,  ajo,  ceboll..."
    }
  },
  {
    "id": "6",
    "name": "Berro",
    "category": "Otros",
    "family": "Otros",
    "description": "Ingrediente versátil de la familia Otros.",
    "pairingNotes": [
      "Anchoa",
      "Cerdo",
      "Chirivía",
      "Huevo",
      "Nuez",
      "Pollo",
      "Pomelo"
    ],
    "stories": {
      "Anchoa": "Véase Anchoa y berro, p. 234",
      "Cerdo": "En ciertas partes del sur de China, los berros se cue­ cen a fuego lento con costillas de cerdo para elaborar una sopa senci­ lla. Se le puede añadir sabor con jengibre fresco o con azufaifas, un  fruto parecido al dátil en aspecto y sabor.",
      "Chirivía": "Véase Chirivía y berro, p. 322",
      "Huevo": "El mastuerzo es una hierba que tiene un toque de  aceite de mostaza bastante más ligero que el de su pariente cercano,  el berro, pero ambos funcionan en contraste agradablemente pun­ zante con la an1.able comodidad del huevo. No existe mejor contras­ te para un sándw ich que se come con el dedo ...",
      "Nuez": "No  es  probable  que  un  sándwich  de  berros  se  reciba  con  mucho  entusiasmo,  por  muy  pulcramente  que  se  recorte  la  cor­ teza  del  pan.  Pero  si  las  hoj as  están  emparedadas  entre  rebanadas  de  pan de  nueces  hecho  en  casa, la  cosa  cambia.  Se  pueden  añadir  un  poc...",
      "Pollo": "El  pollo asado con  berros  me  parece  un  equivalente  de  climas  cálidos  del  rosbif  con  rábanos  picantes.  La  dulzura  de  la  carne  queda  realzada  por  la  pegada  picante  de  los  berros,  pero,  al  mismo  tiempo,  el  verdor  refrescante  de  las  hojas  aligera  la  combina­ c...",
      "Pomelo": "Véase  Pomelo  y  berro,  p.  428  Berro  y  queso  azul:  El  carácter  dulce-salado  del  stilton  contrasta  agradablemente  con  el  sabor  a pimienta  amarga  de  los  berros.  Tam­ bién es posible  detectar  un  leve  toque  metálico  en  los  dos  ingredien­ tes, como  si  se  de jaran  la..."
    }
  },
  {
    "id": "7",
    "name": "Marisco",
    "category": "Otros",
    "family": "Otros",
    "description": "Ingrediente versátil de la familia Otros.",
    "pairingNotes": [
      "Albahaca",
      "Alcaparra",
      "Almendra",
      "Anís",
      "Apio",
      "Berro",
      "Cacahuete",
      "Calabaza",
      "Cerdo",
      "Chirivía",
      "Coco",
      "Col",
      "Coliflor",
      "Comino",
      "Cordero",
      "Eneldo",
      "Espárrago",
      "Guindilla",
      "Lima"
    ],
    "stories": {
      "Albahaca": "Las notas cítricas y anisadas de la albahaca la  convierten en una elegante pareja para el m arisco. La albahaca con­ tiene un elem ento llam ado citral, que es uno de los responsables del  sabor del limó n y de la hierba limó n. Una ensalada de langosta y  m ango con albahaca es uno de los plato...",
      "Alcaparra": "Véase Alcaparra y marisco, p. 148",
      "Almendra": "El arom a de las gam bas cocidas se describe  m uchas veces com o «de frutos secos». A la plancha, se vuelve más  específica m ente de alm endra. La nota de alm endra en la gamba expli­ ca que se la em pareje con almendras m olidas en arom áticos cunies  indios, con salsas de alm endras en España...",
      "Anís": "El arús acentúa y refresca la dulzura del m arisco. La  m antequilla de estragó n con langosta y los m ejillones cocidos con  eneldo son com binaciones justificablem ente clásicas. Un chorrito de  Pemod puede sustituir al coñac en un bisque. La sencilla receta para  cocinar pechuga de pollo con e...",
      "Apio": "Véase Apio y marisco, p. 137  Marisco y aza frán: Véase Azafrán y marisco, p. 260",
      "Berro": "Véase Berro y ma risco, p. 143  202 MARI NOS",
      "Cacahuete": "Véase Cacahuete y marisco, p. 33",
      "Calabaza": "Véase Calabaza y marisco, p. 332",
      "Cerdo": "En Portugal es dificil perderse el porco a alentejana,  que es un estofado de cerdo con almejas, pimientos y cebollas. La  magia del plato no está solo en los pequeños tropezones de alm eja,  sino en el precioso jugo que contienen sus conchas, que, com o ocu­ rre con las ostras, aporta una parte ...",
      "Chirivía": "Véase Chirivía y marisco, p. 323",
      "Coco": "A nú m e recuerda las vacaciones. Un recubrim ien­ to rudim entario de coco desecado convierte las gam bas fritas en una  tapa de bar barato que requiere botellas de cerveza fría y una pila de  servilletas de papel. En Balúa (Brasil), hay un plato popular llam ado  11atapá que com bina m arisco y...",
      "Col": "Véase Col y marisco, p. 174",
      "Coliflor": "Véase Colifl.or y marisco, p. 179",
      "Comino": "En la obra de Apicio, el libro de cocina m ás  antiguo que se conoce, se da una receta de salsa de comino para el  marisco. El comino se m ezcla con pimienta, ligústico, perejil, m enta  seca, miel, vinagre y caldo. En la actualidad, el comino se em pareja  con frecuencia con m arisco en la India...",
      "Cordero": "Una de  las  combinaciones  menos  famosas  de  carne  y marisco . No  obstante,  el  cordero  se  cocinaba  en  otros  tiemp os  con  berberechos,  y  existe  un  libro  de  cocina  de  principios  del  si­ glo  XIX  escrito  porJo hn  Farley  que  incluye  una  receta  para  una  pie rna  de  c...",
      "Eneldo": "Véase  Eneldo  y  marisco,  p.  275",
      "Espárrago": "Como los  guisantes  y  el  maíz  dulce,  el  espá­ rrago  se  debe  consumir  lo antes  posible  después  de  cosecharlo.  Una  vez  recogido,  empieza  a consumir  su  propio  azúcar  -con  más  vora­ cidad  que  cualquier  otra  hortaliza  común- y  el  sabor  se  vuelve  más  flo jo.  Cuando ...",
      "Guindilla": "El  cangre jo  con  ch ile  tiene  mucho  éxito  en  Singapur.  El  cangre jo  se  fríe con  guind illas  frescas,  jengibre  y  ajo, y  después  se  envuelve  en  una  mezcla  pegajosa  de  salsa  de  guindilla,  ketchup,  soja,  azúcar  y  aceite  de  sésamo,  muchas  veces  con  un  huevo  aña...",
      "Lima": "La  caracola  frita  está  deliciosa  cuando  se  sir ve con  una  salsa  para  cóctel  de  mariscos  aderezada  con  lima.  El  sabor de la  caracola  es  un  cruce  entre  los de  la  vieira  y la  alme ja.  Su  textura  es  un  cmce  entre  la  vieira  y una  colchoneta  de  gimnasio.  Se  le ..."
    }
  },
  {
    "id": "8",
    "name": "Anís",
    "category": "Otros",
    "family": "Otros",
    "description": "Ingrediente versátil de la familia Otros.",
    "pairingNotes": [
      "Zanahoria"
    ],
    "stories": {
      "Zanahoria": "Véase  Za nahoria  y  anís,  p.  327  PEPI NO  Russ  Parsons,  que  dirige  la  secc ión  cul inar ia  del  Los  Ang eles  Tim es,  comenta  que  las  var iedades  de  pepino t ienen  más  interés  para  el  hor­ telano  que para  el  coc inero;  todas  ellas  poseen  el  m ismo  aroma  dis ­ tin..."
    }
  },
  {
    "id": "9",
    "name": "Pepino",
    "category": "Verdes",
    "family": "Verdes",
    "description": "Ingrediente versátil de la familia Verdes.",
    "pairingNotes": [
      "Melón",
      "Menta",
      "Rosa",
      "Ruibarbo",
      "Tomate",
      "Zanahoria"
    ],
    "stories": {
      "Melón": "Véase Melón y pepino, p. 402",
      "Menta": "Más frío que un par de asesinos a sueldo. Añádale  yogur, también :fumoso por sus propiedades refrescantes, y tendrá una  especie de aire acondicionado gastronómico que se puede encontrar  a lo largo y ancho del «cinturón del tsatsiki», que se extiende entre la  India y Grecia. Se llama cacik en ...",
      "Rosa": "Tienen en común una cualidad herbácea y veraniega.  Esta afinidad natural se aprovecha y amplía en la ginebra Hendrick's,  elaborada artesanalmente y en lotes pequeños por William Grant &  Sons, de Ayrshire (Escocia). Un detalle curioso para un producto es­ cocés es que la adición de rosa búlgara...",
      "Ruibarbo": "Véase Ruibarbo y pepino, p. 367  Pepino y sandí a: Véase Sandía y pepino, p. 360",
      "Tomate": "Véase Tomate y pepino, p. 373",
      "Zanahoria": "Forman u na pareja extraordin aria en u n en ­ curtido rápido para servir con un trozo de pollo asado a la parrilla y  arroz pegajoso, o e n un espectacular sándwich. Se corta u n a zanaho­ ria gran de y u n cuarto de pepin o e n varitas gruesas. En u n colador,  se les echa una cucharadita de sa..."
    }
  },
  {
    "id": "10",
    "name": "Pimiento",
    "category": "Otros",
    "family": "Otros",
    "description": "Ingrediente versátil de la familia Otros.",
    "pairingNotes": [
      "Cebolla",
      "Guindilla",
      "Huevo",
      "Marisco",
      "Pollo",
      "Tocino",
      "Tomate"
    ],
    "stories": {
      "Cebolla": "Véase Cebolla y pimiento, p. 161",
      "Guindilla": "Véase Guindilla y pimiento, p. 302",
      "Huevo": "Recomiendo a todos los que se preguntan  extrañados por qué en Los Soprano aparece un álbum de música titu­ lado Peppers and Eggs («Pimientos y huevos »), cuando en dicho ál­ bum no figura una canci ón con ese título, que lean un artículo pu­ blicado por la doctora Maria-Grazia Inventato, directo...",
      "Marisco": "Véase Marisco y pimiento, p. 207",
      "Pollo": "Véase Pollo y pimiento, p. 43  Pimiento y queso blando: Véase Queso blando y pimiento, p. 103  296 H I ERBAS Y VERDU RAS  pimiento y ternera: Reconozcámoslo, no se va a una barbacoa a  comer bien. Hasta los buenos cocineros te ofrecen piezas asquerosas  de carne carbonizada y bandejas de pollo a ...",
      "Tocino": "La combinaci ón de tocino salado y pimiento  rojo y lustroso les da a los platos una especie de dulzura chamuscada  y ahumada sin tener que molestarse en montar la barbacoa. También  puede recordar al chorizo. Con un poco se consigue mucho; basta  con un par de lonchas y un pimiento viejo, arruga...",
      "Tomate": "Véase Tomate y pimiento, p. 373  GUINDIL LA  El picante de las guindillas puede hacer que sea dificil apreciar sus di­ versas características de sabor. Como ocurre con sus parientes cercanos,  GUINDIL LA 297"
    }
  },
  {
    "id": "11",
    "name": "Guindilla",
    "category": "Otros",
    "family": "Otros",
    "description": "Ingrediente versátil de la familia Otros.",
    "pairingNotes": [
      "Brócoli",
      "Cerdo",
      "Chocolate",
      "Coco",
      "Col",
      "Coliflor"
    ],
    "stories": {
      "Brócoli": "Véase  Brócoli  y guindilla,  p.  182  Guindilla  y  cacah ue te: ¿La  misión  del  cacahue te es  neutralizar  a la  guin dilla ? La  capsai cina,  el  sinies tro  elemento  sin  sabor  ni  olor  que  ha ce pi can tes  las  guin dillas,  es  soluble  en  grasa  pero  no  en  agu a,  y  hay  quie...",
      "Cerdo": "La  dulce  guindilla  roja  seca  se  alía con  la  carne  de  cerdo  en  los  chorizos,  que  eran  exóticos  hace  una  década, hasta  que  se  volvieron  famosos  de  repente  y  desde  entonces  adornan  los  menús  de  todo  el  mundo.  Según  la  potencia  del  pim entón  emplea­ do  para  ...",
      "Chocolate": "Véase  Chocolate  y guindilla,  p.  23",
      "Coco": "La  leche  de  coco  env uelve  los  ingredientes  tai­ landeses  en  un  abrazo  dulce  y  compasivo.  Le  quita  el  filo  cortante  a  la  lima, acalla a  la  malhablada  salsa  de  pescado  y  alivia  el  calor  de la  gu indilla,  cuyo  componente  activo, la  capsaicina,  es  soluble  en  g...",
      "Col": "El  kimchi  es  un  acompañamiento coreano  de  ver­ duras  encurtidas,  que  se  suele  elaborar  fe rmentando  col  y  guindillas  en  salmuera.  Antes  de  la  llegada  de  las  guindil las  del  Nuevo  Mundo,  la  pegada  la  apor taban  el  jengibre  y  el  ajo;  ahora  su  puesto  lo  han  ...",
      "Coliflor": "Véase  Coliflor  y guindilla,  p.  179  Guindill a  e  hígado:  Véase  Híg ado  y guindilla,  p.  59  Guindilla  y  hoj a  de  cilant ro : Se  utilizan  juntas  con  frecuencia. Las  guindillas  verdes  tienen  una  afinidad  particularmente  agradable  por  el  cilantro , aportando  una  frescur..."
    }
  },
  {
    "id": "12",
    "name": "Manzana",
    "category": "Afrutados",
    "family": "Afrutados",
    "description": "Ingrediente versátil de la familia Afrutados.",
    "pairingNotes": [
      "Almendra",
      "Anís",
      "Apio",
      "Arándano",
      "Avellana",
      "Cacahuete",
      "Calabaza",
      "Canela",
      "Cerdo",
      "Clavo",
      "Col",
      "Marisco",
      "Mora",
      "Morcilla"
    ],
    "stories": {
      "Almendra": "Se abre un crua sán de almendra , se unta una  capa espesa de que so crema en un lado y de puré de manzana en el  otro, y se cierra . Más delicioso que un strudel.",
      "Anís": "Véase Anís y manzana, p. 264",
      "Apio": "Véase Apio y manzana, p. 137",
      "Arándano": "No cabe duda de quién hace todo el trabajo  en esta sociedad. Un poco de manzana dará potencia frutal al tímido  384 AFRU TADOS FRESCOS  arándano. Pruébelo s en una tarta o un crumble; puede hacerlo con los  arándanos que compró para comer en lugar de panchitos cub iertos de  chocolate, pero que ...",
      "Avellana": "La comb inación de av ellana y manzana pue­ de hacer te desear que se termine el v erano de una v ez. Se puede re­ llenar con ellas un lomo de cerdo, elaborar una ma sa de av ellana para  el pastel de manzana o probar mi pastel de otoño. Llev a montones de  manzana. Puede que piensen que no v a a...",
      "Cacahuete": "Véase Cacahuete y manzana, p. 33",
      "Calabaza": "Véase Calabaza y manzana, p. 332",
      "Canela": "Un clásico. La e specia adorna la acidez de la  manzana con un calor dulce y ligeramente leñoso. Como el sitar en  una canción de los Stones. De manera similar, no hay que pasarse.",
      "Cerdo": "La carne de cerdos alimen tados con manzanas  fue uno de los mucho s beneficio s derivados de dejar a los cerdos co­ rretear por el manzanar. Ademá s, fertilizaban el terreno y, al cebar se  hasta alcanzar un peso saludable, lo despejaban de fruta s caídas que  podrían atraer a las plagas. De hec...",
      "Clavo": "En  opinión  de  Robert  Carrier,  un  pastel de  manzana  no  está completo  sin  un  toque  de  clavo.  Según  Elizabeth  David,  un  pastel  de  manzana  no  es  comestible  con  clavo.  No  es  que  no  quiera  comprometerme,  pero  todo  podría  depender  simplemente  de  las  manzanas  y  l...",
      "Col": "La  col  cruda  y  especiada  se  podría  emparejar  con  piña  tropical  o  naraaja  en  una  ensalada,  pero  las  manzanas  son  las  únicas  frutas  que  combinan  con  la  sulfur osa  col  cocida  a fuego  lento.  Dicho  esto,  la  col  roj a cocinada  con  manzana  y  cebolla  (con la posib...",
      "Marisco": "Para  refrescar  una  mahonesa  dulce  y  blanda  de  cangrejo,  ralle  en  ella  una  manzana  ácida  fría.",
      "Mora": "Como  Simon  y  Garfunkel:  unas  carreras  en  so­ litario  perf ectamente  respetables,  pero  juntos  pueden  llenar  el  Central  Park.  Por  cierto,  Simon  es  la  manzana,  el  socio  dominante.  La  mora  da  las  notas altas.  Las  moras  tienen  un  carácter  especiado,  aunque  no  de ...",
      "Morcilla": "Comí  por  primera  vez  esta  sencilla  combi na ­ ción  en  una  brasserie  llamada  Aux  Charpentiers,  en  el  barrio  de  St.  Germain  de  París.  Una  vez  cruzada  la  pesada  puerta,  hay  que  abrir  una  gruesa  y  descolorida  cortina  de  terciopelo  para  entrar  en  el  co­ medor. ..."
    }
  },
  {
    "id": "13",
    "name": "Jengibre",
    "category": "Especiados",
    "family": "Especiados",
    "description": "Ingrediente versátil de la familia Especiados.",
    "pairingNotes": [
      "Lima",
      "Limón",
      "Mango",
      "Melón",
      "Menta",
      "Ruibarbo",
      "Ternera",
      "Tomate"
    ],
    "stories": {
      "Lima": "Una <<mula moscovita)) combina vodka, lima y  cerveza de jengibre. Si se hace con ginger ale, se queda en burro cojo.  Unas gotas de angostura clavan una herradura de amargor metálico  en su pegada progresiva. La cerveza de jengibre es más picante, de  sabor más pleno y turbia, mientras que el gi...",
      "Limón": "Véase L imón y jengibre, p. 438",
      "Mango": "El jengibre-mango, o cúrcuma zedoaria, no está  emparentado con ninguna de estas dos plantas, aunque, como el jen­ gibre, es un rizoma. Oriundo de la India e Indonesia, tiene un gusto  que al principio es amargo y después dulce, con un sabor almizclado  y aromático que recuerda al mango verde. Se...",
      "Melón": "Véase Melón y jengibre, p. 401",
      "Menta": "La menta jengibre tiene un sabor similar al de la  menta piperita, con un ligerísimo toque de jengibre. En Estados Uni­ dos son populares los dulces y refrescos que llevan sabor a je ngibre y  menta, y una ramita de menta o unas gotas de jarabe de menta pue­ den animar el insípido ginger ale en v...",
      "Ruibarbo": "La combinación de jengibre y ruibarbo surgió  porque se consideraba que era beneficiosa para el intestino, lo que  podría explicar que todavía se sigan emparejando a pesar de que, en  mi opinión, los dos sabores parecen un poco molestos el uno con el  otro. El chef Jason Atherton los sirve encurt...",
      "Ternera": "A la ternera le encajan los sabores fuertes, y se  la encuentra emparejada con el jengibre en salteados tailandeses y  chinos, y en la crujiente carne rebozada con jengibre creada por dos  hermanas chinas en Calga1y, donde se ha convertido casi en una es­ pecialidad local. Una versión menos corri...",
      "Tomate": "Para hacer una salsa de tomate picante y con  sabor a jengibre, la señora Beeton propone cocinar aproximadamen­ te un kilo de tomates maduros en una fuente de loza a 120 ºC (marca  � del gas) durante 4-5 horas. Se dejan enfriar a temperatura an1bien­ te, se les quita la piel y se mezcla la pulpa ..."
    }
  },
  {
    "id": "14",
    "name": "Cardamomo",
    "category": "Cítricos",
    "family": "Cítricos",
    "description": "Ingrediente versátil de la familia Cítricos.",
    "pairingNotes": [
      "Albaricoque",
      "Almendra",
      "Chocolate",
      "Coco",
      "Cordero",
      "Jengibre",
      "Pera",
      "Plátano",
      "Rosa",
      "Tocino"
    ],
    "stories": {
      "Albaricoque": "El cardamomo y el albaricoque se  emparejan en piezas de repostería como las pastas danesas de albarico­ que, en crumbles y en compotas. Los albaricoques secos, cocidos en  jarabe con cardamomo, son una especialidad de Cachemir a. Tan1bién  se puede probar esta tarta de albaricoque con una lujosa...",
      "Almendra": "Los países nórdicos se llevan una canti­ dad desproporcionada de la producción mundial de cardamomo y lo  esparcen generosamente en sus pasteles, bollos y pastas. El pulla fin­ landés es un pan dulce trenzado, especiado con cardamomo. El goro  noruego es una oblea delgada y crujiente con sabor a ...",
      "Chocolate": "Véase  Chocolate  y cardamomo,  p.  21  Cardamomo  y  chocolate  blanco:  Véase  Chocolate  blanco  y  carda­ momo,  p.  503",
      "Coco": "Véase  Coco  y carda momo,  p.  410",
      "Cordero": "En  Cachemira,  el  cardamomo  se  utiliza  para  enriquecer  albóndigas  de  cordero  en  un  plato  llamado  goshtaba,  para el  que  se  machacan  concienzudamente  pequeños  trozos  de  carne  junto  con sebo, lo  que  da  como  resultado  una  mezcla  sumamente  suave,  cuya  textura  se  ha...",
      "Jengibre": "Véase  Jengibre  y  cardam omo,  p.  443",
      "Pera": "Véase  Pera  y cardamomo,  p.  392",
      "Plátano": "El  plát an o y  el  cardamomo  se  combinan  en  una  sosegante  raita.  Al gu nos  cortan  el  plátano  en  roda jas,  pero  a mí  me  gu sta  aplastar  un  par  de  plát an os  no  demasiado  maduros  y  mez­ clarlos  con  media  cucharadita  de  cardarnomo  molido,  una pizca  de  gu indilla ...",
      "Rosa": "Véase  Rosa  y  cardamomo,  p.  490  Cardamomo  y  senulla  de  cilantro : Ambas  especias  tienen  notas  cítricas  muy  evidentes.  Si  el  cardamomo  le  parece  demasiado  alcan ­ forado  para  una  receta  dulce,  «dilúyalo»  machacándolo  con  unas  se­ millas  de  cilantro.  La  agradable ...",
      "Tocino": "Los  cardamomos  negros  son parientes cer­ canos  de  los  verdes.  Tienen  el  mismo  sabor  cálido  y  aromático,  pero  CARDAMOMO  451"
    }
  },
  {
    "id": "15",
    "name": "Cardamorno",
    "category": "Otros",
    "family": "Otros",
    "description": "Ingrediente versátil de la familia Otros.",
    "pairingNotes": [
      "Mango"
    ],
    "stories": {
      "Mango": "Es  muy  popular  en  la  India.  La  brill an tez  del  cardam omo  combinada  con  la  acidez  del yogur  puede  rescatar  al  mango  excesivamente  maduro  en  un  lassi.  Se  mezcla  la pulpa  de  un  mango  con 250  g  de yogur,  125  ml  de  leche,  una  pizca  de  carda­ momo  molido  y  u..."
    }
  },
  {
    "id": "16",
    "name": "Vainilla",
    "category": "Tostados",
    "family": "Tostados",
    "description": "Ingrediente versátil de la familia Tostados.",
    "pairingNotes": ["Arándano", "Avellana", "Chocolate", "Marisco"],
    "stories": {
      "Chocolate": "Los dos son oriundos de México... la mayoría de las chocolatinas están condimentadas con vainilla."
    }
  },
  {
    "id": "17",
    "name": "Foie Gras",
    "category": "Carnes",
    "family": "Lujo",
    "description": "Hígado graso de pato u oca. Textura mantecosa y sabor profundo.",
    "pairingNotes": ["Higo", "Vino Sauternes", "Pan de Especias", "Manzana"],
    "stories": {
      "Higo": "La acidez dulce del higo corta la suntuosidad de la grasa del foie."
    }
  },
  {
    "id": "18",
    "name": "Caviar de Beluga",
    "category": "Pescados",
    "family": "Lujo",
    "description": "Huevas de esturión beluga. Sabor salino y textura cremosa que estalla en el paladar.",
    "pairingNotes": ["Vodka", "Creme Fraiche", "Blini", "Huevo duro"],
    "stories": {
      "Creme Fraiche": "La untuosidad láctica suaviza la potencia marina del caviar."
    }
  },
  {
    "id": "19",
    "name": "Azafrán",
    "category": "Especias",
    "family": "Oro Rojo",
    "description": "Estigmas de la flor Crocus sativus. Aroma metálico, floral y terroso.",
    "pairingNotes": ["Arroz", "Marisco", "Cordero", "Naranja"],
    "stories": {
      "Arroz": "El alma de la paella; aporta color dorado y un trasfondo inconfundible."
    }
  },
  {
    "id": "20",
    "name": "Wagyu A5",
    "category": "Carnes",
    "family": "Res Japonesa",
    "description": "Carne de res japonesa con marmoleo extremo. Grasa que funde a temperatura ambiente.",
    "pairingNotes": ["Sal Maldon", "Wasabi fresco", "Salsa de soja", "Ajo negro"],
    "stories": {
      "Wasabi": "El picante limpio corta la densidad de la grasa infiltrada."
    }
  },
  {
    "id": "21",
    "name": "Ajo Negro",
    "category": "Vegetales",
    "family": "Fermentados",
    "description": "Ajo fermentado con notas de regaliz, balsámico y umami profundo.",
    "pairingNotes": ["Chocolate negro", "Queso de cabra", "Setas", "Cordero"],
    "stories": {
      "Chocolate": "Un maridaje molecular sorprendente gracias a los compuestos azufrados y dulces."
    }
  },
  {
    "id": "22",
    "name": "Plancton Marino",
    "category": "Innovación",
    "family": "Esencia del Mar",
    "description": "Alimento liofilizado que concentra el sabor más puro del océano.",
    "pairingNotes": ["Arroz", "Pescado blanco", "Moluscos", "Verduras de mar"],
    "stories": {
      "Arroz": "Convierte un risotto en una explosión de sabor marino abisal."
    }
  },
  {
    "id": "23",
    "name": "Pimienta de Sichuan",
    "category": "Especias",
    "family": "Cítricos de Asia",
    "description": "Baya que produce una sensación de hormigueo y entumecimiento (parestesia).",
    "pairingNotes": ["Pato", "Chocolate", "Anís estrellado", "Guindilla"],
    "stories": {
      "Anís estrellado": "La base del 'Cinco Especias' chino, equilibrio místico."
    }
  },
  {
    "id": "24",
    "name": "Kimchi",
    "category": "Fermentados",
    "family": "Cultura Coreana",
    "description": "Col fermentada con especias. Picante, ácido y rico en probióticos.",
    "pairingNotes": ["Cerdo", "Arroz", "Huevo", "Queso Cheddar"],
    "stories": {
      "Cerdo": "La acidez del fermento ayuda a digerir la grasa del cerdo asado."
    }
  },
  {
    "id": "25",
    "name": "Miso Blanco",
    "category": "Fermentados",
    "family": "Soja Japonesa",
    "description": "Pasta de soja fermentada de corta duración. Dulce y umami suave.",
    "pairingNotes": ["Pescado azul", "Berenjena", "Mantequilla", "Jengibre"],
    "stories": {
      "Berenjena": "La Berenjena Nasu Dengaku es el ejemplo máximo de esta unión caramelizada."
    }
  },
  {
    "id": "26",
    "name": "Katsuobushi",
    "category": "Pescados",
    "family": "Preservados",
    "description": "Bonito seco, fermentado y ahumado. Base del caldo Dashi.",
    "pairingNotes": ["Alga Kombu", "Tofu", "Huevo", "Soja"],
    "stories": {
      "Alga Kombu": "La sinergia del umami: inosinato del bonito + glutamato del alga."
    }
  },
  {
    "id": "27",
    "name": "Té Matcha",
    "category": "Infusiones",
    "family": "Té Verde",
    "description": "Té verde japonés molido en piedra. Sabor vegetal intenso y amargo.",
    "pairingNotes": ["Chocolate blanco", "Fresa", "Yuzu", "Coco"],
    "stories": {
      "Chocolate blanco": "La dulzura láctica compensa el amargor tánico del té."
    }
  },
  {
    "id": "28",
    "name": "Vainilla de Tahití",
    "category": "Especias",
    "family": "Orquídeas",
    "description": "Vaina carnosa con notas florales intensas y un trasfondo anisado.",
    "pairingNotes": ["Bogavante", "Crema de leche", "Ron", "Piña"],
    "stories": {
      "Bogavante": "Un uso revolucionario de la vainilla en platos salados marinos."
    }
  },
  {
    "id": "29",
    "name": "Rábano Picante",
    "category": "Vegetales",
    "family": "Raíces Fuertes",
    "description": "Raíz con potencia nasal limpia. Similar al wasabi pero más terroso.",
    "pairingNotes": ["Roast Beef", "Remolacha", "Salmón ahumado", "Nata"],
    "stories": {
      "Remolacha": "Su dulzura terrosa necesita la 'patada' del rábano para brillar."
    }
  },
  {
    "id": "30",
    "name": "Cardamomo Verde",
    "category": "Especias",
    "family": "Cítricos de la India",
    "description": "Semillas aromáticas con notas de limón, eucalipto y alcanfor.",
    "pairingNotes": ["Café", "Cordero", "Arroz con leche", "Pistacho"],
    "stories": {
      "Café": "Tradición árabe de aromatizar el grano tostado."
    }
  },
  {
    "id": "31",
    "name": "Maltodextrina",
    "category": "Técnicos",
    "family": "Texturizantes",
    "description": "Carbohidrato que absorbe grasas, permitiendo convertir aceites en polvo.",
    "pairingNotes": ["Aceite de Oliva", "Mantequilla de cacahuete", "Tocino"],
    "stories": {
      "Aceite de Oliva": "Crea 'tierra' de aceite que se funde en la lengua."
    }
  },
  {
    "id": "32",
    "name": "Gluconolactato",
    "category": "Técnicos",
    "family": "Esferificación",
    "description": "Sal de calcio inodora. Perfecta para la esferificación inversa sin aportar amargor.",
    "pairingNotes": ["Alginato", "Lácteos", "Zumos"],
    "stories": {
      "Alginato": "El compañero necesario para crear la membrana de gelatina."
    }
  },
  {
    "id": "33",
    "name": "Goma Xantana",
    "category": "Técnicos",
    "family": "Espesantes",
    "description": "Polisacárido usado para espesar salsas y suspender partículas sin alterar el sabor.",
    "pairingNotes": ["Vinagretas", "Espumas", "Caldos fríos"],
    "stories": {
      "Vinagretas": "Mantiene la emulsión estable durante horas sin separar aceite."
    }
  },
  {
    "id": "34",
    "name": "Carragenato Kappa",
    "category": "Técnicos",
    "family": "Gelificantes",
    "description": "Extraído de algas rojas. Crea geles firmes y quebradizos.",
    "pairingNotes": ["Lácteos", "Cremas", "Nata"],
    "stories": {
      "Nata": "Ideal para crear flanes y pannaconas de textura técnica superior."
    }
  },
  {
    "id": "35",
    "name": "Metilcelulosa",
    "category": "Técnicos",
    "family": "Geles Calientes",
    "description": "Gelificante que espesa en caliente y se liquida en frío. Único en su clase.",
    "pairingNotes": ["Mousses calientes", "Espumas térmicas"],
    "stories": {
      "Mousses calientes": "Permite crear gnocchis que se funden al enfriarse en la boca."
    }
  },
  {
    "id": "36",
    "name": "Aceite de Trufa Blanca",
    "category": "Aceites",
    "family": "Aromas del Piamonte",
    "description": "Aceite infusionado con el aroma volátil de la Tuber magnatum.",
    "pairingNotes": ["Pasta fresca", "Risotto", "Huevo", "Coliflor"],
    "stories": {
      "Risotto": "Unas gotas al final de la mantecatura elevan el plato a otra dimensión."
    }
  },
  {
    "id": "37",
    "name": "Sal de Mar del Himalaya",
    "category": "Condimentos",
    "family": "Sales",
    "description": "Sal mineral de color rosáceo con trazas de hierro.",
    "pairingNotes": ["Carne a la brasa", "Chocolate negro", "Caramelo"],
    "stories": {
      "Chocolate negro": "El contraste salino potencia los matices del cacao."
    }
  },
  {
    "id": "38",
    "name": "Vinagre Balsámico Tradicional",
    "category": "Condimentos",
    "family": "Aceto",
    "description": "Vinagre envejecido durante décadas en barricas de madera. Melaza ácida.",
    "pairingNotes": ["Queso Parmesano", "Fresas", "Solomillo", "Vainilla"],
    "stories": {
      "Fresas": "La acidez añeja transforma la fruta en un postre complejo."
    }
  },
  {
    "id": "39",
    "name": "Lima Kaffir",
    "category": "Cítricos",
    "family": "Sudeste Asiático",
    "description": "Hojas e hinojos de aroma cítrico-perfumado inconfundible.",
    "pairingNotes": ["Leche de coco", "Galanga", "Pollo", "Pescado"],
    "stories": {
      "Leche de coco": "La base aromática fundamental del Curry Verde tailandés."
    }
  },
  {
    "id": "40",
    "name": "Shiso",
    "category": "Hierbas",
    "family": "Mentas Japonesas",
    "description": "Hoja con sabor a comino, menta y albahaca. Esencial en sushi.",
    "pairingNotes": ["Atún", "Ciruela Umeboshi", "Ginebra", "Pepino"],
    "stories": {
      "Atún": "Envuelve el pescado crudo aportando frescura herbácea."
    }
  },
  {
    "id": "41",
    "name": "Galanga",
    "category": "Especias",
    "family": "Rizomas",
    "description": "Pariente del jengibre pero con notas de pino y cítricos.",
    "pairingNotes": ["Lemongrass", "Chiles", "Coco", "Marisco"],
    "stories": {
      "Lemongrass": "Dúo dinámico en la sopa Tom Yum Goong."
    }
  },
  {
    "id": "42",
    "name": "Huevo de Pato",
    "category": "Lácteos/Huevos",
    "family": "Aves",
    "description": "Huevo de yema más grande y rica en lípidos que el de gallina.",
    "pairingNotes": ["Espárragos", "Tocino", "Trufa", "Brioche"],
    "stories": {
      "Espárragos": "La yema densa actúa como una salsa holandesa natural."
    }
  },
  {
    "id": "43",
    "name": "Anguila Ahumada",
    "category": "Pescados",
    "family": "Ríos",
    "description": "Pescado azul de carne grasa y textura firme, potenciado por el humo.",
    "pairingNotes": ["Manzana verde", "Foie Gras", "Remolacha", "Mostaza"],
    "stories": {
      "Foie Gras": "La combinación 'Milhojas de Anguila y Foie' es un icono de la alta cocina."
    }
  },
  {
    "id": "44",
    "name": "Achiote",
    "category": "Especias",
    "family": "Centroamérica",
    "description": "Semillas rojas que aportan color vibrante y sabor terroso.",
    "pairingNotes": ["Cerdo", "Naranja amarga", "Ajo", "Orégano"],
    "stories": {
      "Cerdo": "Ingrediente clave de la Cochinita Pibil yuchateca."
    }
  },
  {
    "id": "45",
    "name": "Hava Tonka",
    "category": "Especias",
    "family": "Amazonas",
    "description": "Semilla con aroma a clavo, vainilla, almendra y canela. Muy potente.",
    "pairingNotes": ["Chocolate", "Cereza", "Nata", "Café"],
    "stories": {
      "Cereza": "Potencia el carácter de almendra amarga del hueso de la cereza."
    }
  },
  {
    "id": "46",
    "name": "Wasabi Fresco",
    "category": "Condimentos",
    "family": "Raíces Japonesas",
    "description": "Raíz de Eutrema japonicum rallada al momento. Picante fugaz y dulce.",
    "pairingNotes": ["Sashimi", "Salsa de soja", "Tofu", "Ostras"],
    "stories": {
      "Sashimi": "El picante despeja la nariz antes de saborear la untuosidad del pescado."
    }
  },
  {
    "id": "47",
    "name": "Ondulado de Calamar",
    "category": "Mariscos",
    "family": "Cefalópodos",
    "description": "Calamar finamente tallado para texturas crujientes al mínimo contacto térmico.",
    "pairingNotes": ["Alioli de lima", "Aceite de perejil", "Pimentón"],
    "stories": {
      "Alioli de lima": "Equilibrio graso-ácido que realza la dulzura del calamar joven."
    }
  },
  {
    "id": "48",
    "name": "Setas Shiitake",
    "category": "Hongos",
    "family": "Asia",
    "description": "Hongos con textura carnosa y alto contenido en umami natural.",
    "pairingNotes": ["Soja", "Pak Choi", "Pollo", "Ajo"],
    "stories": {
      "Soja": "Potencia la sensación de 'carne vegetal' del hongo."
    }
  },
  {
    "id": "49",
    "name": "Alga Kombu",
    "category": "Vegetales de mar",
    "family": "Algas",
    "description": "Alga gruesa rica en ácido glutámico. El sabor umami sólido.",
    "pairingNotes": ["Dashi", "Garbanzos", "Pescado", "Agua"],
    "stories": {
      "Garbanzos": "Ayuda a ablandar las legumbres y aumenta su digestibilidad."
    }
  },
  {
    "id": "50",
    "name": "Flores de Calabacín",
    "category": "Vegetales",
    "family": "Flores Comestibles",
    "description": "Flores delicadas ideales para rellenar o freír en tempura.",
    "pairingNotes": ["Queso Ricotta", "Anchoas", "Miel", "Limón"],
    "stories": {
      "Queso Ricotta": "Relleno clásico italiano para un bocado frágil y suntuoso."
    }
  }
];