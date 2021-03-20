import React, {
  KeyboardEventHandler,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useFetchTranslation } from '../../../hooks/useFetchTranslation';
import { useDebounce, usePrevious } from 'react-use';
import { HStack, Input, Spinner, Td, Tr } from '@chakra-ui/react';
import { TranslationEntry } from '@pable/domain-types';

export interface TranslationsTableRowProps {
  onSourceChange: (word: string) => void;
  onTargetChanged: (word: string) => void;
  sourceWord: string;
  targetWord: string;
  onKeyUp?: (
    type: keyof Pick<TranslationEntry, 'targetWord' | 'sourceWord'>
  ) => KeyboardEventHandler;
  sourceRef?: (element?: HTMLInputElement) => void;
  targetRef?: (element?: HTMLInputElement) => void;
}

export const TranslationsTableRow = ({
  onSourceChange,
  onTargetChanged,
  sourceWord,
  targetWord,
  onKeyUp,
  sourceRef: sourceRefProp,
  targetRef: targetRefProp,
}: TranslationsTableRowProps) => {
  const prevTargetWord = usePrevious(targetWord);

  const sourceRef = useRef<HTMLInputElement>();
  const targetRef = useRef<HTMLInputElement>();

  const [sourceWordForTranslation, setSourceWordForTranslation] = useState('');

  const fetchTranslationQuery = useFetchTranslation(
    sourceWordForTranslation,
    (data) => {
      if (data.translation) {
        onTargetChanged(data.translation);
      }
    }
  );

  useDebounce(
    () => {
      if (!sourceWord || (targetWord && prevTargetWord !== targetWord)) {
        return;
      }

      fetchTranslationQuery.mutate({
        word: sourceWord,
      });
    },
    1000,
    [sourceWord]
  );

  useEffect(() => {
    targetRefProp?.(targetRef.current);
  }, [targetRef, targetRefProp]);

  useEffect(() => {
    sourceRefProp?.(sourceRef.current);
  }, [sourceRefProp, sourceRef]);

  return (
    <Tr>
      <Td>
        <Input
          onChange={(event) => onSourceChange(event.target.value)}
          onKeyUp={onKeyUp?.('sourceWord')}
          ref={sourceRef as MutableRefObject<HTMLInputElement>}
          value={sourceWord}
          placeholder="Enter word here..."
        />
      </Td>
      <Td>
        <HStack>
          <Input
            disabled={fetchTranslationQuery.isLoading}
            onChange={(event) => onTargetChanged(event.target.value)}
            onKeyUp={onKeyUp?.('targetWord')}
            ref={targetRef as MutableRefObject<HTMLInputElement>}
            value={targetWord}
            placeholder="Translation will appear here..."
          />
          {fetchTranslationQuery.isLoading && <Spinner />}
        </HStack>
      </Td>
    </Tr>
  );
};
