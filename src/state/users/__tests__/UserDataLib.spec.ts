import createUserDataLib, {DEFAULT_STATE} from '../UserLib';

describe('UserDataLib', () => {
  let userLib: ReturnType<typeof createUserDataLib>;
  beforeEach(() => {
    userLib = createUserDataLib();
  });

  it('should have an expected default state', () => {
    expect(userLib.state).toEqual(DEFAULT_STATE);
  });

  describe('#selectUser', () => {
    it('sets selectedUserUuid', () => {
      userLib.selectUser('uuid');
      expect(userLib.state.selectedUserUuid).toBe('uuid');
    });
  });

  describe('#fetchUsers', () => {
    it('should fetch users', async () => {
      userLib.fetchUsers();
      await userLib.state._fetchPromise;
      expect(userLib.state.users.length).toBeGreaterThan(0);
    });
  });
});
