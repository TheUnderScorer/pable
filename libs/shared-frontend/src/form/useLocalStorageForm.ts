import { useForm, UseFormProps } from 'react-hook-form';
import { useMemo } from 'react';
import { useTimeoutFn } from 'react-use';

export interface UseLocalStorageFormOptions<T> extends UseFormProps<T> {
  localStorageKey: string;
}

export const useLocalStorageForm = <T>({
  localStorageKey,
  defaultValues,
  ...props
}: UseLocalStorageFormOptions<T>) => {
  const initialData = useMemo(() => {
    if (!localStorage.getItem(localStorageKey)) {
      return defaultValues;
    }

    try {
      const parsed = JSON.parse(localStorage.getItem(localStorageKey));

      return parsed ?? defaultValues;
    } catch {
      return defaultValues;
    }
  }, [defaultValues, localStorageKey]);

  const form = useForm({
    ...props,
    defaultValues: initialData,
    mode: 'onBlur',
  });

  const [, , resetTimeout] = useTimeoutFn(() => {
    localStorage.setItem(localStorageKey, JSON.stringify(form.getValues()));
  }, 400);

  form.watch(() => {
    resetTimeout();
  });

  return form;
};
