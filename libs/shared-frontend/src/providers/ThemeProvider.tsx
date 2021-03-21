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
          primaryScheme: chakraTheme.colors.green,
          primary: chakraTheme.colors.green['400'],
          dangerScheme: chakraTheme.colors.red,
          danger: chakraTheme.colors.red['500'],
        },
        components: {
          Input: {
            defaultProps: {
              colorScheme: 'primaryScheme',
            },
          },
          Textarea: {
            defaultProps: {
              colorScheme: 'primaryScheme',
              focusBorderColor: chakraTheme.colors.green['400'],
            },
          },
          Select: {
            defaultProps: {
              colorScheme: 'primaryScheme',
              focusBorderColor: chakraTheme.colors.green['400'],
            },
          },
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
