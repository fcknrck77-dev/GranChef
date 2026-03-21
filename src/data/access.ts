export type AccessLevel = 'FREE' | 'PRO' | 'PREMIUM' | 'ENTERPRISE' | 'ADMIN';

export interface UserAccess {
  level: AccessLevel;
  price: string;
  features: {
    ingredientsLimit: number;
    techniquesLimit: number;
    recipesLimit: number;
    coursesLimit: number;
    scientificDataEnabled: boolean;
    aiSimulationEnabled: boolean;
    networkingEnabled: boolean;
  };
}

export const TRIAL_DAYS = 7;

export const ACCESS_CONFIGS: Record<AccessLevel, UserAccess> = {
  FREE: {
    level: 'FREE',
    price: '0€',
    features: {
      ingredientsLimit: 200, // Now 200 items in lab, but maybe only first few visible?
      techniquesLimit: 100,
      recipesLimit: 10,
      coursesLimit: 20,
      scientificDataEnabled: false,
      aiSimulationEnabled: false,
      networkingEnabled: false,
    }
  },
  PRO: {
    level: 'PRO',
    price: '39€',
    features: {
      ingredientsLimit: 200,
      techniquesLimit: 100,
      recipesLimit: 200,
      coursesLimit: 40,
      scientificDataEnabled: true,
      aiSimulationEnabled: false,
      networkingEnabled: false,
    }
  },
  PREMIUM: {
    level: 'PREMIUM',
    price: '69€',
    features: {
      ingredientsLimit: 200,
      techniquesLimit: 100,
      recipesLimit: 200,
      coursesLimit: 60,
      scientificDataEnabled: true,
      aiSimulationEnabled: true,
      networkingEnabled: true, // Ver ofertas y postular
    }
  },
  ENTERPRISE: {
    level: 'ENTERPRISE',
    price: '149€',
    features: {
      ingredientsLimit: 200,
      techniquesLimit: 100,
      recipesLimit: 200,
      coursesLimit: 60,
      scientificDataEnabled: true,
      aiSimulationEnabled: true,
      networkingEnabled: true, // Publicar ofertas y ver perfiles
    }
  },
ADMIN: {
    level: 'ADMIN',
    price: 'N/A',
    features: {
      ingredientsLimit: 200,
      techniquesLimit: 100,
      recipesLimit: 200,
      coursesLimit: 60,
      scientificDataEnabled: true,
      aiSimulationEnabled: true,
      networkingEnabled: true,
    }
  }
};
