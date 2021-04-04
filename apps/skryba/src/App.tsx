import React from 'react';
import { Box, Container, Flex, Text } from '@chakra-ui/react';
import {
  TranslateDocumentView,
  TranslationsTableView,
} from '@skryba/domain-frontend';
import { Route, Switch } from 'react-router-dom';
import { clientRoutes, TopBar } from '@skryba/shared-frontend';

export const App = () => {
  return (
    <Flex minHeight="100vh" flexDirection="column">
      <TopBar />
      <Switch>
        <Route exact path={clientRoutes.langTable}>
          <Container
            display="flex"
            flexDirection="column"
            flex={1}
            p={4}
            maxW="1100px"
          >
            <TranslationsTableView />
          </Container>
        </Route>
        <Route path={clientRoutes.translateDocument}>
          <Container
            display="flex"
            flexDirection="column"
            flex={1}
            p={4}
            maxW="1440px"
          >
            <TranslateDocumentView />
          </Container>
        </Route>
      </Switch>
      <Box position="fixed" bottom="0" left="0">
        <Text fontSize="xs">
          Version: {process.env.NX_APP_VERSION ?? 'Local'}
        </Text>
      </Box>
    </Flex>
  );
};

export default App;
