import { FastifyInstance } from 'fastify';
import { ValidationError } from '@skryba/shared';

export const errorHandler: FastifyInstance['errorHandler'] = async (
  error,
  request,
  reply
) => {
  if (error.statusCode) {
    reply.statusCode = error.statusCode;
  }

  return {
    name: error.name,
    message: error.message,
    details: error instanceof ValidationError ? error.details : undefined,
  };
};
