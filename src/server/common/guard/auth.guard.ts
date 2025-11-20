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

  /**
   * Check if user is authenticated for API routes
   * Throws UnauthorizedError if not authenticated
   */
  async requireAuth() {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new Error('Unauthorized: No active session');
    }

    return session;
  }

  /**
   * Check if user is authenticated and has required role for API routes
   * Throws error if not authenticated or doesn't have permission
   */
  async requireAuthAndRole() {
    const session = await this.requireAuth();

    const user = await prisma.users.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      throw new Error('Unauthorized: User not found');
    }

    if (user.role === UserRole.EDITOR) {
      throw new Error('Forbidden: Insufficient permissions');
    }

    return { session, user };
  }
}

export const authGuard = new AuthGuard();
