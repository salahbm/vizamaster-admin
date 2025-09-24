import { ReactNode } from 'react';

import {
  Control,
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
  Path,
  UseFormStateReturn,
} from 'react-hook-form';

export interface IFormFields<T extends FieldValues> {
  id?: string;
  name: Path<T>;
  control: Control<T>;
  label?: string | ReactNode;
  required?: boolean;
  className?: string;
  labelClassName?: string;
  message?: string | ReactNode;
  messageClassName?: string;
  loading?: boolean;
  render: (params: {
    field: ControllerRenderProps<T, Path<T>>;
    fieldState: ControllerFieldState;
    formState: UseFormStateReturn<T>;
  }) => ReactNode;
}
