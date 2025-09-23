import { z } from 'zod';

export const withValidation =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  <T>(schema: z.ZodSchema<T>, handler: (data: T) => Promise<any>) =>
    async (req: Request) => {
      const json = await req.json();
      const parsed = schema.parse(json);
      return handler(parsed);
    };
