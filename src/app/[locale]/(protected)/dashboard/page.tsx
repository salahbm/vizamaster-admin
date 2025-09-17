import { redirect } from 'next/navigation';

import { DashboardComponents } from '@/components/views/dashboard';

import { routes } from '@/constants/routes';

import { AuthGuard } from '@/server/modules/auth/auth.guard';

export default function DashboardPage() {
  const auth = new AuthGuard();

  const session = auth.checkSession();

  if (!session) return redirect(routes.signIn);

  return <DashboardComponents />;
}
