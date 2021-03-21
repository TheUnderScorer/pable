import {
  ChakraProvider,
  extendTheme,
  theme as chakraTheme,
} from '@chakra-ui/react';
import React, { PropsWithChildren, useMemo } from 'react';

const primaryScheme = chakraTheme.colors.blue;

export const ThemeProvider = ({ children }: PropsWithChildren<unknown>) => {
  const theme = useMemo(
    () =>
      extendTheme({
        colors: {
          primaryScheme: primaryScheme,
          primary: primaryScheme['400'],
          dangerScheme: chakraTheme.colors.red,
          danger: chakraTheme.colors.red['500'],
        },
        components: {
          Textarea: {
            defaultProps: {
              focusBorderColor: primaryScheme['400'],
            },
          },
          Select: {
            defaultProps: {
              focusBorderColor: primaryScheme['400'],
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
