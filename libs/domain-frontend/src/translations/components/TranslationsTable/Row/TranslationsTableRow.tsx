import React, {
  KeyboardEventHandler,
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useFetchTranslation } from '../../../hooks/useFetchTranslation';
import { useDebounce, useMount, usePrevious } from 'react-use';
import {
  HStack,
  IconButton,
  List,
  ListItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Spinner,
  Td,
  Textarea,
  Tr,
} from '@chakra-ui/react';
import { TranslationEntry } from '@pable/domain-types';
import { ChevronDownIcon, DeleteIcon } from '@chakra-ui/icons';
import classNames from 'classnames';
import { Key } from 'ts-key-enum';

export interface TranslationsTableRowProps {
  onSourceChange: (word: string) => void;
  onTargetChanged: (word: string) => void;
  sourceWord: string;
  targetWord: string;
  onKeyDown?: (
    type: keyof Pick<TranslationEntry, 'targetWord' | 'sourceWord'>
  ) => KeyboardEventHandler;
  sourceRef?: (element?: HTMLTextAreaElement) => void;
  targetRef?: (element?: HTMLTextAreaElement) => void;
  onRemove?: () => void;
  inputVariant?: string;
  focusOnMount?: boolean;
  className?: string;
  index?: number;
}

export const TranslationsTableRow = ({
  onSourceChange,
  onTargetChanged,
  sourceWord,
  targetWord,
  onKeyDown,
  sourceRef: sourceRefProp,
  targetRef: targetRefProp,
  onRemove,
  inputVariant,
  focusOnMount,
  className,
  index,
}: TranslationsTableRowProps) => {
  const prevTargetWord = usePrevious(targetWord);

  const sourceRef = useRef<HTMLTextAreaElement>();
  const targetRef = useRef<HTMLTextAreaElement>();

  const [sourceWordForTranslation, setSourceWordForTranslation] = useState('');

  const fetchTranslationQuery = useFetchTranslation(
    sourceWordForTranslation,
    (data) => {
      if (data.translation) {
        onTargetChanged(data.translation);
      }
    }
  );

  const handleKeyDown: TranslationsTableRowProps['onKeyDown'] = useCallback(
    (type) => (event) => {
      onKeyDown?.(type)?.(event);

      if (![Key.ArrowDown, Key.ArrowUp].includes(event.key as Key)) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      const nextIndex = event.key === Key.ArrowUp ? index - 1 : index + 1;

      document
        .querySelector<HTMLInputElement>(`.${type}-${nextIndex}`)
        ?.focus();
    },
    [index, onKeyDown]
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
    500,
    [sourceWord]
  );

  useEffect(() => {
    targetRefProp?.(targetRef.current);
  }, [targetRef, targetRefProp]);

  useEffect(() => {
    sourceRefProp?.(sourceRef.current);
  }, [sourceRefProp, sourceRef]);

  useMount(() => {
    if (focusOnMount) {
      sourceRef.current?.focus();
    }
  });

  return (
    <Tr className={className}>
      <Td>
        <Textarea
          className={classNames('sourceWord', `sourceWord-${index}`)}
          minHeight={12}
          variant={inputVariant}
          onChange={(event) => onSourceChange(event.target.value)}
          onKeyDown={handleKeyDown('sourceWord')}
          ref={sourceRef as MutableRefObject<HTMLTextAreaElement>}
          value={sourceWord}
          placeholder="Enter word here..."
        />
      </Td>
      <Td>
        <HStack width="100%">
          <Textarea
            className={classNames('targetWord', `targetWord-${index}`)}
            minHeight={12}
            variant={inputVariant}
            disabled={fetchTranslationQuery.isLoading}
            onChange={(event) => onTargetChanged(event.target.value)}
            onKeyDown={handleKeyDown('targetWord')}
            ref={targetRef as MutableRefObject<HTMLTextAreaElement>}
            value={targetWord}
            placeholder="Translation will appear here..."
          />
          {fetchTranslationQuery.data?.alternatives?.length && (
            <Popover>
              <PopoverTrigger>
                <IconButton
                  aria-label="Show alternatives"
                  icon={<ChevronDownIcon />}
                />
              </PopoverTrigger>
              <PopoverContent p={4}>
                <List>
                  {fetchTranslationQuery.data?.alternatives?.map(
                    (alternative, index) => (
                      <ListItem key={index}>{alternative}</ListItem>
                    )
                  )}
                </List>
              </PopoverContent>
            </Popover>
          )}
          {fetchTranslationQuery.isLoading && <Spinner />}
          {onRemove && (
            <IconButton
              aria-label="Delete entry"
              colorScheme="danger"
              onClick={onRemove}
              icon={<DeleteIcon />}
            />
          )}
        </HStack>
      </Td>
    </Tr>
  );
};
