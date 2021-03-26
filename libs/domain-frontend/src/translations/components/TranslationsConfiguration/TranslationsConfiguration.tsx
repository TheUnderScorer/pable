import React from 'react';
import { useTranslationsConfiguration } from '../../stores/useTranslationsConfiguration';
import { FormControl, FormLabel, HStack } from '@chakra-ui/react';
import { Language } from '@skryba/domain-types';
import { LangSelect } from '../LangSelect/LangSelect';

export const TranslationsConfiguration = () => {
  const sourceLang = useTranslationsConfiguration((store) => store.sourceLang);
  const targetLang = useTranslationsConfiguration((store) => store.targetLang);

  const setSourceLang = useTranslationsConfiguration(
    (store) => store.setSourceLang
  );
  const setTargetLang = useTranslationsConfiguration(
    (store) => store.setTargetLang
  );

  return (
    <HStack spacing={4}>
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
    </HStack>
  );
};
