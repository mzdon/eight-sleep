import Client from './Client';

abstract class ClientWrapper<T extends Client> {
  protected client: T;

  constructor(client: T) {
    this.client = client;
  }

  public getClient(): T {
    return this.client;
  }

  public abstract setToken(token: string): void;
}

export default ClientWrapper;
