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
}

export interface TranslationConfiguration {
  targetLang: Language;
  sourceLang: Language;
}
