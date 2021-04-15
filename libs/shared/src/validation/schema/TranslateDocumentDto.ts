import { BaseSchema } from '../BaseSchema';
import { TranslatedDocumentEntries } from '@skryba/domain-types';
import * as jf from 'joiful';
import { TranslationEntryDto } from './TranslationEntryDto';

export class TranslateDocumentDto extends BaseSchema<TranslateDocumentDto> {
  @(jf.string().required())
  content: string;

  @jf.array({ elementClass: TranslationEntryDto })
  translations: TranslationEntryDto[];
  previousTranslatedDocument?: TranslatedDocumentEntries;
}
