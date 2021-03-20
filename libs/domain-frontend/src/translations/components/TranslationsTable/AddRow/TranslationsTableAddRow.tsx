import React, { KeyboardEventHandler, useCallback, useState } from 'react';
import { useTranslationsStore } from '../../../stores/useTranslationsStore';
import { TranslationsTableRow } from '../Row/TranslationsTableRow';
import { Key } from 'ts-key-enum';

export const TranslationsTableAddRow = () => {
  const entries = useTranslationsStore((store) => store.translations);
  const addEntry = useTranslationsStore((store) => store.addEntry);

  const [sourceWord, setSourceWord] = useState('');
  const [targetWord, setTargetWord] = useState('');
  const [alternatives, setAlternatives] = useState([]);

  const handleAdd = useCallback(
    (): KeyboardEventHandler => (event) => {
      if (event.key !== Key.Enter || !sourceWord) {
        return;
      }

      event.preventDefault();

      addEntry({
        sourceWord,
        targetWord,
        alternatives,
      });

      setSourceWord('');
      setTargetWord('');
      setAlternatives([]);
    },
    [addEntry, alternatives, sourceWord, targetWord]
  );

  return (
    <TranslationsTableRow
      className="create"
      onSourceChange={setSourceWord}
      onTargetChanged={setTargetWord}
      sourceWord={sourceWord}
      targetWord={targetWord}
      onKeyDown={handleAdd}
      inputVariant="flushed"
      focusOnMount
      index={entries.length}
      onAlternatives={setAlternatives}
      alternatives={alternatives}
    />
  );
};
