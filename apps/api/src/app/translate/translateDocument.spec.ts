import { AwilixContainer } from 'awilix';
import { FastifyInstance } from 'fastify';
import { createContainer } from '../../container';
import { TranslateDocumentDto } from '@skryba/shared';
import { apiRoutes } from '@skryba/domain-types';

describe('/translate-document', () => {
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

  it('should translate document', async () => {
    const dto: TranslateDocumentDto = {
      content: 'I like dogs and cats',
      translations: [
        {
          sourceWord: 'dogs',
          targetWord: 'psy',
        },
        {
          sourceWord: 'cats',
          targetWord: 'koty',
        },
      ],
    };

    const response = await server.inject({
      url: apiRoutes.translateDocument,
      method: 'POST',
      payload: dto,
    });

    const body = JSON.parse(response.body);

    expect(body).toMatchInlineSnapshot(`
      Object {
        "document": Array [
          "I like ",
          Object {
            "id": "psy-7",
            "isRestored": false,
            "translation": Object {
              "sourceWord": "dogs",
              "targetWord": "psy",
            },
            "word": "dogs",
          },
          " and ",
          Object {
            "id": "koty-26",
            "isRestored": false,
            "translation": Object {
              "sourceWord": "cats",
              "targetWord": "koty",
            },
            "word": "cats",
          },
          "",
        ],
        "translatedEntries": 2,
      }
    `);
  });
});
