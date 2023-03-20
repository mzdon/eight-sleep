import SleepDataClient from '../SleepDataClient';
import SleepDataClientWrapper from '../SleepDataClientWrapper';

describe('SleepDataClientWrapper', () => {
  it('should only be avaiable as an instance', () => {
    expect(SleepDataClientWrapper.getClient).toBeDefined();
    expect(SleepDataClientWrapper.setToken).toBeDefined();
  });

  describe('#getClient', () => {
    it('should return the wrapped client instance', () => {
      expect(SleepDataClientWrapper.getClient()).toBeInstanceOf(
        SleepDataClient,
      );
    });
  });

  describe('#setToken', () => {
    it('should create a new instance of the SleepDataClient', () => {
      const client = SleepDataClientWrapper.getClient();
      SleepDataClientWrapper.setToken('token');
      const newClient = SleepDataClientWrapper.getClient();
      expect(client).not.toBe(newClient);
      expect(client instanceof SleepDataClient).toBe(true);
      expect(newClient instanceof SleepDataClient).toBe(true);
    });
  });
});
