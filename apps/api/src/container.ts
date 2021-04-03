import { asFunction, asValue, createContainer as initContainer } from 'awilix';
import fastify from 'fastify';
import puppeteer from 'puppeteer';
import { makeFetchTranslations } from '@skryba/domain-backend';
import { languageRoutes } from './app/languages/routes';
import { errorHandler, scopedContainer } from '@skryba/shared-server';
import { URL } from 'url';
import fastifyCors from 'fastify-cors';
import { apiRoutes } from '@skryba/domain-types';

export const createContainer = async () => {
  let https = false;

  const container = initContainer();

  if (process.env.CERT && process.env.CERT_KEY) {
    console.log(
      `Found CERT and CERT_KEY variables, will be using https then 👍`
    );

    https = true;
  } else {
    console.log('No keys found, going with http then.');
  }

  const port = process.env.PORT || 3000;
  const server = fastify({
    logger: true,
    https: https
      ? {
          key: process.env.CERT_KEY,
          cert: process.env.CERT,
        }
      : undefined,
  });

  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
    executablePath: process.env.PUPPETER_EXECUTABLE_PATH,
    headless: true,
  });

  container.register({
    port: asValue(port),
    server: asValue(server),
    browser: asValue(browser),
    deeplUrl: asValue(new URL('https://www.deepl.com')),
    fetchTranslations: asFunction(makeFetchTranslations).singleton(),
  });

  server.setErrorHandler(errorHandler);

  server.decorateRequest('container', '');

  server.register(fastifyCors);
  server.register(languageRoutes);

  scopedContainer(container, server);

  server.get(apiRoutes.health, async (_request, reply) => {
    reply.status(200);

    return {
      result: true,
      version: process.env.VERSION ?? 'dev',
    };
  });

  return container;
};
