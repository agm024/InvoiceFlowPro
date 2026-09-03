import { requireSuperAdmin } from '@/lib/auth-context';
import prisma from '@/utils/prisma';
import RolesClient from './RolesClient';

export default async function PlatformRolesPage() {
  await requireSuperAdmin();
  
  const roles = await prisma.platformRole.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Global Role Management</h1>
        <p className="text-zinc-500 text-sm">Create and manage platform-wide roles for your internal super-admins.</p>
      </div>
      
      <RolesClient initialRoles={roles} />
    </div>
  );
}
