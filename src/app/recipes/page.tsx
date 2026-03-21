import { Suspense } from 'react';
import { RecipesContent } from './RecipesContent';

export const dynamic = 'force-dynamic';

export default function RecipesPage() {
  return (
    <Suspense fallback={<div className="container py-20 text-center text-6xl font-black opacity-10 animate-pulse">CARGANDO BIBLIOTECA...</div>}>
      <RecipesContent />
    </Suspense>
  );
}
