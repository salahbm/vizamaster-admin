'use client';

import * as React from 'react';

import { ChevronDown, Search } from 'lucide-react';
import { FieldError } from 'react-hook-form';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface SingleSelectProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  options?: Array<{
    value: string;
    label: string;
    disabled?: boolean;
    className?: string;
    id?: string;
  }>;
  onValueChange: (value: string) => void;
  value: string;
  placeholder?: string;
  modalPopover?: boolean;
  className?: string;
  searchable?: boolean;
  error?: FieldError;
}

export const Combobox = React.forwardRef<HTMLButtonElement, SingleSelectProps>(
  (
    {
      options = [],
      onValueChange,
      value,
      placeholder = 'Select',
      modalPopover = true,
      searchable = false,
      className,
      error,
      ...props
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);

    const handleSelect = (val: string) => {
      onValueChange(val);
      setOpen(false);
    };

    const label = React.useMemo(() => {
      return options.find(option => option.value === value)?.label;
    }, [options, value]);

    return (
      <Popover modal={modalPopover} open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          ref={ref}
          className={cn(
            'font-body-2 group flex h-11 w-full items-center justify-between gap-[6px] rounded border border-gray-2 py-2 pl-3 pr-2 text-navy outline-none ring-offset-0 hover:border-navy disabled:cursor-not-allowed disabled:border-gray-3 disabled:bg-gray-1 disabled:text-gray-6 data-[state=open]:border-navy data-[placeholder]:text-gray-4 [&>span]:line-clamp-1',
            error && 'border-red',
            className
          )}
          {...props}
        >
          {label ?? <span className="text-gray-4">{placeholder}</span>}
          <ChevronDown
            className={cn(
              'h-6 w-6 shrink-0 transition-transform duration-200 group-disabled:fill-gray-3 group-data-[state=open]:rotate-180',
              'text-gray-6'
            )}
          />
        </PopoverTrigger>
        <PopoverContent align="start">
          <Command defaultValue={label as string} className="px-2">
            {searchable && (
              <fieldset className="flex-center mb-1 border-b border-gray-2 p-3">
                <CommandInput placeholder={'Search'} />
                <Search className="size-6 text-gray-6" />
              </fieldset>
            )}
            <CommandList className="max-h-80">
              <CommandEmpty>
                <p className="font-body-2 text-gray-5">No Data</p>
              </CommandEmpty>
              <CommandGroup>
                {options.map(option => (
                  <CommandItem
                    key={option.value.toString()}
                    value={option.label as string}
                    onSelect={() => handleSelect(option.value.toString())}
                    disabled={option.disabled}
                    className={cn(option.className, label === option.label && 'text-red-1')}
                  >
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }
);

Combobox.displayName = 'Combobox';
