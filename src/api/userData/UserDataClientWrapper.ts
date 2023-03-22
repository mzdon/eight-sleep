import getConfig from '../../config';
import ClientWrapper from '../shared/ClientWrapper';
import UserDataClient from './UserDataClient';

class UserDataClientWrapper extends ClientWrapper<UserDataClient> {
  private baseURL: string;

  constructor(baseURL: string) {
    super(new UserDataClient({baseURL}));
    this.baseURL = baseURL;
  }

  public setToken(token: string): void {
    this.client = new UserDataClient({
      baseURL: this.baseURL,
      headers: {Authorization: `JWT ${token}`},
    });
  }
}

export default new UserDataClientWrapper(getConfig().userDataServiceUrl);
