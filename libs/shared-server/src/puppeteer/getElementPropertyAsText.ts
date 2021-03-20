import { ElementHandle } from 'puppeteer';

export async function getElementPropertyAsText<T>(
  elementHandle: ElementHandle,
  prop: string
) {
  return await elementHandle
    .getProperty(prop)
    .then((prop) => prop.jsonValue<T>());
}
