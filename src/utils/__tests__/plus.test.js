import plus from '../plus';

describe('plus', () => {
  test('1000 - 100', () => {
    const actual = plus(1000, 100);
    const expected = '1100';

    expect(actual).toBe(expected);
  });

  test('0.00000000001 - 0.000000000001', () => {
    const actual = plus(0.00000000001, 0.000000000001);
    const expected = '0.000000000011';
    expect(actual).toBe(expected);
  });
});
