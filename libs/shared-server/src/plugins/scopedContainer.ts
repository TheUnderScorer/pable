import { FastifyInstance } from 'fastify';
import { AwilixContainer } from 'awilix';

export const scopedContainer = (
  container: AwilixContainer,
  instance: FastifyInstance
) => {
  instance.addHook('preHandler', async (req) => {
    req.container = container.createScope();
  });

  instance.addHook('onResponse', async (req) => {
    if (req.container) {
      await req.container.dispose();
    }
  });
};
