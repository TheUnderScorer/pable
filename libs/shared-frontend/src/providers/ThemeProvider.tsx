import {
  ChakraProvider,
  extendTheme,
  theme as chakraTheme,
} from '@chakra-ui/react';
import React, { PropsWithChildren, useMemo } from 'react';

export const ThemeProvider = ({ children }: PropsWithChildren<unknown>) => {
  const theme = useMemo(
    () =>
      extendTheme({
        colors: {
          primary: chakraTheme.colors.blue,
          danger: chakraTheme.colors.red,
        },
      }),
    []
  );

  return (
    <ChakraProvider theme={theme} resetCSS>
      {children}
    </ChakraProvider>
  );
};
