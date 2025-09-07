'use client';

import { FieldValues } from 'react-hook-form';

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { cn } from '@/lib/utils';

import { CustomProps } from './types';

export const FormFields = <T extends FieldValues>(props: CustomProps<T>) => {
  const {
    control,
    name,
    required,
    className,
    label,
    labelClassName,
    message,
    messageClassName,
    render,
  } = props;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState, formState }) => (
        <FormItem className={cn(className)}>
          {label && (
            <FormLabel
              required={required}
              className={cn(labelClassName, 'font-body-1')}
            >
              {label}
            </FormLabel>
          )}
          <FormControl>{render({ field, fieldState, formState })}</FormControl>
          {message && (
            <FormDescription
              className={cn(
                'font-caption-2 text-gray-5 mt-0.5',
                messageClassName,
              )}
            >
              {message}
            </FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
