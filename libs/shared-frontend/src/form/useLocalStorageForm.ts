import { useForm, UseFormOptions } from 'react-hook-form';
import { useMemo } from 'react';
import { useDebounce } from 'react-use';

export interface UseLocalStorageFormOptions<T> extends UseFormOptions<T> {
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

  const values = form.watch();

  useDebounce(
    () => {
      localStorage.setItem(localStorageKey, JSON.stringify(values));
    },
    350,
    [values]
  );

  return form;
};
