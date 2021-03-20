import { validateAsClass } from 'joiful';
import { ValidationError } from './ValidationError';
import { Constructor } from '../types/constructor';

export const validate = <T>(
  input: Partial<unknown>,
  classConstructor: Constructor<T>
) => {
  const result = validateAsClass(input, classConstructor);

  if (result.error) {
    throw ValidationError.fromJoiError(result.error);
  }

  return result.value;
};
