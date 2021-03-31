import React from 'react';
import { Box, Container, Text } from '@chakra-ui/react';
import { TranslationsTableView } from '@skryba/domain-frontend';
import { Route, Switch } from 'react-router-dom';
import { clientRoutes } from '@skryba/shared-frontend';

export const App = () => {
  return (
    <Container p={4} maxW="1100px">
      <Switch>
        <Route exact path={clientRoutes.langTable}>
          <TranslationsTableView />
        </Route>
        <Route path={clientRoutes.translateDocument}>Translate document</Route>
      </Switch>
      <Box position="fixed" bottom="0" left="0">
        <Text fontSize="xs">
          Version: {process.env.NX_APP_VERSION ?? 'Local'}
        </Text>
      </Box>
    </Container>
  );
};

export default App;
