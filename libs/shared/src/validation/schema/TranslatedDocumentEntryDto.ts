import { BaseSchema } from '../BaseSchema';
import { TranslatedDocumentEntry } from '@skryba/domain-types';
import { TranslationEntryDto } from './TranslationEntryDto';
import * as jf from 'joiful';

export class TranslatedDocumentEntryDto
  extends BaseSchema<TranslatedDocumentEntryDto>
  implements TranslatedDocumentEntry {
  @jf.object({ objectClass: TranslationEntryDto })
  translation: TranslationEntryDto;

  @(jf.string().required())
  word: string;

  @(jf.string().required())
  id: string;

  @jf.boolean()
  isRestored?: boolean;
}
