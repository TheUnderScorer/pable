import React, { PropsWithChildren, ReactNode, useMemo } from 'react';
import {
  FormControl,
  FormControlProps,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
} from '@chakra-ui/react';
import { get, useForm } from 'react-hook-form';

export interface FormFieldProps {
  label?: ReactNode;
  helperText?: ReactNode;
  name: string;
  FormControlProps?: Omit<FormControlProps, 'id'>;
}

export const FormField = ({
  label,
  FormControlProps,
  helperText,
  name,
  children,
}: PropsWithChildren<FormFieldProps>) => {
  const form = useForm();
  const error = useMemo(() => get(form.errors, name), [form.errors, name]);

  return (
    <FormControl id={name} {...FormControlProps}>
      {label && <FormLabel>{label}</FormLabel>}
      {children}
      {helperText && !error && <FormHelperText>{helperText}</FormHelperText>}
      {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
    </FormControl>
  );
};
