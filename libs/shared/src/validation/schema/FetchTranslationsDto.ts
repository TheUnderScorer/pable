import * as jf from 'joiful';
import { Language } from '@pable/domain-types';
import { requiredEnum } from '../decorators/enum';
import { BaseSchema } from '../BaseSchema';

export class FetchTranslationsDto extends BaseSchema<FetchTranslationsDto> {
  @requiredEnum(Language)
  targetLanguage: Language;

  @requiredEnum(Language)
  sourceLanguage: Language;

  @(jf.string().required())
  word: string;
}
