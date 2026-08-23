import { requireSuperAdmin } from '@/lib/auth-context';

export default async function Page() {
  await requireSuperAdmin();
  return <div className="p-6"><h1 className="text-2xl font-bold">Coming Soon</h1><p className="text-zinc-500 mt-2">This module is under development.</p></div>;
}
