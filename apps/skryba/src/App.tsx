import React from 'react';
import { Box, Container, Text } from '@chakra-ui/react';
import {
  TranslateDocumentView,
  TranslationsTableView,
} from '@skryba/domain-frontend';
import { Route, Switch } from 'react-router-dom';
import { clientRoutes, TopBar } from '@skryba/shared-frontend';

export const App = () => {
  return (
    <>
      <TopBar />
      <Container p={4} maxW="1100px">
        <Switch>
          <Route exact path={clientRoutes.langTable}>
            <TranslationsTableView />
          </Route>
          <Route path={clientRoutes.translateDocument}>
            <TranslateDocumentView />
          </Route>
        </Switch>
        <Box position="fixed" bottom="0" left="0">
          <Text fontSize="xs">
            Version: {process.env.NX_APP_VERSION ?? 'Local'}
          </Text>
        </Box>
      </Container>
    </>
  );
};

export default App;
