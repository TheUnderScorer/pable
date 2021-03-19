import React, { useEffect, useState } from 'react';
import { Message } from '@pable/api-interfaces';
import { Button, Container } from '@chakra-ui/react';

export const App = () => {
  const [m, setMessage] = useState<Message>({ message: '' });

  useEffect(() => {
    fetch('/api')
      .then((r) => r.json())
      .then(setMessage);
  }, []);

  return (
    <Container>
      <Button variant="outline" colorScheme="primary">
        Button!
      </Button>
      <div>{m.message}</div>
    </Container>
  );
};

export default App;
