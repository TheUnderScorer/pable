import { FastifyInstance } from 'fastify';
import { bodySchemaValidator, RegisterRouteFn } from '@skryba/shared-server';
import { apiRoutes } from '@skryba/domain-types';
import { FetchTranslations } from '@skryba/domain-backend';
import { FetchTranslationsDto } from '@skryba/shared';
import Queue from 'queue';

export const languageRoutes: RegisterRouteFn = async (
  fastify: FastifyInstance
) => {
  // TODO validate schema
  fastify.route({
    url: apiRoutes.fetchLanguages,
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
