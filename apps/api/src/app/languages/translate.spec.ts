import { AwilixContainer } from 'awilix';
import { FastifyInstance } from 'fastify';
import { createContainer } from '../../container';
import { apiRoutes, Language, TranslationsResult } from '@skryba/domain-types';
import { FetchTranslationsDto } from '@skryba/shared';

describe(`/translate`, () => {
  let container: AwilixContainer;
  let server: FastifyInstance;

  beforeEach(async () => {
    container = await createContainer();
    server = container.resolve('server');
  });

  afterEach(async () => {
    if (server) {
      await server.close();

      await container.dispose();
    }
  });

  it('should fetch translations', async () => {
    const response = await server.inject({
      url: apiRoutes.translate,
      method: 'POST',
      payload: {
        word: 'Dogs are cool',
        sourceLanguage: Language.English,
        targetLanguage: Language.Polish,
      } as FetchTranslationsDto,
    });

    const body = JSON.parse(response.body) as TranslationsResult;

    expect(body.translation).toEqual('Psy są fajne');
  });
});
