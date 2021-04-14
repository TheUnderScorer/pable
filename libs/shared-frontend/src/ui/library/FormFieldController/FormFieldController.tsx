import React from 'react';
import { FormField, FormFieldProps } from '../FormField/FormField';
import { Controller, ControllerProps, useFormContext } from 'react-hook-form';

export interface FormFieldControllerProps
  extends FormFieldProps,
    Pick<ControllerProps, 'rules' | 'defaultValue'> {
  children: ControllerProps['render'];
}

export const FormFieldController = ({
  name,
  rules,
  defaultValue,
  children,
  ...props
}: FormFieldControllerProps) => {
  const form = useFormContext();

  return (
    <FormField name={name} {...props}>
      <Controller
        name={name}
        control={form.control}
        defaultValue={defaultValue}
        rules={rules}
        render={(formProps) => children(formProps)}
      />
    </FormField>
  );
};
