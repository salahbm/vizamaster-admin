import { redirect } from 'next/navigation';

import { DashboardView } from '@/components/views/dashboard';

import { routes } from '@/constants/routes';

import { AuthGuard } from '@/server/common/guard/auth.guard';

export default function DashboardPage() {
  const auth = new AuthGuard();

  const session = auth.checkSession();

  if (!session) return redirect(routes.signIn);

  return <DashboardView />;
}
