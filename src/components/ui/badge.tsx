import * as React from 'react';

import { Slot } from '@radix-ui/react-slot';
import { type VariantProps, cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded border px-2 py-0.5 font-caption-2 w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-green-500 text-primary-foreground [a&]:hover:bg-green-500/90',
        secondary:
          'border-transparent bg-secondary text-primary-foreground [a&]:hover:bg-secondary/90',
        success:
          'border-transparent bg-green-400 text-white [a&]:hover:bg-green-500',
        successAlt:
          'border-transparent bg-green-600 text-white [a&]:hover:bg-green-700',
        destructive:
          'border-transparent bg-red-400 text-white [a&]:hover:bg-red-500',
        destructiveAlt:
          'border-transparent bg-red-600 text-white [a&]:hover:bg-red-700',
        destructiveAlt2:
          'border-transparent bg-red-800 text-white [a&]:hover:bg-red-900',
        info: 'border-transparent bg-blue-500 text-white [a&]:hover:bg-blue-600',
        pending:
          'border-transparent bg-gray-500 text-white [a&]:hover:bg-gray-600',
        muted:
          'border-transparent bg-gray-200 text-gray-700 [a&]:hover:bg-gray-300',
        outline:
          'border border-gray-300 text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
        warning:
          'border-transparent bg-yellow-500 text-black [a&]:hover:bg-yellow-600',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'NEW':
      return 'info'; // blue
    case 'IN_PROGRESS':
      return 'pending'; // gray
    case 'CONFIRMED_PROGRAM':
      return 'success'; // bright green
    case 'HIRED':
      return 'successAlt'; // darker green to differentiate
    case 'HOTEL_REJECTED':
      return 'destructive'; // red
    case 'APPLICANT_REJECTED':
      return 'destructiveAlt'; // darker red
    case 'FIRED':
      return 'destructiveAlt2'; // another red shade
    case 'ARCHIVED':
      return 'muted'; // light gray
    default:
      return 'outline';
  }
};

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'span';

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants, getStatusVariant };
