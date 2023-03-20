import axios, {Axios, CreateAxiosDefaults} from 'axios';

// layer of abstraction allows easy change of underlying http request library
// and additional functionality to be introduced to all clients

class Client {
  protected instance: Axios;
  protected get: Axios['get'];
  protected put: Axios['put'];
  protected post: Axios['post'];
  protected patch: Axios['patch'];

  constructor(config: CreateAxiosDefaults) {
    this.instance = axios.create(config);
    this.get = this.instance.get;
    this.put = this.instance.put;
    this.post = this.instance.post;
    this.patch = this.instance.patch;
  }
}

export default Client;
