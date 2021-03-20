import { FastifyInstance } from 'fastify';
import { RegisterRouteFn } from '@pable/shared-server';
import { apiRoutes, FetchTranslationsDto } from '@pable/domain-types';
import { FetchTranslations } from '@pable/domain';

export const languageRoutes: RegisterRouteFn = async (
  fastify: FastifyInstance
) => {
  // TODO validate schema
  fastify.route({
    url: apiRoutes.fetchLanguages,
    method: 'POST',
    handler: async (request) => {
      const fetchTranslations = request.container.resolve<FetchTranslations>(
        'fetchTranslations'
      );

      return fetchTranslations(request.body as FetchTranslationsDto);
    },
  });
};
