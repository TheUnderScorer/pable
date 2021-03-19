import { FastifyInstance } from 'fastify';
import { RegisterRouteFn } from '@pable/shared-server';

export const languageRoutes: RegisterRouteFn = (fastify: FastifyInstance) => {
  fastify.get('/', (req) => {});
};
