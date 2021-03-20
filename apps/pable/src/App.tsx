import React from 'react';
import { Button, Container } from '@chakra-ui/react';

export const App = () => {
  return (
    <Container>
      <Button variant="outline" colorScheme="primary">
        API Url: {process.env.NX_API_URL}
      </Button>
    </Container>
  );
};

export default App;
