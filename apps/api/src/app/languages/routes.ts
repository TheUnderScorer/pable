import { FastifyInstance } from 'fastify';
import { RegisterRouteFn } from '@skryba/shared-server';
import { apiRoutes } from '@skryba/domain-types';
import { FetchTranslations } from '@skryba/domain';
import { FetchTranslationsDto } from '@skryba/shared';
import { bodySchemaValidator } from '@skryba/shared-server';

export const languageRoutes: RegisterRouteFn = async (
  fastify: FastifyInstance
) => {
  // TODO validate schema
  fastify.route({
    url: apiRoutes.fetchLanguages,
    method: 'POST',
    preHandler: [bodySchemaValidator(FetchTranslationsDto)],
    handler: async (request) => {
      const fetchTranslations = request.container.resolve<FetchTranslations>(
        'fetchTranslations'
      );

      return fetchTranslations(request.body as FetchTranslationsDto);
    },
  });
};
