import create from 'zustand';
import { persist } from 'zustand/middleware';
import { TranslationEntry } from '@pable/domain-types';

export interface TranslationsStore {
  translations: TranslationEntry[];
  addEntry: (entry: TranslationEntry) => void;
  removeEntry: (index: number) => void;
  editEntry: (index: number, entry: Partial<TranslationEntry>) => void;

  [key: string]: unknown;
}

export const useTranslationsStore = create<TranslationsStore>(
  persist(
    (set, get) => ({
      translations: [],
      addEntry: (entry) => {
        set({
          translations: [...get().translations, entry],
        });
      },
      removeEntry: (index) => {
        const newEntries = [...get().translations];

        newEntries.splice(index, 1);

        set({
          translations: newEntries,
        });
      },
      editEntry: (index, entry) => {
        const entries = [...get().translations];

        entries[index] = {
          ...entries[index],
          ...entry,
        };

        set({
          translations: entries,
        });
      },
    }),
    {
      name: 'translations',
      deserialize: (value) => {
        if (!value) {
          return {
            version: 0,
            state: {
              translations: [],
            },
          };
        }

        const parsedValue = JSON.parse(value);

        return {
          version: parsedValue?.version ?? 0,
          state: {
            ...parsedValue?.state,
            translations:
              parsedValue?.state?.translations?.filter(Boolean) ?? [],
          },
        };
      },
    }
  )
);
