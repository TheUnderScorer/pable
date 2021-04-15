import { FastifyInstance } from 'fastify';
import { bodySchemaValidator, RegisterRouteFn } from '@skryba/shared-server';
import { apiRoutes } from '@skryba/domain-types';
import {
  BulkFetchTranslations,
  FetchTranslations,
  translateDocument,
} from '@skryba/domain-backend';
import {
  BulkFetchTranslationsDto,
  FetchTranslationsDto,
  TranslateDocumentDto,
} from '@skryba/shared';
import Queue from 'queue';

export const languageRoutes: RegisterRouteFn = async (
  fastify: FastifyInstance
) => {
  fastify.route({
    url: apiRoutes.bulkTranslate,
    method: 'POST',
    preHandler: [bodySchemaValidator(BulkFetchTranslationsDto)],
    handler: async (request) => {
      const bulkFetchTranslations = request.container.resolve<BulkFetchTranslations>(
        'bulkFetchTranslations'
      );

      return bulkFetchTranslations(request.body as BulkFetchTranslationsDto);
    },
  });

  fastify.route({
    url: apiRoutes.translateDocument,
    method: 'POST',
    preHandler: [bodySchemaValidator(TranslateDocumentDto)],
    handler: async (request) => {
      return translateDocument(request.body as TranslateDocumentDto);
    },
  });

  fastify.route({
    url: apiRoutes.translate,
    method: 'POST',
    preHandler: [bodySchemaValidator(FetchTranslationsDto)],
    handler: async (request) => {
      return new Promise((resolve) => {
        const translationQueue = request.container.resolve<Queue>(
          'translationQueue'
        );

        const fetchTranslations = request.container.resolve<FetchTranslations>(
          'fetchTranslations'
        );

        translationQueue.push(async () => {
          const result = await fetchTranslations(
            request.body as FetchTranslationsDto
          );

          resolve(result);
        });
      });
    },
  });
};
