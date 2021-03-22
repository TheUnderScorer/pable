import React from 'react';
import { Box, Container, Text } from '@chakra-ui/react';
import { TranslationsTableView } from '@pable/domain-frontend';

export const App = () => {
  return (
    <Container p={4} maxW="1100px">
      <TranslationsTableView />
      <Box position="fixed" bottom="0" left="0">
        <Text fontSize="xs">
          Version: {process.env.NX_APP_VERSION ?? 'Local'}
        </Text>
      </Box>
    </Container>
  );
};

export default App;
