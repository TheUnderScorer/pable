import React, { KeyboardEventHandler, useCallback, useState } from 'react';
import { useTranslationsStore } from '../../../stores/useTranslationsStore';
import { useDebounce } from 'react-use';
import { TranslationsTableRow } from '../Row/TranslationsTableRow';

export const TranslationsTableAddRow = () => {
  const [sourceWordForTranslation, setSourceWordForTranslation] = useState('');

  const addEntry = useTranslationsStore((store) => store.addEntry);

  const [source, setSource] = useState<HTMLInputElement | undefined>();

  const [sourceWord, setSourceWord] = useState('');
  const [targetWord, setTargetWord] = useState('');

  const handleAdd = useCallback(
    (): KeyboardEventHandler => (event) => {
      if (event.key !== 'Enter' || !sourceWord || !targetWord) {
        return;
      }

      event.preventDefault();

      addEntry({
        sourceWord,
        targetWord,
      });

      setSourceWord('');
      setTargetWord('');

      source?.focus();
    },
    [addEntry, source, sourceWord, targetWord]
  );

  useDebounce(
    () => {
      if (!sourceWord) {
        return;
      }

      setSourceWordForTranslation(sourceWord);
    },
    1000,
    [sourceWord]
  );

  return (
    <TranslationsTableRow
      onSourceChange={setSourceWord}
      onTargetChanged={setTargetWord}
      sourceWord={sourceWord}
      targetWord={targetWord}
      onKeyUp={handleAdd}
      sourceRef={setSource}
    />
  );
};
