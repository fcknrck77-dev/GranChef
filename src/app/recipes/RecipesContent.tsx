'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ACCESS_CONFIGS, AccessLevel } from '@/data/access';
import { useUserAuth } from '@/context/UserAuthContext';
import { useAdminAuth } from '@/context/AdminAuthContext';
import DetailModal from '@/components/DetailModal';
import { getSupabase } from '@/lib/supabaseClient';

export interface Ingredient {
  id: string;
  name: string;
  category: string;
  description: string;
  pairingNotes: string[];
  family: string;
}

export interface Technique {
  id: string;
  name: string;
  category: string;
  description: string;
  instructions: string;
  difficulty: string;
  useCases: string[];
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  chef: string;
  level: AccessLevel;
  category: string;
  calories?: number;
  ingredients: string[]; 
  steps: string[];
  imageUrl?: string;
}

function getTierColor(level: string) {
  switch (level) {
    case 'PREMIUM': return 'text-accent border-accent bg-accent/10';
    case 'PRO': return 'text-primary border-primary bg-primary/10';
    default: return 'text-secondary border-secondary bg-secondary/10';
  }
}

function canAccessRecipe(userLevel: AccessLevel, recipeLevel: AccessLevel): boolean {
  if (userLevel === 'ADMIN' || userLevel === 'ENTERPRISE') return true;
  if (userLevel === 'PREMIUM') return true;
  if (userLevel === 'PRO' && (recipeLevel === 'PRO' || recipeLevel === 'FREE')) return true;
  if (userLevel === 'FREE' && recipeLevel === 'FREE') return true;
  return false;
}

function findByName<T extends { name: string }>(list: T[], name: string): T | null {
  return list.find((t) => t.name.toLowerCase() === name.toLowerCase()) || null;
}
function findById<T extends { id: string }>(list: T[], id: string): T | null {
  return list.find((t) => t.id === id) || null;
}

export function RecipesContent() {
  const { getEffectiveLevel, requireAuth } = useUserAuth();
  const { isAdmin } = useAdminAuth();
  const params = useSearchParams();
  const initialFilter = params.get('category') || 'All';

  const [filter, setFilter] = useState(initialFilter);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [modalType, setModalType] = useState<'recipe' | 'ingredient' | 'technique'>('recipe');

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [techniques, setTechniques] = useState<Technique[]>([]);
  const [loading, setLoading] = useState(true);

  const effectiveLevel = getEffectiveLevel();

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const supabase = getSupabase('CORE');
        if (!supabase) return;

        const [rRes, iRes, tRes] = await Promise.all([
          supabase.from('recipes').select('*'),
          supabase.from('ingredients').select('*'),
          supabase.from('techniques').select('*')
        ]);

        if (rRes.data) setRecipes(rRes.data);
        if (iRes.data) setIngredients(iRes.data);
        if (tRes.data) setTechniques(tRes.data);
      } catch (err) {
        console.error('Error fetching data from Supabase:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredRecipes = useMemo(() => {
    if (filter === 'All') return recipes;
    return recipes.filter(r => r.category === filter);
  }, [filter, recipes]);

  const openRecipe = (r: Recipe) => {
    if (!canAccessRecipe(effectiveLevel, r.level)) {
      requireAuth();
      return;
    }
    setModalType('recipe');
    setSelectedItem({
      ...r,
      fullIngredients: r.ingredients.map(name => findByName(ingredients, name) || { name, category: '?' }),
      stepsList: r.steps
    });
  };

  const openIngredient = (name: string) => {
    const ing = findByName(ingredients, name);
    if (!ing) return;
    setModalType('ingredient');
    setSelectedItem(ing);
  };

  const openTechnique = (name: string) => {
    const tech = findByName(techniques, name);
    if (!tech) return;
    setModalType('technique');
    setSelectedItem(tech);
  };

  const categories = ['All', 'Vanguardia', 'Clásica', 'Postres', 'Técnicas Base'];

  return (
    <div className="recipes-page py-24">
      <div className="container">
        <header className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 animate-fadeIn">
          <div>
            <h1 className="text-6xl font-black neon-text mb-4">ENCICLOPEDIA GOURMET</h1>
            <p className="text-xl opacity-60 max-w-2xl leading-relaxed">
              Explora nuestra biblioteca curada de recetas de alta cocina, técnicas moleculares e ingredientes del mundo.
            </p>
          </div>
          <div className="flex gap-2 bg-white/5 p-1 rounded-2xl border border-white/10 backdrop-blur-xl">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                  filter === cat ? 'bg-primary text-black shadow-neon' : 'hover:bg-white/10 opacity-60 hover:opacity-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </header>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-96 rounded-3xl bg-white/5 animate-pulse border border-white/10" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRecipes.map((recipe, idx) => {
              const hasAccess = canAccessRecipe(effectiveLevel, recipe.level);
              return (
                <div 
                  key={recipe.id}
                  onClick={() => openRecipe(recipe)}
                  className="group relative h-96 rounded-3xl overflow-hidden border border-white/10 hover:border-primary/50 transition-all duration-500 cursor-pointer animate-slideUp"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <img 
                    src={recipe.imageUrl || `https://source.unsplash.com/800x600/?cooking,gourmet,${recipe.id}`} 
                    alt={recipe.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                  
                  {!hasAccess && (
                    <div className="absolute inset-0 backdrop-blur-sm bg-black/40 flex items-center justify-center">
                      <div className="bg-black/60 border border-white/20 px-6 py-3 rounded-2xl flex items-center gap-3">
                        <span className="text-2xl">🔒</span>
                        <span className="font-bold tracking-widest text-sm">NIVEL {recipe.level}</span>
                      </div>
                    </div>
                  )}

                  <div className="absolute bottom-0 p-8 w-full transform group-hover:-translate-y-2 transition-transform duration-500">
                    <div className={`inline-block px-3 py-1 rounded-lg border text-[10px] font-black tracking-widest mb-4 uppercase ${getTierColor(recipe.level)}`}>
                      {recipe.level}
                    </div>
                    <h3 className="text-2xl font-black mb-2 leading-tight uppercase tracking-tight">{recipe.name}</h3>
                    <p className="text-sm opacity-60 line-clamp-2">{recipe.description}</p>
                    
                    <div className="mt-6 flex items-center justify-between">
                      <span className="text-xs font-bold opacity-40 uppercase tracking-widest">{recipe.chef}</span>
                      <span className="text-primary font-black opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                        EXPLORAR <span className="text-lg">→</span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedItem && (
        <DetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
}
