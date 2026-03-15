export type AccessLevel = 'FREE' | 'PRO' | 'PREMIUM' | 'ADMIN';

export interface UserAccess {
  level: AccessLevel;
  price: string;
  features: {
    ingredientsLimit: number;
    techniquesLimit: number;
    recipesLimit: number;
    scientificDataEnabled: boolean;
    aiSimulationEnabled: boolean;
  };
}

export const ACCESS_CONFIGS: Record<AccessLevel, UserAccess> = {
  FREE: {
    level: 'FREE',
    price: '0€',
    features: {
      ingredientsLimit: 10,
      techniquesLimit: 5,
      recipesLimit: 8,
      scientificDataEnabled: false,
      aiSimulationEnabled: false,
    }
  },
  PRO: {
    level: 'PRO',
    price: '19€',
    features: {
      ingredientsLimit: 25,
      techniquesLimit: 15,
      recipesLimit: 40,
      scientificDataEnabled: true,
      aiSimulationEnabled: false,
    }
  },
  PREMIUM: {
    level: 'PREMIUM',
    price: '49€',
    features: {
      ingredientsLimit: 50,
      techniquesLimit: 30,
      recipesLimit: 100,
      scientificDataEnabled: true,
      aiSimulationEnabled: true,
    }
  },
ADMIN: {
    level: 'ADMIN',
    price: 'N/A',
    features: {
      ingredientsLimit: 50,
      techniquesLimit: 30,
      recipesLimit: 100,
      scientificDataEnabled: true,
      aiSimulationEnabled: true,
    }
  }
};
