import rawToHex from '../rawToHex';

describe('rawToHex', () => {
  test('rawToHex(1234) -- returns valid Hex value', () => {
    const actual = rawToHex(1234);
    const expected = '000000000000000000000000000004D2';

    expect(actual).toBe(expected);
  });

  test('rawToHex(4200000000) -- returns valid Hex value', () => {
    const actual = rawToHex(4200000000);
    const expected = '000000000000000000000000FA56EA00';

    expect(actual).toBe(expected);
  });
});
