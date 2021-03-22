import React, {
  KeyboardEventHandler,
  memo,
  useCallback,
  useState,
} from 'react';
import {
  TranslationsTableRow,
  TranslationsTableRowProps,
} from '../Row/TranslationsTableRow';
import { Key } from 'ts-key-enum';
import { useDebounce } from 'react-use';

export interface TranslationsTableEntryRowProps
  extends Pick<
    TranslationsTableRowProps,
    'onRemove' | 'entry' | 'register' | 'setValue'
  > {
  index: number;
  isLast: boolean;
  onAdd: () => void;
}

export const TranslationsTableEntryRow = memo(
  ({
    index,
    onRemove,
    entry,
    onAdd,
    isLast,
    ...props
  }: TranslationsTableEntryRowProps) => {
    const [didAdd, setDidAdd] = useState(false);

    const handleAdd = useCallback(
      (): KeyboardEventHandler => (event) => {
        if (event.key !== Key.Enter || !isLast || event.shiftKey) {
          return;
        }

        event.preventDefault();

        onAdd();

        setDidAdd(true);
      },
      [isLast, onAdd]
    );

    useDebounce(
      () => {
        if (didAdd) {
          document
            .querySelector<HTMLInputElement>('.last-entry .sourceWord')
            ?.focus();

          setDidAdd(false);
        }
      },
      25,
      [didAdd]
    );

    return (
      <TranslationsTableRow
        className={isLast ? 'last-entry' : ''}
        entry={entry}
        onRemove={onRemove}
        inputVariant="filled"
        index={index}
        alternativesName={`entries[${index}].alternatives`}
        sourceWordName={`entries[${index}].sourceWord`}
        targetWordName={`entries[${index}].targetWord`}
        onKeyDown={handleAdd}
        {...props}
      />
    );
  }
);
