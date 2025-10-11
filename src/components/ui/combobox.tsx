'use client';

import * as React from 'react';

import { Check, ChevronDown, X as XIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { FieldError } from 'react-hook-form';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { cn } from '@/lib/utils';

import { FieldValueTypes } from '@/types/global';

export interface IComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
  className?: string;
  id?: string;
}

interface ComboboxProps
  extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    'value' | 'onChange'
  > {
  options?: Array<IComboboxOption>;
  label?: string | React.ReactNode;
  onChange: (value: string | string[]) => void;
  value: FieldValueTypes;
  placeholder?: string;
  modalPopover?: boolean;
  className?: string;
  searchable?: boolean;
  error?: FieldError;
  multiple?: boolean;
  disabled?: boolean;
}

export const Combobox = React.forwardRef<HTMLButtonElement, ComboboxProps>(
  (
    {
      options = [],
      label,
      onChange,
      value,
      placeholder = 'Select',
      modalPopover = true,
      searchable = false,
      className,
      error,
      multiple = false,
      ...props
    },
    ref,
  ) => {
    const t = useTranslations();
    const [open, setOpen] = React.useState(false);

    const handleSelect = (val: string) => {
      if (multiple) {
        const currentValues = Array.isArray(value) ? value : [];
        const stringValues = currentValues.map((v) => String(v));
        const valueExists = stringValues.some((v) => v === val);

        if (valueExists) {
          // Remove the value if it already exists
          onChange(stringValues.filter((v) => v !== val));
        } else {
          // Add the value if it doesn't exist
          onChange([...stringValues, val]);
        }
      } else {
        // Single select mode
        onChange(val);
        setOpen(false);
      }
    };

    // Get selected values as an array regardless of single or multiple mode
    const selectedValues = React.useMemo(() => {
      if (Array.isArray(value)) return value;
      return value ? [value] : [];
    }, [value]);

    // Get labels for all selected values
    const selectedLabels = React.useMemo(
      () =>
        selectedValues.map((val) => {
          const match = options?.find((opt) => opt.value === val);
          return match?.label ?? val;
        }),
      [selectedValues, options],
    );

    const handleClear = (event: React.MouseEvent<HTMLElement>) => {
      event.stopPropagation();
      onChange(multiple ? [] : '');
    };

    // Display text for the trigger button
    const localLabel = React.useMemo(() => {
      if (selectedValues.length === 0) {
        return (
          <span className="text-muted-foreground font-caption-1:font-body-2">
            {placeholder}
          </span>
        );
      }

      if (!multiple) {
        // Single select mode - show the selected label
        const selectedOption = options.find(
          (option) => option.value === selectedValues[0],
        );
        return selectedOption?.label || selectedValues[0];
      } else {
        return selectedLabels.join(', ');
      }
    }, [selectedValues, selectedLabels, options, multiple, placeholder]);

    return (
      <Popover modal={modalPopover} open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          ref={ref}
          className={cn(
            'selection:bg-primary selection:text-primary-foreground dark:bg-input/30 hover:border-muted-foreground border-input font-caption-1 md:font-body-1 group flex h-11 w-full min-w-0 items-center justify-between rounded border bg-transparent px-4 py-3 transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
            'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
            'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
            'cursor-pointer',
            error && 'border-red',
            className,
          )}
          {...props}
        >
          <span className="min-w-0 flex-1 truncate text-left capitalize">
            {label ??
              (typeof localLabel === 'string' ? localLabel : localLabel)}
          </span>

          <div className="flex flex-shrink-0 items-center gap-1">
            {selectedValues.length > 2 && (
              <div
                onClick={handleClear}
                className="hover:bg-accent rounded-full p-1"
                aria-label="Clear selection"
              >
                <XIcon className="size-3" />
              </div>
            )}
            <ChevronDown
              className={cn(
                'group-disabled:text-accent size-5 shrink-0 text-neutral-500 transition-transform duration-200 group-data-[state=open]:rotate-180',
              )}
            />
          </div>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-full min-w-[var(--radix-popover-trigger-width)]"
        >
          <Command>
            {searchable && (
              <CommandInput className="h-11" placeholder={t('Common.search')} />
            )}
            <CommandList className="no-scrollbar max-h-80">
              <CommandEmpty>
                <p className="font-body-2 text-muted-foreground">
                  {t('Common.noData')}
                </p>
              </CommandEmpty>
              <CommandGroup>
                {options.map((option) => {
                  const isSelected = selectedValues.includes(option.value);
                  return (
                    <CommandItem
                      key={option.value.toString()}
                      value={option.label as string}
                      onSelect={() => handleSelect(option.value.toString())}
                      disabled={option.disabled}
                      className={cn(
                        'flex items-center justify-between',
                        isSelected && 'bg-accent/50',
                        option.className,
                      )}
                    >
                      <span>
                        {typeof option.label === 'string'
                          ? option.label
                          : option.label}
                      </span>
                      {isSelected && <Check className="text-primary size-4" />}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  },
);

Combobox.displayName = 'Combobox';
