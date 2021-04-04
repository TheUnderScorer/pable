import {
  DocumentToDisplay,
  useTranslateDocumentStore,
} from '../../../stores/useTranslateDocumentStore';
import { Button, HStack, Switch } from '@chakra-ui/react';
import React from 'react';

export const TranslatedDocumentDisplaySwitch = () => {
  const setDisplay = useTranslateDocumentStore((store) => store.setDisplay);
  const display = useTranslateDocumentStore((store) => store.display);
  const toggleDisplay = useTranslateDocumentStore(
    (store) => store.toggleDisplay
  );

  return (
    <HStack spacing={4}>
      <Button
        color="inherit"
        p={0}
        variant="link"
        onClick={() => setDisplay(DocumentToDisplay.Translated)}
      >
        Translated
      </Button>
      <Switch
        isChecked={display === DocumentToDisplay.Source}
        onChange={() => toggleDisplay()}
        colorScheme="primaryScheme"
        id="display_switch"
      />
      <Button
        color="inherit"
        p={0}
        variant="link"
        onClick={() => setDisplay(DocumentToDisplay.Source)}
      >
        Original
      </Button>
    </HStack>
  );
};
