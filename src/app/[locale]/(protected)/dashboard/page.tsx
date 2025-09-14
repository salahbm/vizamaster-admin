import { DashboardComponents } from '@/components/views/dashboard';

import { AuthGuard } from '@/server/modules/auth/auth.guard';

export default function DashboardPage() {
  const auth = new AuthGuard();

  auth.checkSession();

  return <DashboardComponents />;
}
