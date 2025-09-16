import { type ClassValue, clsx } from 'clsx';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';
import z from 'zod';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function handleFormError(error: z.ZodError) {
  console.error(`ZodError In Form Error`, JSON.stringify(error, null, 2));
  if (error instanceof Error) {
    return toast.error(error.message);
  }
  return toast.error('Something went wrong');
}
