import { headers } from 'next/headers';

import { UserRole } from '@/generated/prisma';
import prisma from '@/server/db/prisma';
import { auth } from '@/server/modules/auth/auth';

export class AuthGuard {
  async checkSession() {
    const res = await auth.api.getSession({
      headers: await headers(),
    });

    if (!res) await auth.api.signOut({ headers: await headers() });

    return res;
  }

  async checkSessionAndRole() {
    const session = await this.checkSession();
    if (!session) return null;

    const user = await prisma.users.findUnique({
      where: { id: session.user.id },
    });
    if (!user) return null;

    if (user.role === UserRole.EDITOR) return null;

    return session;
  }
}

export const authGuard = new AuthGuard();
