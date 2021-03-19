import { asFunction, asValue, createContainer as initContainer } from 'awilix';
import fastify from 'fastify';
import * as puppeteer from 'puppeteer';
import { makeFetchTranslations } from '@pable/domain';
import { languageRoutes } from './app/languages/routes';
import { scopedContainer } from '@pable/shared-server';

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
    fetchTranslations: asFunction(makeFetchTranslations).singleton(),
  });

  server.decorateRequest('container', '');
  server.register(languageRoutes);
  server.register(scopedContainer(container));

  return container;
};
