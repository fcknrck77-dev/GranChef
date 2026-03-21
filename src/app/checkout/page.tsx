import { Suspense } from 'react';
import { CheckoutContent } from './CheckoutContent';

export const dynamic = 'force-dynamic';

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="container py-20 text-center">Cargando pasarela...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
