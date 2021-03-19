export enum Language {
  English = 'English',
  German = 'German',
}

export interface FetchTranslationsDto {
  language: Language;
  word: string;
}
