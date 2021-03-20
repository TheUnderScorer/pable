import { RouteHandler } from 'fastify';
import { BaseSchemaConstructor } from '@pable/shared';

export const bodySchemaValidator = <T extends BaseSchemaConstructor<unknown>>(
  schema: T
): RouteHandler => async (request) => {
  request.body = schema.validate(request.body);
};

export const querySchemaValidator = <T extends BaseSchemaConstructor<unknown>>(
  schema: T
): RouteHandler => async (request) => {
  request.query = schema.validate(request.query);
};
