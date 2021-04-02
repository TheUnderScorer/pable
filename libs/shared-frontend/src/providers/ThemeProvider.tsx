import {
  ChakraProvider,
  extendTheme,
  theme as chakraTheme,
} from '@chakra-ui/react';
import React, { PropsWithChildren, useMemo } from 'react';
import { usePrefersColorScheme } from '../hooks/usePrefersColorScheme';

const primaryScheme = chakraTheme.colors.blue;

export const ThemeProvider = ({ children }: PropsWithChildren<unknown>) => {
  const colorModePreference = usePrefersColorScheme();

  const theme = useMemo(
    () =>
      extendTheme({
        config: {
          useSystemColorMode: true,
        },
        colors: {
          primaryScheme: primaryScheme,
          primary: primaryScheme['400'],
          dangerScheme: chakraTheme.colors.red,
          danger: chakraTheme.colors.red['500'],
          lightGrey:
            colorModePreference === 'light'
              ? chakraTheme.colors.gray['200']
              : chakraTheme.colors.gray['700'],
          paper:
            colorModePreference === 'light'
              ? chakraTheme.colors.white
              : chakraTheme.colors.black,
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
    [colorModePreference]
  );

  return (
    <ChakraProvider theme={theme} resetCSS>
      {children}
    </ChakraProvider>
  );
};
