import z from 'zod';

export const signUpSchema = z.object({
  name: z.string().min(4).max(150),
  email: z.email(),
  password: z
    .string()
    .min(8)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    ),
});

export type SignUpSchema = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export type SignInSchema = z.infer<typeof signInSchema>;
