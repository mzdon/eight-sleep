import {Client} from '../shared';
import {mockUsers} from './mockData';
import {UserDataResponse} from './types';

class UserDataClient extends Client {
  public async fetchUsers(): Promise<UserDataResponse> {
    // return Promise.reject(new HttpError('Failed to request user data', 500));
    return Promise.resolve(mockUsers);
  }
}

export default UserDataClient;
