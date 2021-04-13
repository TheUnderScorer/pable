import * as jf from 'joiful';
import { FetchTranslationsDto } from './FetchTranslationsDto';
import { BaseSchema } from '../BaseSchema';

export class BulkFetchTranslationsDto extends BaseSchema<BulkFetchTranslationsDto> {
  @(jf.array({ elementClass: FetchTranslationsDto }).required())
  entries: FetchTranslationsDto[];
}
