import { BulkFetchTranslationsDto, FetchTranslationsDto } from '@skryba/shared';
import {
  apiRoutes,
  BulkFetchTranslationsResult,
  TranslationsResult,
} from '@skryba/domain-types';

export class ApiClient {
  constructor(private readonly url: string) {}

  async fetchTranslations(
    dto: FetchTranslationsDto
  ): Promise<TranslationsResult> {
    const url = this.setupUrl(apiRoutes.translate);

    const response = await fetch(url.toString(), {
      body: JSON.stringify(dto),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });

    if (response.status !== 200) {
      throw new Error('Failed to fetch translations');
    }

    return response.json();
  }

  private setupUrl(pathname: string) {
    const url = new URL(this.url);

    url.pathname = pathname;

    return url;
  }

  async bulkTranslate(
    dto: BulkFetchTranslationsDto
  ): Promise<BulkFetchTranslationsResult> {
    const url = this.setupUrl(apiRoutes.bulkTranslate);

    const response = await fetch(url.toString(), {
      body: JSON.stringify(dto),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });

    if (response.status !== 200) {
      throw new Error('Failed to bulk fetch translations');
    }

    return response.json();
  }
}
