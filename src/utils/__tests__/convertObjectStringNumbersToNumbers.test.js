import convertObjectStringNumbersToNumbers from '../convertObjectStringNumbersToNumbers';

test('convertObjectNumbersToStrings', () => {
  const noop = jest.fn();

  const actual = convertObjectStringNumbersToNumbers({
    count: '123',
    name: 'something',
    method: noop,
    amount: '15',
    items: [1, 2, 3],
    hash: { a: 'a' },
  });

  const expected = {
    count: 123,
    name: 'something',
    method: noop,
    amount: 15,
    items: [1, 2, 3],
    hash: { a: 'a' },
  };

  expect(actual).toEqual(expected);
});

test('convertObjectNumbersToStrings is null', () => {
  const actual = convertObjectStringNumbersToNumbers();
  const expected = {};

  expect(actual).toEqual(expected);
});
