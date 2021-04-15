import { BaseSchema } from '../BaseSchema';
import { TranslationEntry } from '@skryba/domain-types';
import * as jf from 'joiful';

export class TranslationEntryDto
  extends BaseSchema<TranslationEntryDto>
  implements TranslationEntry {
  @(jf.string().optional())
  sourceWord?: string;

  @jf.boolean()
  targetWordEditedManually?: boolean;

  @(jf.string().optional())
  targetWord?: string;

  @(jf.array().items((joi) => joi.string()))
  alternatives?: string[];
}
