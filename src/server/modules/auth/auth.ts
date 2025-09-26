// auth.ts
import { getTranslations } from 'next-intl/server';

import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { APIError, createAuthMiddleware } from 'better-auth/api';
import { nextCookies } from 'better-auth/next-js';

import prisma from '@/server/db/prisma';

export const enforceActiveUser = createAuthMiddleware(async (ctx) => {
  // Only run on email sign-in
  if (ctx.path !== '/sign-in/email') return;

  const email = ctx.body?.email;
  if (!email) return;

  // fetch the user by email
  const user = await prisma.users.findUnique({ where: { email } });

  if (!user) return; // user not found, let Better Auth handle it

  // block if inactive
  if (!user.active) {
    // Get translations and await the promise
    const t = await getTranslations();
    throw new APIError('FORBIDDEN', {
      message: t('errors.accountNotActive'),
    });
  }
});

// Prisma adapter for Better Auth
const adapter = prismaAdapter(prisma, { provider: 'postgresql' });

export const auth = betterAuth({
  appName: 'vizamaster-admin',
  database: adapter,
  plugins: [nextCookies()],
  user: {
    modelName: 'users',
  },
  account: {
    modelName: 'accounts',
  },
  session: {
    modelName: 'sessions',
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: false,
    minPasswordLength: 8,
    maxPasswordLength: 20,
  },

  hooks: {
    before: enforceActiveUser,
  },
});
