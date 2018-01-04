import getConversion, { convertFromRaw } from '../getConversion';

describe('getConversion', () => {
  test('raw -> raw', () => {
    const actual = getConversion({
      value: '1234',
      from: 'raw',
      to: 'raw',
    });
    expect(actual).toBe('1234');
  });

  test('raw -> XRB', () => {
    const actual = getConversion({
      value: 1234,
      from: 'raw',
      to: 'XRB',
    });
    expect(actual).toBe('0.000000000000000000000000001234');
  });

  test('raw -> mrai', () => {
    const actual = getConversion({
      value: 1234,
      from: 'raw',
      to: 'mrai',
    });
    expect(actual).toBe('0.000000000000000001234');
  });

  test('XRB -> raw', () => {
    const actual = getConversion({
      value: 1234,
      from: 'XRB',
      to: 'raw',
    });
    expect(actual).toBe('1234000000000000000000000000000000');
  });

  test('mrai -> raw', () => {
    const actual = getConversion({
      value: 1234,
      from: 'mrai',
      to: 'raw',
    });
    expect(actual).toBe('1234000000000000000000000');
  });

  test('unknown `from` throws an error', () => {
    const testError = () => {
      getConversion({
        value: 1234,
        from: 'beep',
        to: 'raw',
      });
    };
    expect(testError).toThrow(/beep.+from/);
  });

  test('unknown `to` throws an error', () => {
    const testError = () => {
      getConversion({
        value: 1234,
        from: 'XRB',
        to: 'boop',
      });
    };
    expect(testError).toThrow(/boop.+to/);
  });
});

describe('convertFromRaw', () => {
  test('XRB', () => {
    const actual = convertFromRaw(1234, 'XRB');
    expect(actual).toBe('0.000000000000000000000000001234');
  });

  test('mrai', () => {
    const actual = convertFromRaw(1234, 'mrai');
    expect(actual).toBe('0.000000000000000001234');
  });
});
