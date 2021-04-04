import { useMedia } from 'react-use';

export const usePrefersColorScheme = () => {
  const match = useMedia('(prefers-color-scheme: dark)', false);

  return match ? 'dark' : 'light';
};
