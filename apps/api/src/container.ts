import { asFunction, asValue, createContainer as initContainer } from 'awilix';
import fastify from 'fastify';
import puppeteer from 'puppeteer';
import { makeFetchTranslations } from '@skryba/domain';
import { languageRoutes } from './app/languages/routes';
import { errorHandler, scopedContainer } from '@skryba/shared-server';
import { URL } from 'url';
import fastifyCors from 'fastify-cors';

export const createContainer = async () => {
  const container = initContainer();

  const port = process.env.PORT || 3000;
  const server = fastify({
    logger: true,
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

  return container;
};
