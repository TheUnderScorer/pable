import { Select, SelectProps } from '@chakra-ui/react';
import React from 'react';
import { Language } from '@pable/domain-types';

const languagesArray = Object.values(Language);

export const LangSelect = (props: Omit<SelectProps, 'children'>) => {
  return (
    <Select {...props}>
      {languagesArray.map((lang) => (
        <option key={lang} value={lang}>
          {lang}
        </option>
      ))}
    </Select>
  );
};
