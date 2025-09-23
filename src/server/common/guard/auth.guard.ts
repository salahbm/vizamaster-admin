import { headers } from 'next/headers';

import { getTranslations } from 'next-intl/server';

import { API_CODES } from '@/server/common/codes';
import { UnauthorizedError } from '@/server/common/errors';
import { auth } from '@/server/modules/auth/auth';

export class AuthGuard {
  async requireRole(user: { role: string }, allowedRoles: string[]) {
    if (!allowedRoles.includes(user.role)) {
      const t = await getTranslations();
      throw new UnauthorizedError(
        t('errors.notAuthorizedRole'),
        API_CODES.NOT_AUTHORIZED_ROLE,
      );
    }
  }

  async checkSession() {
    const res = await auth.api.getSession({
      headers: await headers(),
    });

    if (!res) await auth.api.signOut({ headers: await headers() });

    return res;
  }
}

export const authGuard = new AuthGuard();
