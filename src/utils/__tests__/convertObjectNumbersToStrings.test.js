import convertObjectNumbersToStrings from '../convertObjectNumbersToStrings';

test('convertObjectNumbersToStrings', () => {
  const noop = jest.fn();

  const actual = convertObjectNumbersToStrings({
    count: 123,
    name: 'something',
    method: noop,
    amount: 15,
    items: [1, 2, 3],
    hash: { a: 'a' },
  });

  const expected = {
    count: '123',
    name: 'something',
    method: noop,
    amount: '15',
    items: [1, 2, 3],
    hash: { a: 'a' },
  };

  expect(actual).toEqual(expected);
});

test('convertObjectNumbersToStrings null data', () => {
  const actual = convertObjectNumbersToStrings();
  const expected = {};

  expect(actual).toEqual(expected);
});
