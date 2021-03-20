import React from 'react';
import { Button, Container } from '@chakra-ui/react';
import { TranslationsTableView } from '@pable/domain-frontend';

export const App = () => {
  return (
    <Container p={4} maxW="1100px">
      <TranslationsTableView />
    </Container>
  );
};

export default App;
