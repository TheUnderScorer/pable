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

export interface TranslatedDocumentEntry {
  word: string;
  translation: TranslationEntry;
  isRestored?: boolean;
  id: string;
}

export type TranslatedDocumentEntries = Array<string | TranslatedDocumentEntry>;

export const isTranslatedDocumentEntry = (
  item: unknown
): item is TranslatedDocumentEntry => {
  return typeof item === 'object' && 'word' in item && 'translation' in item;
};

export const initialTranslationEntry: TranslationEntry = {
  targetWord: '',
  alternatives: [],
  sourceWord: '',
};
