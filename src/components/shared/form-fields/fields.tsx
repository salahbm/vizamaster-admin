'use client';

import { memo } from 'react';

import { FieldValues } from 'react-hook-form';

import FieldSkeleton from '@/components/skeletons/field-skeleton';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { cn } from '@/lib/utils';

import { IFormFields } from './types';

export const FormFields = memo(
  <T extends FieldValues>(props: IFormFields<T>) => {
    const {
      control,
      name,
      required,
      className,
      label,
      labelClassName,
      message,
      messageClassName,
      loading,
      render,
    } = props;
    if (loading) return <FieldSkeleton className={className} />;
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
            <FormControl>
              {render({ field, fieldState, formState })}
            </FormControl>
            {message && (
              <FormDescription
                className={cn(
                  'font-caption-2 text-muted-foreground mt-0.5',
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
  },
) as <T extends FieldValues>(
  props: IFormFields<T>,
) => ReturnType<typeof FormField>;
