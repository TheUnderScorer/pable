import React, { ReactElement } from 'react';
import { FormField, FormFieldProps } from '../FormField/FormField';
import { Controller, ControllerProps, useFormContext } from 'react-hook-form';

export interface FormFieldControllerProps<T extends ReactElement>
  extends FormFieldProps,
    Pick<ControllerProps<ReactElement>, 'name' | 'rules' | 'defaultValue'> {
  children: ControllerProps<T>['render'];
}

export const FormFieldController = <T extends ReactElement>({
  name,
  rules,
  defaultValue,
  children,
  ...props
}: FormFieldControllerProps<T>) => {
  const form = useFormContext();

  return (
    <FormField name={name} {...props}>
      <Controller
        name={name}
        control={form.control}
        defaultValue={defaultValue}
        rules={rules}
        render={(formProps, state) => children(formProps, state)}
      />
    </FormField>
  );
};
