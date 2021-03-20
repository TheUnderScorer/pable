import React from 'react';
import { TranslationEntry } from '@pable/domain-types';
import { useTranslationsStore } from '../../../stores/useTranslationsStore';
import { TranslationsTableRow } from '../Row/TranslationsTableRow';

export interface TranslationsTableEntryRowProps {
  entry: TranslationEntry;
  index: number;
}

export const TranslationsTableEntryRow = ({
  entry,
  index,
}: TranslationsTableEntryRowProps) => {
  const editEntry = useTranslationsStore((store) => store.editEntry);
  const removeEntry = useTranslationsStore((store) => store.removeEntry);

  return (
    <TranslationsTableRow
      onSourceChange={(source) => editEntry(index, { sourceWord: source })}
      onTargetChanged={(target) => editEntry(index, { targetWord: target })}
      sourceWord={entry.sourceWord}
      targetWord={entry.targetWord}
      onAlternatives={(alternatives) => editEntry(index, { alternatives })}
      onRemove={() => removeEntry(index)}
      inputVariant="filled"
      index={index}
      alternatives={entry.alternatives}
    />
  );
};
