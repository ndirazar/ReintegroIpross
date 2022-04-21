import { ReactNode } from 'react';
import { UseFormMethods, ValidateResult } from 'react-hook-form';
import { OptionsField } from './OptionsField';

export enum FieldType {
  string = 'string',
  int = 'int',
  float = 'float',
  boolean = 'boolean',
  date = 'date',
  time = 'time',
  options = 'options',
  br = 'br',
  custom = 'custom',
  file = 'file',
  radio = 'radio',
}

export type FormField<T> = {
  name: string;
  type: FieldType;
  component?: 'textarea' | 'password' | 'email' | 'checkbox' | 'radio' | React.ReactElement;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  accept?: string;
  multiple?: boolean;
  prefix?: ReactNode;
  suffix?: ReactNode;
  help?: string;
  tooltip?: string;
  options?:
    | OptionsField
    | ((form: UseFormMethods<Partial<T>>, query: string) => Promise<OptionsField>);
  styling?: Partial<{
    columns?: number;
  }>;
  onChange?: (value: any, form: UseFormMethods<Partial<T>>) => void;
  onUpdate?: (value: any, form: UseFormMethods<Partial<T>>) => void;
  onBlur?: (value: any, form: UseFormMethods<Partial<T>>) => void;
  onRemove?: (value: any) => void;
  rules?: Partial<{
    required:
      | string
      | boolean
      | {
          value: boolean;
          message: string;
        };
    min:
      | string
      | number
      | {
          value: React.ReactText;
          message: string;
        };
    max:
      | string
      | number
      | {
          value: React.ReactText;
          message: string;
        };
    maxLength:
      | string
      | number
      | {
          value: React.ReactText;
          message: string;
        };
    minLength:
      | string
      | number
      | {
          value: React.ReactText;
          message: string;
        };
    pattern:
      | RegExp
      | {
          value: RegExp;
          message: string;
        };
    validate: (form: UseFormMethods<Partial<T>>) => ValidateResult | Promise<ValidateResult>;
  }>;
  noOptionsText?: string;
};
