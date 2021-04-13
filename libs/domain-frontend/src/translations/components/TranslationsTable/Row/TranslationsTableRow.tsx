import React, {
  KeyboardEventHandler,
  memo,
  useCallback,
  useState,
} from 'react';
import { useFetchTranslation } from '../../../hooks/useFetchTranslation';
import { useDebounce, useMount } from 'react-use';
import {
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuGroup,
  MenuItem,
  MenuList,
  Spinner,
  Td,
  Textarea,
  Tr,
} from '@chakra-ui/react';
import {
  FetchTranslationsResult,
  TranslationEntry,
} from '@skryba/domain-types';
import { ChevronDownIcon } from '@chakra-ui/icons';
import classNames from 'classnames';
import { Key } from 'ts-key-enum';
import { FaIcon, FormField } from '@skryba/shared-frontend';
import { UseFormMethods } from 'react-hook-form';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

export interface TranslationsTableRowProps {
  onKeyDown?: (
    type: keyof Pick<TranslationEntry, 'targetWord' | 'sourceWord'>
  ) => KeyboardEventHandler;
  onRemove?: (index: number) => void;
  inputVariant?: string;
  className?: string;
  index?: number;
  sourceWordName: string;
  targetWordName: string;
  alternativesName: string;
  entry: TranslationEntry;
  register: UseFormMethods['register'];
  setValue: UseFormMethods['setValue'];
}

// TODO Fix alternatives
export const TranslationsTableRow = memo(
  ({
    onKeyDown,
    onRemove,
    inputVariant,
    className,
    index,
    alternativesName,
    sourceWordName,
    targetWordName,
    entry,
    register,
    setValue,
  }: TranslationsTableRowProps) => {
    const [didMountQuery, setDidMountQuery] = useState(false);

    const [sourceWord, setSourceWord] = useState(entry.sourceWord);
    const [targetWord, setTargetWord] = useState(entry.targetWord);
    const [alternatives, setAlternatives] = useState(entry.alternatives);

    const handleQueryResult = useCallback(
      (data?: FetchTranslationsResult) => {
        const { alternatives = [], translation } = data;
        if (translation) {
          setValue(targetWordName, translation);
          setTargetWord(translation);
        }

        setValue(alternativesName, alternatives);
        setAlternatives(alternatives);
      },
      [alternativesName, targetWordName, setValue]
    );

    const fetchTranslationQuery = useFetchTranslation(
      sourceWord,
      handleQueryResult
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

    const handleAlternativeClick = useCallback(
      (alternative: string) => () => {
        const filteredAlternatives =
          alternatives?.filter(
            (prevAlternative) => prevAlternative !== alternative
          ) ?? [];

        const newAlternatives = [...filteredAlternatives, targetWord];

        setValue(targetWordName, alternative);
        setTargetWord(alternative);
        setValue(alternativesName, newAlternatives);

        setAlternatives(newAlternatives);
      },
      [alternatives, alternativesName, targetWord, targetWordName, setValue]
    );

    useDebounce(
      () => {
        if (!sourceWord.trim() || (!didMountQuery && targetWord)) {
          return;
        }

        fetchTranslationQuery.mutate({
          word: sourceWord.trim(),
        });
      },
      500,
      [sourceWord]
    );

    useMount(() => {
      if (sourceWord && !targetWord) {
        fetchTranslationQuery
          .mutateAsync({
            word: sourceWord,
          })
          .then(() => {
            setDidMountQuery(true);
          });
      } else {
        setTimeout(() => setDidMountQuery(true), 550);
      }
    });

    return (
      <Tr className={classNames(className, 'translation-table-row')}>
        <Td>
          <FormField name={sourceWordName}>
            <Textarea
              defaultValue={entry.sourceWord}
              name={sourceWordName}
              ref={register()}
              className={classNames('sourceWord', `sourceWord-${index}`)}
              minHeight={12}
              variant={inputVariant}
              onKeyDown={handleKeyDown('sourceWord')}
              placeholder="Enter word here..."
              onChange={(event) => {
                setSourceWord(event.target.value);
              }}
            />
          </FormField>
        </Td>
        <Td>
          <HStack width="100%">
            <FormField name={targetWordName}>
              <Textarea
                name={targetWordName}
                className={classNames('targetWord', `targetWord-${index}`)}
                minHeight={12}
                variant={inputVariant}
                disabled={fetchTranslationQuery.isLoading}
                onKeyDown={handleKeyDown('targetWord')}
                placeholder="Translation will appear here..."
                defaultValue={entry.targetWord}
                ref={register()}
                onChange={(event) => {
                  setTargetWord(event.target.value);
                }}
              />
            </FormField>
            {fetchTranslationQuery.isLoading && <Spinner color="primary" />}
            {alternatives?.length && (
              <Menu>
                <MenuButton
                  isDisabled={fetchTranslationQuery.isLoading}
                  className="show-alternatives"
                  as={IconButton}
                  aria-label="Show alternatives"
                  icon={<ChevronDownIcon />}
                />
                <MenuList p={4}>
                  <MenuGroup title="Alternatives">
                    {alternatives?.map((alternative, index) => (
                      <MenuItem
                        className="alternative"
                        onClick={handleAlternativeClick(alternative)}
                        key={index}
                      >
                        {alternative}
                      </MenuItem>
                    ))}
                  </MenuGroup>
                </MenuList>
              </Menu>
            )}
            {onRemove && (
              <IconButton
                className="delete-entry"
                aria-label="Delete entry"
                colorScheme="dangerScheme"
                onClick={() => onRemove(index)}
                icon={<FaIcon icon={faTrash} />}
              />
            )}
          </HStack>
        </Td>
      </Tr>
    );
  }
);
