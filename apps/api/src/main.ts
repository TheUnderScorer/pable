import { createContainer } from './container';
import { FastifyInstance } from 'fastify';

const main = async () => {
  const container = await createContainer();
  const server = container.resolve<FastifyInstance>('server');
  const port = container.resolve<number>('port');

  const startResult = await server.listen(port, '0.0.0.0');

  console.log(`Server started on ${startResult}`);
};

main().catch(console.error);
