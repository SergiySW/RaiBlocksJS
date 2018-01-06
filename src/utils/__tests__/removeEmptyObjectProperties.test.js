import removeEmptyObjectProperties from '../removeEmptyObjectProperties';

describe('removeEmptyObjectProperties', () => {
  it('strips out all undefined values', () => {
    const obj = {
      a: 'a',
      b: 'b',
      c: null,
      d: undefined,
    };

    expect(removeEmptyObjectProperties(obj)).toEqual({ a: 'a', b: 'b' });
  });
});
