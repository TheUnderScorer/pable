import React, { useCallback } from 'react';
import { useTranslationsConfiguration } from '../../stores/useTranslationsConfiguration';
import {
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  Tooltip,
} from '@chakra-ui/react';
import { Language } from '@skryba/domain-types';
import { LangSelect } from '../LangSelect/LangSelect';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRandom } from '@fortawesome/free-solid-svg-icons';

export const TranslationsConfiguration = () => {
  const sourceLang = useTranslationsConfiguration((store) => store.sourceLang);
  const targetLang = useTranslationsConfiguration((store) => store.targetLang);

  const setSourceLang = useTranslationsConfiguration(
    (store) => store.setSourceLang
  );
  const setTargetLang = useTranslationsConfiguration(
    (store) => store.setTargetLang
  );

  const swap = useCallback(() => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
  }, [setSourceLang, setTargetLang, sourceLang, targetLang]);

  return (
    <HStack spacing={4} alignItems="flex-end">
      <FormControl id="sourceLanguage">
        <FormLabel>Source language</FormLabel>
        <LangSelect
          placeholder="Select source language"
          value={sourceLang}
          onChange={(event) => setSourceLang(event.target.value as Language)}
        />
      </FormControl>
      <FormControl id="targetLanguage">
        <FormLabel>Target language</FormLabel>
        <LangSelect
          placeholder="Select target language"
          value={targetLang}
          onChange={(event) => setTargetLang(event.target.value as Language)}
        />
      </FormControl>
      <Tooltip label="Swap languages">
        <IconButton onClick={swap} padding={0} aria-label="Swap">
          <FontAwesomeIcon icon={faRandom} />
        </IconButton>
      </Tooltip>
    </HStack>
  );
};
