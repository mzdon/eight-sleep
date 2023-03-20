import getConfig from '../../config';
import ClientWrapper from '../shared/ClientWrapper';
import SleepDataClient from './SleepDataClient';

class SleepDataClientWrapper extends ClientWrapper<SleepDataClient> {
  private baseURL: string;

  constructor(baseURL: string) {
    super(new SleepDataClient({baseURL}));
    this.baseURL = baseURL;
  }

  public setToken(token: string): void {
    this.client = new SleepDataClient({
      baseURL: this.baseURL,
      headers: {Authorization: `JWT ${token}`},
    });
  }
}

export default new SleepDataClientWrapper(getConfig().sleepDataServiceUrl);
