import { createContainer } from './container';
import { FastifyInstance } from 'fastify';

const main = async () => {
  const container = await createContainer();
  const server = container.resolve<FastifyInstance>('server');
  const port = container.resolve<number>('port');

  server.listen(port, '0.0.0.0').then((address) => {
    server.log.info(`Server started on ${address}`);
  });
};

process.once('SIGUSR2', function () {
  process.kill(process.pid, 'SIGUSR2');
});

main().catch((error) => {
  console.error(error);

  process.exit(1);
});
