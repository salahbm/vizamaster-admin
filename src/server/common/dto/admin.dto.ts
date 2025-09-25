import { z } from 'zod';

export const AdminProfileDto = z.object({
  name: z.string().min(4).max(150),
  email: z.email(),
});

export const AdminPasswordDto = z
  .object({
    currentPassword: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' }),
    newPassword: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' }),
    confirmPassword: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type TAdminProfileDto = z.infer<typeof AdminProfileDto>;
export type TAdminPasswordDto = z.infer<typeof AdminPasswordDto>;
