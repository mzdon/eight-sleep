import createDayDurationLib, {DEFAULT_STATE} from '../DayDurationLib';

describe('DayDurationLib', () => {
  let dayDurationLib: ReturnType<typeof createDayDurationLib>;
  beforeEach(() => {
    dayDurationLib = createDayDurationLib();
  });

  it('should have an expected default state', () => {
    expect(dayDurationLib.state).toEqual(DEFAULT_STATE);
  });

  describe('#seletInterval', () => {
    it('set selectedInterval', () => {
      dayDurationLib.selectInterval(1);
      expect(dayDurationLib.state.selectedInterval).toBe(1);
    });
  });
});
