import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { getTranslations } from 'next-intl/server';

import { routes } from '@/constants/routes';

import { API_CODES } from '@/server/common/codes';
import { UnauthorizedError } from '@/server/common/errors';

import { auth } from './auth';

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
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) redirect(routes.signIn);
  }
}
