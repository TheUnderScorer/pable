import { AwilixContainer } from 'awilix';
import { FastifyInstance } from 'fastify';
import { createContainer } from '../../container';
import {
  apiRoutes,
  BulkFetchTranslationsResult,
  Language,
} from '@skryba/domain-types';
import { BulkFetchTranslationsDto } from '@skryba/shared';

describe(`/bulk-translate`, () => {
  let container: AwilixContainer;
  let server: FastifyInstance;

  beforeEach(async () => {
    container = await createContainer();
    server = container.resolve('server');
  });

  afterEach(async () => {
    if (server) {
      server.close();

      await container.dispose();
    }
  });

  it('should fetch bulk translations', async () => {
    const response = await server.inject({
      url: apiRoutes.bulkTranslate,
      method: 'POST',
      payload: {
        entries: [
          {
            word: 'Dogs are cool',
            sourceLanguage: Language.English,
            targetLanguage: Language.Polish,
          },
          {
            word: 'Cats are cool too',
            sourceLanguage: Language.English,
            targetLanguage: Language.Polish,
          },
        ],
      } as BulkFetchTranslationsDto,
    });

    const body = JSON.parse(response.body) as BulkFetchTranslationsResult;

    expect(body.translations[0].translation).toEqual('Psy są fajne');
    expect(body.translations[1].translation).toEqual('Koty też są fajne');
  });
});
