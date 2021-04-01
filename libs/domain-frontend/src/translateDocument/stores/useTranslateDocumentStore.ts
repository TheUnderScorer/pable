import create from 'zustand';
import { persist } from 'zustand/middleware';
import {
  isTranslatedDocumentEntry,
  TranslatedDocumentEntries,
  TranslatedDocumentEntry,
} from '@skryba/domain-types';
import { clone } from 'remeda';

export enum DocumentToDisplay {
  Translated = 'Translated',
  Source = 'Source',
}

export type TranslateDocumentFile = Pick<File, 'name' | 'size'>;

export interface TranslateDocumentStore {
  display: DocumentToDisplay;
  file?: TranslateDocumentFile;
  fileContent?: string;
  clear: () => void;
  translatedContent: TranslatedDocumentEntries;
  highlightedWordInDocument?: string;
  highlightedWordInList?: string;

  setHighlightedWordInList: (word?: string) => void;
  setHighlightedWordInDocument: (word?: string) => void;
  setTranslatedContent: (content: TranslatedDocumentEntries) => void;
  setFile: (file?: TranslateDocumentFile) => void;
  setFileContent: (content?: string) => void;
  setDisplay: (doc: DocumentToDisplay) => void;
  toggleDisplay: () => void;
  restoreWord: (index: number) => void;
  restoreTranslation: (index: number) => void;
  restoreAllTranslations: () => void;

  [key: string]: unknown;
}

export const useTranslateDocumentStore = create<TranslateDocumentStore>(
  persist(
    (set, get) => {
      const toggleIsRestored = (isRestored: boolean) => (index: number) => {
        const { translatedContent } = get();
        const newTranslatedContent = clone(translatedContent);

        if (isTranslatedDocumentEntry(newTranslatedContent[index])) {
          (newTranslatedContent[
            index
          ] as TranslatedDocumentEntry).isRestored = isRestored;
        }

        set({
          translatedContent: newTranslatedContent,
        });
      };

      return {
        file: undefined,
        fileContent: undefined,
        highlightedWordInDocument: undefined,
        display: DocumentToDisplay.Translated,
        translatedContent: [],
        highlightedWordInList: undefined,
        setTranslatedContent: (content) => {
          set({
            translatedContent: content,
          });
        },
        clear: () => {
          set({
            file: undefined,
            fileContent: undefined,
            display: DocumentToDisplay.Translated,
            translatedContent: [],
            hoveredWordInList: undefined,
            highlightedWordInList: undefined,
          });
        },
        setHighlightedWordInList: (word) => {
          set({
            highlightedWordInList: word,
          });
        },
        setDisplay: (display) => {
          set({
            display,
          });
        },
        setHighlightedWordInDocument: (word) => {
          set({
            highlightedWordInDocument: word,
          });
        },
        restoreWord: toggleIsRestored(true),
        restoreTranslation: toggleIsRestored(false),
        toggleDisplay: () => {
          const { display } = get();

          set({
            display:
              display === DocumentToDisplay.Source
                ? DocumentToDisplay.Translated
                : DocumentToDisplay.Source,
          });
        },
        setFile: (file) => {
          set({
            file,
          });
        },
        setFileContent: (content) => {
          set({
            fileContent: content,
          });
        },
        restoreAllTranslations: () => {
          const { translatedContent } = get();

          const newTranslatedContent = clone(translatedContent).map(
            (content) => {
              if (!isTranslatedDocumentEntry(content)) {
                return content;
              }

              return {
                ...content,
                isRestored: false,
              };
            }
          );

          set({
            translatedContent: newTranslatedContent,
          });
        },
      };
    },
    {
      name: 'translateDocumentStore',
    }
  )
);
