import {Client} from '../shared';
import {mockUsers} from './mockData';
import {UserDataResponse} from './types';

class UserDataClient extends Client {
  public async fetchUsers(): Promise<UserDataResponse> {
    return Promise.resolve(mockUsers);
  }
}

export default UserDataClient;
