import getSuccessResponse from '../getSuccessResponse';

describe('getSuccessResponse', () => {
  test('success true', () => {
    expect(getSuccessResponse({ success: '1' })).toEqual({ success: true });
  });

  test('success false', () => {
    expect(getSuccessResponse({ error: '1' })).toEqual({ success: false });
  });
});
