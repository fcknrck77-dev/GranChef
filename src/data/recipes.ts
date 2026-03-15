export interface Recipe {
  id: string;
  title: string;
  source: string;
  difficulty: 'Intermedio' | 'Avanzado' | 'Maestro';
  prepTime: string;
  description: string;
  ingredients: { name: string; amount: string }[];
  steps: string[];
  techStack: string[];
  tier: 'FREE' | 'PRO' | 'PREMIUM';
}

export const recipes: Recipe[] = [
  {
    "id": "r1",
    "title": "Sashimi de At·n con Esferas de Soja",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Intermedio",
    "prepTime": "45 min",
    "description": "Una receta exclusiva de nivel FREE para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t2"
    ],
    "tier": "FREE"
  },
  {
    "id": "r2",
    "title": "Espuma de Patata y Trufa",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Intermedio",
    "prepTime": "45 min",
    "description": "Una receta exclusiva de nivel FREE para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t2"
    ],
    "tier": "FREE"
  },
  {
    "id": "r3",
    "title": "Risotto de Plancton Marino",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Intermedio",
    "prepTime": "45 min",
    "description": "Una receta exclusiva de nivel FREE para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t2"
    ],
    "tier": "FREE"
  },
  {
    "id": "r4",
    "title": "Solomillo Sous-Vide con Reducci¾n de Oporto",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Intermedio",
    "prepTime": "45 min",
    "description": "Una receta exclusiva de nivel FREE para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t2"
    ],
    "tier": "FREE"
  },
  {
    "id": "r5",
    "title": "Texturas de Chocolate 70%",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Intermedio",
    "prepTime": "45 min",
    "description": "Una receta exclusiva de nivel FREE para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t2"
    ],
    "tier": "FREE"
  },
  {
    "id": "r6",
    "title": "Berenjena Miso Glaseada",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Intermedio",
    "prepTime": "45 min",
    "description": "Una receta exclusiva de nivel FREE para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t2"
    ],
    "tier": "FREE"
  },
  {
    "id": "r7",
    "title": "Vieiras con Coulis de Coral",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Intermedio",
    "prepTime": "45 min",
    "description": "Una receta exclusiva de nivel FREE para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t2"
    ],
    "tier": "FREE"
  },
  {
    "id": "r8",
    "title": "Gazpacho Transl·cido de Tomate",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Intermedio",
    "prepTime": "45 min",
    "description": "Una receta exclusiva de nivel FREE para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t2"
    ],
    "tier": "FREE"
  },
  {
    "id": "r9",
    "title": "Aire de Zanahoria y Jengibre",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Avanzado",
    "prepTime": "45 min",
    "description": "Una receta exclusiva de nivel PRO para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t2"
    ],
    "tier": "PRO"
  },
  {
    "id": "r10",
    "title": "Esferas de Olivo y Anchoa",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Avanzado",
    "prepTime": "45 min",
    "description": "Una receta exclusiva de nivel PRO para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t2"
    ],
    "tier": "PRO"
  },
  {
    "id": "r11",
    "title": "Cordero en Costra de Hierbas",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Avanzado",
    "prepTime": "45 min",
    "description": "Una receta exclusiva de nivel PRO para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t2"
    ],
    "tier": "PRO"
  },
  {
    "id": "r12",
    "title": "Panna Cotta de Coco y Lima",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Avanzado",
    "prepTime": "45 min",
    "description": "Una receta exclusiva de nivel PRO para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t2"
    ],
    "tier": "PRO"
  },
  {
    "id": "r13",
    "title": "Carpaccio de Gamba Roja",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Avanzado",
    "prepTime": "45 min",
    "description": "Una receta exclusiva de nivel PRO para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t2"
    ],
    "tier": "PRO"
  },
  {
    "id": "r14",
    "title": "Magret de Pato con Peras al Vino",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Avanzado",
    "prepTime": "45 min",
    "description": "Una receta exclusiva de nivel PRO para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t2"
    ],
    "tier": "PRO"
  },
  {
    "id": "r15",
    "title": "Salm¾n Marinado en Remolacha",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Avanzado",
    "prepTime": "45 min",
    "description": "Una receta exclusiva de nivel PRO para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t2"
    ],
    "tier": "PRO"
  },
  {
    "id": "r16",
    "title": "Ravioli de Calabaza y Amaretti",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Avanzado",
    "prepTime": "45 min",
    "description": "Una receta exclusiva de nivel PRO para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t2"
    ],
    "tier": "PRO"
  },
  {
    "id": "r17",
    "title": "Gnocchi de Queso con Trufa",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Avanzado",
    "prepTime": "45 min",
    "description": "Una receta exclusiva de nivel PRO para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t2"
    ],
    "tier": "PRO"
  },
  {
    "id": "r18",
    "title": "Tarta Tatin Reconstruida",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Avanzado",
    "prepTime": "45 min",
    "description": "Una receta exclusiva de nivel PRO para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t2"
    ],
    "tier": "PRO"
  },
  {
    "id": "r19",
    "title": "Sorberte de Albahaca y Lim¾n",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Avanzado",
    "prepTime": "45 min",
    "description": "Una receta exclusiva de nivel PRO para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t2"
    ],
    "tier": "PRO"
  },
  {
    "id": "r20",
    "title": "Bogavante con Vainilla de TahitÝ",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Avanzado",
    "prepTime": "45 min",
    "description": "Una receta exclusiva de nivel PRO para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t2"
    ],
    "tier": "PRO"
  },
  {
    "id": "r21",
    "title": "Hummus de Ajo Negro",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Avanzado",
    "prepTime": "45 min",
    "description": "Una receta exclusiva de nivel PRO para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t2"
    ],
    "tier": "PRO"
  },
  {
    "id": "r22",
    "title": "Pulpo a la Llama con Espuma de Piment¾n",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Avanzado",
    "prepTime": "45 min",
    "description": "Una receta exclusiva de nivel PRO para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t2"
    ],
    "tier": "PRO"
  },
  {
    "id": "r23",
    "title": "Mousse de Foie con Gel de Higos",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Avanzado",
    "prepTime": "45 min",
    "description": "Una receta exclusiva de nivel PRO para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t2"
    ],
    "tier": "PRO"
  },
  {
    "id": "r24",
    "title": "Ostra con Aire de Pepino",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Avanzado",
    "prepTime": "45 min",
    "description": "Una receta exclusiva de nivel PRO para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t2"
    ],
    "tier": "PRO"
  },
  {
    "id": "r25",
    "title": "Tartar de Ciervo y Bayas",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Avanzado",
    "prepTime": "45 min",
    "description": "Una receta exclusiva de nivel PRO para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t2"
    ],
    "tier": "PRO"
  },
  {
    "id": "r26",
    "title": "Lomo de Bacalao con Pil-Pil de Plancton",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Avanzado",
    "prepTime": "45 min",
    "description": "Una receta exclusiva de nivel PRO para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t2"
    ],
    "tier": "PRO"
  },
  {
    "id": "r27",
    "title": "Alcachofas con Jam¾n y Yema",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Avanzado",
    "prepTime": "45 min",
    "description": "Una receta exclusiva de nivel PRO para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t2"
    ],
    "tier": "PRO"
  },
  {
    "id": "r28",
    "title": "Postre de Frutos Rojos y Nitr¾geno",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Avanzado",
    "prepTime": "45 min",
    "description": "Una receta exclusiva de nivel PRO para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t2"
    ],
    "tier": "PRO"
  },
  {
    "id": "r29",
    "title": "Ceviche de Corvina con Leche de Tigre de Maracuyß",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Avanzado",
    "prepTime": "45 min",
    "description": "Una receta exclusiva de nivel PRO para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t2"
    ],
    "tier": "PRO"
  },
  {
    "id": "r30",
    "title": "Carrillera de Ternera Glaseada",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Avanzado",
    "prepTime": "45 min",
    "description": "Una receta exclusiva de nivel PRO para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t2"
    ],
    "tier": "PRO"
  },
  {
    "id": "r31",
    "title": "Huevo a 64 grados con Setas de Temporada",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Avanzado",
    "prepTime": "45 min",
    "description": "Una receta exclusiva de nivel PRO para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t2"
    ],
    "tier": "PRO"
  },
  {
    "id": "r32",
    "title": "Canel¾n de Aguacate y Cangrejo",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Avanzado",
    "prepTime": "45 min",
    "description": "Una receta exclusiva de nivel PRO para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t2"
    ],
    "tier": "PRO"
  },
  {
    "id": "r33",
    "title": "Lubina en Sal de CÝtricos",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Avanzado",
    "prepTime": "45 min",
    "description": "Una receta exclusiva de nivel PRO para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t2"
    ],
    "tier": "PRO"
  },
  {
    "id": "r34",
    "title": "Tempura de Flores con Miel de Flores",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Avanzado",
    "prepTime": "45 min",
    "description": "Una receta exclusiva de nivel PRO para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t2"
    ],
    "tier": "PRO"
  },
  {
    "id": "r35",
    "title": "Guisante Lagrima con Tocino",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Avanzado",
    "prepTime": "45 min",
    "description": "Una receta exclusiva de nivel PRO para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t2"
    ],
    "tier": "PRO"
  },
  {
    "id": "r36",
    "title": "ConsomÚ Clarificado de Ave",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Avanzado",
    "prepTime": "45 min",
    "description": "Una receta exclusiva de nivel PRO para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t2"
    ],
    "tier": "PRO"
  },
  {
    "id": "r37",
    "title": "Espßrrago Blanco con Holandesa de Naranja",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Avanzado",
    "prepTime": "45 min",
    "description": "Una receta exclusiva de nivel PRO para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t2"
    ],
    "tier": "PRO"
  },
  {
    "id": "r38",
    "title": "Gelatina de Gin-Tonic",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Avanzado",
    "prepTime": "45 min",
    "description": "Una receta exclusiva de nivel PRO para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t2"
    ],
    "tier": "PRO"
  },
  {
    "id": "r39",
    "title": "Falso Caviar de CafÚ",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Avanzado",
    "prepTime": "45 min",
    "description": "Una receta exclusiva de nivel PRO para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t2"
    ],
    "tier": "PRO"
  },
  {
    "id": "r40",
    "title": "Brioche de Rans con Anguila Ahumada",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Avanzado",
    "prepTime": "45 min",
    "description": "Una receta exclusiva de nivel PRO para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t2"
    ],
    "tier": "PRO"
  },
  {
    "id": "r41",
    "title": "Tataki de Ternera con Wasabi",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Maestro",
    "prepTime": "120 min",
    "description": "Una receta exclusiva de nivel PREMIUM para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t1",
      "t3"
    ],
    "tier": "PREMIUM"
  },
  {
    "id": "r42",
    "title": "Navajas con Vinagreta de Lima y Chile",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Maestro",
    "prepTime": "120 min",
    "description": "Una receta exclusiva de nivel PREMIUM para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t1",
      "t3"
    ],
    "tier": "PREMIUM"
  },
  {
    "id": "r43",
    "title": "Mochi de TÚ Matcha",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Maestro",
    "prepTime": "120 min",
    "description": "Una receta exclusiva de nivel PREMIUM para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t1",
      "t3"
    ],
    "tier": "PREMIUM"
  },
  {
    "id": "r44",
    "title": "Macaron de Ganache de Queso Azul",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Maestro",
    "prepTime": "120 min",
    "description": "Una receta exclusiva de nivel PREMIUM para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t1",
      "t3"
    ],
    "tier": "PREMIUM"
  },
  {
    "id": "r45",
    "title": "Sopa de Cebolla Moderna",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Maestro",
    "prepTime": "120 min",
    "description": "Una receta exclusiva de nivel PREMIUM para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t1",
      "t3"
    ],
    "tier": "PREMIUM"
  },
  {
    "id": "r46",
    "title": "Pescado de Roca con Suquet Concentrado",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Maestro",
    "prepTime": "120 min",
    "description": "Una receta exclusiva de nivel PREMIUM para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t1",
      "t3"
    ],
    "tier": "PREMIUM"
  },
  {
    "id": "r47",
    "title": "Codorniz Rellena de Frutos Secos",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Maestro",
    "prepTime": "120 min",
    "description": "Una receta exclusiva de nivel PREMIUM para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t1",
      "t3"
    ],
    "tier": "PREMIUM"
  },
  {
    "id": "r48",
    "title": "Ensalada de Brotes y Flores",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Maestro",
    "prepTime": "120 min",
    "description": "Una receta exclusiva de nivel PREMIUM para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t1",
      "t3"
    ],
    "tier": "PREMIUM"
  },
  {
    "id": "r49",
    "title": "TuÚtano Asado con Hierbas Frescas",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Maestro",
    "prepTime": "120 min",
    "description": "Una receta exclusiva de nivel PREMIUM para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t1",
      "t3"
    ],
    "tier": "PREMIUM"
  },
  {
    "id": "r50",
    "title": "Fritura de Ortiguillas de Mar",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Maestro",
    "prepTime": "120 min",
    "description": "Una receta exclusiva de nivel PREMIUM para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t1",
      "t3"
    ],
    "tier": "PREMIUM"
  },
  {
    "id": "r51",
    "title": "Sashimi de At·n con Esferas de Soja (Variaci¾n 1)",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Maestro",
    "prepTime": "120 min",
    "description": "Una receta exclusiva de nivel PREMIUM para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t1",
      "t3"
    ],
    "tier": "PREMIUM"
  },
  {
    "id": "r52",
    "title": "Espuma de Patata y Trufa (Variaci¾n 1)",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Maestro",
    "prepTime": "120 min",
    "description": "Una receta exclusiva de nivel PREMIUM para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t1",
      "t3"
    ],
    "tier": "PREMIUM"
  },
  {
    "id": "r53",
    "title": "Risotto de Plancton Marino (Variaci¾n 1)",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Maestro",
    "prepTime": "120 min",
    "description": "Una receta exclusiva de nivel PREMIUM para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t1",
      "t3"
    ],
    "tier": "PREMIUM"
  },
  {
    "id": "r54",
    "title": "Solomillo Sous-Vide con Reducci¾n de Oporto (Variaci¾n 1)",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Maestro",
    "prepTime": "120 min",
    "description": "Una receta exclusiva de nivel PREMIUM para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t1",
      "t3"
    ],
    "tier": "PREMIUM"
  },
  {
    "id": "r55",
    "title": "Texturas de Chocolate 70% (Variaci¾n 1)",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Maestro",
    "prepTime": "120 min",
    "description": "Una receta exclusiva de nivel PREMIUM para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t1",
      "t3"
    ],
    "tier": "PREMIUM"
  },
  {
    "id": "r56",
    "title": "Berenjena Miso Glaseada (Variaci¾n 1)",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Maestro",
    "prepTime": "120 min",
    "description": "Una receta exclusiva de nivel PREMIUM para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t1",
      "t3"
    ],
    "tier": "PREMIUM"
  },
  {
    "id": "r57",
    "title": "Vieiras con Coulis de Coral (Variaci¾n 1)",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Maestro",
    "prepTime": "120 min",
    "description": "Una receta exclusiva de nivel PREMIUM para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t1",
      "t3"
    ],
    "tier": "PREMIUM"
  },
  {
    "id": "r58",
    "title": "Gazpacho Transl·cido de Tomate (Variaci¾n 1)",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Maestro",
    "prepTime": "120 min",
    "description": "Una receta exclusiva de nivel PREMIUM para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t1",
      "t3"
    ],
    "tier": "PREMIUM"
  },
  {
    "id": "r59",
    "title": "Aire de Zanahoria y Jengibre (Variaci¾n 1)",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Maestro",
    "prepTime": "120 min",
    "description": "Una receta exclusiva de nivel PREMIUM para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t1",
      "t3"
    ],
    "tier": "PREMIUM"
  },
  {
    "id": "r60",
    "title": "Esferas de Olivo y Anchoa (Variaci¾n 1)",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Maestro",
    "prepTime": "120 min",
    "description": "Una receta exclusiva de nivel PREMIUM para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t1",
      "t3"
    ],
    "tier": "PREMIUM"
  },
  {
    "id": "r61",
    "title": "Cordero en Costra de Hierbas (Variaci¾n 1)",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Maestro",
    "prepTime": "120 min",
    "description": "Una receta exclusiva de nivel PREMIUM para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t1",
      "t3"
    ],
    "tier": "PREMIUM"
  },
  {
    "id": "r62",
    "title": "Panna Cotta de Coco y Lima (Variaci¾n 1)",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Maestro",
    "prepTime": "120 min",
    "description": "Una receta exclusiva de nivel PREMIUM para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t1",
      "t3"
    ],
    "tier": "PREMIUM"
  },
  {
    "id": "r63",
    "title": "Carpaccio de Gamba Roja (Variaci¾n 1)",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Maestro",
    "prepTime": "120 min",
    "description": "Una receta exclusiva de nivel PREMIUM para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t1",
      "t3"
    ],
    "tier": "PREMIUM"
  },
  {
    "id": "r64",
    "title": "Magret de Pato con Peras al Vino (Variaci¾n 1)",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Maestro",
    "prepTime": "120 min",
    "description": "Una receta exclusiva de nivel PREMIUM para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t1",
      "t3"
    ],
    "tier": "PREMIUM"
  },
  {
    "id": "r65",
    "title": "Salm¾n Marinado en Remolacha (Variaci¾n 1)",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Maestro",
    "prepTime": "120 min",
    "description": "Una receta exclusiva de nivel PREMIUM para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t1",
      "t3"
    ],
    "tier": "PREMIUM"
  },
  {
    "id": "r66",
    "title": "Ravioli de Calabaza y Amaretti (Variaci¾n 1)",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Maestro",
    "prepTime": "120 min",
    "description": "Una receta exclusiva de nivel PREMIUM para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t1",
      "t3"
    ],
    "tier": "PREMIUM"
  },
  {
    "id": "r67",
    "title": "Gnocchi de Queso con Trufa (Variaci¾n 1)",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Maestro",
    "prepTime": "120 min",
    "description": "Una receta exclusiva de nivel PREMIUM para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t1",
      "t3"
    ],
    "tier": "PREMIUM"
  },
  {
    "id": "r68",
    "title": "Tarta Tatin Reconstruida (Variaci¾n 1)",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Maestro",
    "prepTime": "120 min",
    "description": "Una receta exclusiva de nivel PREMIUM para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t1",
      "t3"
    ],
    "tier": "PREMIUM"
  },
  {
    "id": "r69",
    "title": "Sorberte de Albahaca y Lim¾n (Variaci¾n 1)",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Maestro",
    "prepTime": "120 min",
    "description": "Una receta exclusiva de nivel PREMIUM para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t1",
      "t3"
    ],
    "tier": "PREMIUM"
  },
  {
    "id": "r70",
    "title": "Bogavante con Vainilla de TahitÝ (Variaci¾n 1)",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Maestro",
    "prepTime": "120 min",
    "description": "Una receta exclusiva de nivel PREMIUM para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t1",
      "t3"
    ],
    "tier": "PREMIUM"
  },
  {
    "id": "r71",
    "title": "Hummus de Ajo Negro (Variaci¾n 1)",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Maestro",
    "prepTime": "120 min",
    "description": "Una receta exclusiva de nivel PREMIUM para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t1",
      "t3"
    ],
    "tier": "PREMIUM"
  },
  {
    "id": "r72",
    "title": "Pulpo a la Llama con Espuma de Piment¾n (Variaci¾n 1)",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Maestro",
    "prepTime": "120 min",
    "description": "Una receta exclusiva de nivel PREMIUM para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t1",
      "t3"
    ],
    "tier": "PREMIUM"
  },
  {
    "id": "r73",
    "title": "Mousse de Foie con Gel de Higos (Variaci¾n 1)",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Maestro",
    "prepTime": "120 min",
    "description": "Una receta exclusiva de nivel PREMIUM para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t1",
      "t3"
    ],
    "tier": "PREMIUM"
  },
  {
    "id": "r74",
    "title": "Ostra con Aire de Pepino (Variaci¾n 1)",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Maestro",
    "prepTime": "120 min",
    "description": "Una receta exclusiva de nivel PREMIUM para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t1",
      "t3"
    ],
    "tier": "PREMIUM"
  },
  {
    "id": "r75",
    "title": "Tartar de Ciervo y Bayas (Variaci¾n 1)",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Maestro",
    "prepTime": "120 min",
    "description": "Una receta exclusiva de nivel PREMIUM para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t1",
      "t3"
    ],
    "tier": "PREMIUM"
  },
  {
    "id": "r76",
    "title": "Lomo de Bacalao con Pil-Pil de Plancton (Variaci¾n 1)",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Maestro",
    "prepTime": "120 min",
    "description": "Una receta exclusiva de nivel PREMIUM para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t1",
      "t3"
    ],
    "tier": "PREMIUM"
  },
  {
    "id": "r77",
    "title": "Alcachofas con Jam¾n y Yema (Variaci¾n 1)",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Maestro",
    "prepTime": "120 min",
    "description": "Una receta exclusiva de nivel PREMIUM para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t1",
      "t3"
    ],
    "tier": "PREMIUM"
  },
  {
    "id": "r78",
    "title": "Postre de Frutos Rojos y Nitr¾geno (Variaci¾n 1)",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Maestro",
    "prepTime": "120 min",
    "description": "Una receta exclusiva de nivel PREMIUM para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t1",
      "t3"
    ],
    "tier": "PREMIUM"
  },
  {
    "id": "r79",
    "title": "Ceviche de Corvina con Leche de Tigre de Maracuyß (Variaci¾n 1)",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Maestro",
    "prepTime": "120 min",
    "description": "Una receta exclusiva de nivel PREMIUM para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t1",
      "t3"
    ],
    "tier": "PREMIUM"
  },
  {
    "id": "r80",
    "title": "Carrillera de Ternera Glaseada (Variaci¾n 1)",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Maestro",
    "prepTime": "120 min",
    "description": "Una receta exclusiva de nivel PREMIUM para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t1",
      "t3"
    ],
    "tier": "PREMIUM"
  },
  {
    "id": "r81",
    "title": "Huevo a 64 grados con Setas de Temporada (Variaci¾n 1)",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Maestro",
    "prepTime": "120 min",
    "description": "Una receta exclusiva de nivel PREMIUM para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t1",
      "t3"
    ],
    "tier": "PREMIUM"
  },
  {
    "id": "r82",
    "title": "Canel¾n de Aguacate y Cangrejo (Variaci¾n 1)",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Maestro",
    "prepTime": "120 min",
    "description": "Una receta exclusiva de nivel PREMIUM para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t1",
      "t3"
    ],
    "tier": "PREMIUM"
  },
  {
    "id": "r83",
    "title": "Lubina en Sal de CÝtricos (Variaci¾n 1)",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Maestro",
    "prepTime": "120 min",
    "description": "Una receta exclusiva de nivel PREMIUM para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t1",
      "t3"
    ],
    "tier": "PREMIUM"
  },
  {
    "id": "r84",
    "title": "Tempura de Flores con Miel de Flores (Variaci¾n 1)",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Maestro",
    "prepTime": "120 min",
    "description": "Una receta exclusiva de nivel PREMIUM para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t1",
      "t3"
    ],
    "tier": "PREMIUM"
  },
  {
    "id": "r85",
    "title": "Guisante Lagrima con Tocino (Variaci¾n 1)",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Maestro",
    "prepTime": "120 min",
    "description": "Una receta exclusiva de nivel PREMIUM para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t1",
      "t3"
    ],
    "tier": "PREMIUM"
  },
  {
    "id": "r86",
    "title": "ConsomÚ Clarificado de Ave (Variaci¾n 1)",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Maestro",
    "prepTime": "120 min",
    "description": "Una receta exclusiva de nivel PREMIUM para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t1",
      "t3"
    ],
    "tier": "PREMIUM"
  },
  {
    "id": "r87",
    "title": "Espßrrago Blanco con Holandesa de Naranja (Variaci¾n 1)",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Maestro",
    "prepTime": "120 min",
    "description": "Una receta exclusiva de nivel PREMIUM para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t1",
      "t3"
    ],
    "tier": "PREMIUM"
  },
  {
    "id": "r88",
    "title": "Gelatina de Gin-Tonic (Variaci¾n 1)",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Maestro",
    "prepTime": "120 min",
    "description": "Una receta exclusiva de nivel PREMIUM para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t1",
      "t3"
    ],
    "tier": "PREMIUM"
  },
  {
    "id": "r89",
    "title": "Falso Caviar de CafÚ (Variaci¾n 1)",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Maestro",
    "prepTime": "120 min",
    "description": "Una receta exclusiva de nivel PREMIUM para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t1",
      "t3"
    ],
    "tier": "PREMIUM"
  },
  {
    "id": "r90",
    "title": "Brioche de Rans con Anguila Ahumada (Variaci¾n 1)",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Maestro",
    "prepTime": "120 min",
    "description": "Una receta exclusiva de nivel PREMIUM para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t1",
      "t3"
    ],
    "tier": "PREMIUM"
  },
  {
    "id": "r91",
    "title": "Tataki de Ternera con Wasabi (Variaci¾n 1)",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Maestro",
    "prepTime": "120 min",
    "description": "Una receta exclusiva de nivel PREMIUM para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t1",
      "t3"
    ],
    "tier": "PREMIUM"
  },
  {
    "id": "r92",
    "title": "Navajas con Vinagreta de Lima y Chile (Variaci¾n 1)",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Maestro",
    "prepTime": "120 min",
    "description": "Una receta exclusiva de nivel PREMIUM para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t1",
      "t3"
    ],
    "tier": "PREMIUM"
  },
  {
    "id": "r93",
    "title": "Mochi de TÚ Matcha (Variaci¾n 1)",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Maestro",
    "prepTime": "120 min",
    "description": "Una receta exclusiva de nivel PREMIUM para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t1",
      "t3"
    ],
    "tier": "PREMIUM"
  },
  {
    "id": "r94",
    "title": "Macaron de Ganache de Queso Azul (Variaci¾n 1)",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Maestro",
    "prepTime": "120 min",
    "description": "Una receta exclusiva de nivel PREMIUM para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t1",
      "t3"
    ],
    "tier": "PREMIUM"
  },
  {
    "id": "r95",
    "title": "Sopa de Cebolla Moderna (Variaci¾n 1)",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Maestro",
    "prepTime": "120 min",
    "description": "Una receta exclusiva de nivel PREMIUM para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t1",
      "t3"
    ],
    "tier": "PREMIUM"
  },
  {
    "id": "r96",
    "title": "Pescado de Roca con Suquet Concentrado (Variaci¾n 1)",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Maestro",
    "prepTime": "120 min",
    "description": "Una receta exclusiva de nivel PREMIUM para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t1",
      "t3"
    ],
    "tier": "PREMIUM"
  },
  {
    "id": "r97",
    "title": "Codorniz Rellena de Frutos Secos (Variaci¾n 1)",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Maestro",
    "prepTime": "120 min",
    "description": "Una receta exclusiva de nivel PREMIUM para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t1",
      "t3"
    ],
    "tier": "PREMIUM"
  },
  {
    "id": "r98",
    "title": "Ensalada de Brotes y Flores (Variaci¾n 1)",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Maestro",
    "prepTime": "120 min",
    "description": "Una receta exclusiva de nivel PREMIUM para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t1",
      "t3"
    ],
    "tier": "PREMIUM"
  },
  {
    "id": "r99",
    "title": "TuÚtano Asado con Hierbas Frescas (Variaci¾n 1)",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Maestro",
    "prepTime": "120 min",
    "description": "Una receta exclusiva de nivel PREMIUM para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t1",
      "t3"
    ],
    "tier": "PREMIUM"
  },
  {
    "id": "r100",
    "title": "Fritura de Ortiguillas de Mar (Variaci¾n 2)",
    "source": "GrandChef Encyclopedia",
    "difficulty": "Maestro",
    "prepTime": "120 min",
    "description": "Una receta exclusiva de nivel PREMIUM para el laboratorio GrandChef.",
    "ingredients": [
      {
        "name": "Base Culinaria",
        "amount": "100g"
      },
      {
        "name": "Elemento de Contraste",
        "amount": "50g"
      }
    ],
    "steps": [
      "Preparaci¾n de la materia prima.",
      "Ejecuci¾n de la tÚcnica tÚcnica principal.",
      "Finalizaci¾n y detalles de presentaci¾n."
    ],
    "techStack": [
      "t1",
      "t3"
    ],
    "tier": "PREMIUM"
  }
];
