import {
  DocumentToDisplay,
  useTranslateDocumentStore,
} from '../../../stores/useTranslateDocumentStore';
import React from 'react';
import { LabeledSwitch } from '@skryba/shared-frontend';

export const TranslatedDocumentDisplaySwitch = () => {
  const setDisplay = useTranslateDocumentStore((store) => store.setDisplay);
  const display = useTranslateDocumentStore((store) => store.display);
  const toggleDisplay = useTranslateDocumentStore(
    (store) => store.toggleDisplay
  );

  return (
    <LabeledSwitch
      leftLabel="Translated"
      rightLabel="Original"
      onLeftClick={() => setDisplay(DocumentToDisplay.Translated)}
      onRightClick={() => setDisplay(DocumentToDisplay.Source)}
      isChecked={display === DocumentToDisplay.Source}
      onChange={() => toggleDisplay()}
      colorScheme="primaryScheme"
      id="display_switch"
    />
  );
};
