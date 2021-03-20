export interface Constructor<T, Args = unknown> {
  new (...args: Args[]): T;
}
