export enum Language {
  English = 'English',
  German = 'German',
}

export interface FetchTranslationsDto {
  targetLanguage: Language;
  sourceLanguage: Language;
  word: string;
}

export interface FetchTranslationsResult {
  translation: string;
}
