import minus from '../minus';

describe('minus', () => {
  test('1000 - 100', () => {
    const actual = minus(1000, 100);
    const expected = '900';

    expect(actual).toBe(expected);
  });

  test('0.00000000001 - 0.000000000001', () => {
    const actual = minus(0.00000000001, 0.000000000001);
    const expected = '0.000000000009';
    expect(actual).toBe(expected);
  });

  test('negative value throws an error', () => {
    const actual = () => minus(100, 1000);
    expect(actual).toThrow();
  });
});
