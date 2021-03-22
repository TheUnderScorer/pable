export const castAsArray = <T>(item: T | T[]) =>
  Array.isArray(item) ? item : [item];

export const isLast = <T>(index: number, array: T[]) =>
  index === array.length - 1;
