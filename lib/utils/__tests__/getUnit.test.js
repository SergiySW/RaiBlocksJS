import getUnit from '../getUnit';

describe('getUnit', () => {
  test('raw -> raw', () => {
    const actual = getUnit('1234', 'raw', 'raw');
    expect(actual).toBe('1234');
  });
  test('raw -> XRB', () => {
    const actual = getUnit(1234, 'raw', 'XRB');
    expect(actual).toBe('0.000000000000000000000000001234');
  });
  test('raw -> mrai', () => {
    const actual = getUnit(1234, 'raw', 'mrai');
    expect(actual).toBe('0.000000000000000001234');
  });
  test('XRB -> raw', () => {
    const actual = getUnit(1234, 'XRB', 'raw');
    expect(actual).toBe('1234000000000000000000000000000000');
  });
  test('mrai -> raw', () => {
    const actual = getUnit(1234, 'mrai', 'raw');
    expect(actual).toBe('1234000000000000000000000');
  });

  test('unknown input throws an error', () => {
    const testError = () => {
      getUnit(1234, 'beep', 'raw');
    };
    expect(testError).toThrow(/beep.+input/);
  });

  test('unknown output throws an error', () => {
    const testError = () => {
      getUnit(1234, 'XRB', 'boop');
    };
    expect(testError).toThrow(/boop.+output/);
  });
});
