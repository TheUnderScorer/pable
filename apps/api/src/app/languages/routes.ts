import { FastifyInstance } from 'fastify';
import { RegisterRouteFn } from '@pable/shared-server';
import { apiRoutes } from '@pable/domain-types';
import { FetchTranslations } from '@pable/domain';
import { FetchTranslationsDto } from '@pable/shared';
import { bodySchemaValidator } from '@pable/shared-server';

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
