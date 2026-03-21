import { Suspense } from 'react';
import { AdminUserProfileContent } from './AdminUserProfileContent';

export const dynamic = 'force-dynamic';

export default function AdminUserProfilePage() {
  return (
    <Suspense fallback={<div className="panel glass">Cargando perfil...</div>}>
      <AdminUserProfileContent />
    </Suspense>
  );
}
