export const castAsArray = <T>(item: T | T[]) =>
  Array.isArray(item) ? item : [item];
