import { asFunction, asValue, createContainer as initContainer } from 'awilix';
import fastify from 'fastify';
import puppeteer from 'puppeteer';
import { makeFetchTranslations } from '@pable/domain';
import { languageRoutes } from './app/languages/routes';
import { scopedContainer } from '@pable/shared-server';
import { URL } from 'url';

export const createContainer = async () => {
  const container = initContainer();

  const port = process.env.PORT || 3333;
  const server = fastify({
    logger: true,
  });

  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
    executablePath: process.env.PUPPETER_EXECUTABLE_PATH,
  });

  container.register({
    port: asValue(port),
    server: asValue(server),
    browser: asValue(browser),
    deeplUrl: asValue(new URL('https://www.deepl.com')),
    fetchTranslations: asFunction(makeFetchTranslations).singleton(),
  });

  server.decorateRequest('container', '');

  await server.register(languageRoutes);

  scopedContainer(container, server);

  return container;
};
