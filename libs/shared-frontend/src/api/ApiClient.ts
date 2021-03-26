import { FetchTranslationsDto } from '@skryba/shared';
import { apiRoutes, FetchTranslationsResult } from '@skryba/domain-types';

export class ApiClient {
  constructor(private readonly url: string) {}

  async fetchTranslations(
    dto: FetchTranslationsDto
  ): Promise<FetchTranslationsResult> {
    const url = new URL(this.url);
    url.pathname = apiRoutes.fetchLanguages;

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
}
