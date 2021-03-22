export enum Language {
  English = 'English',
  German = 'German',
  Polish = 'Polish',
}

export interface FetchTranslationsResult {
  translation: string;
  alternatives: string[];
}

export interface TranslationEntry {
  sourceWord?: string;
  targetWord?: string;
  alternatives?: string[];
}

export interface TranslationsForm {
  entries: TranslationEntry[];
  newEntry: Partial<TranslationEntry>;
}

export interface TranslationConfiguration {
  targetLang: Language;
  sourceLang: Language;
}

export const initialTranslationEntry: TranslationEntry = {
  targetWord: '',
  alternatives: [],
  sourceWord: '',
};
