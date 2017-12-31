import RaiCommunity from '../community';

describe('RaiCommunity', () => {
  const rai = new RaiCommunity();

  test('is an instance of RaiCommunity', () => {
    expect(rai instanceof RaiCommunity).toBeTruthy();
  });

  describe('.json()', () => {
    test('is a function', () => {
      expect(typeof rai.json).toBe('function');
    });
  });
});
