import { validateAccountKey } from '../';


describe('validateAccountKey', () => {
  describe('throws on invalid account', () => {
    test('throws when account isnt 64 characters', () => {
      let test = () => validateAccountKey('xrb_1232123');
      expect(test).toThrowError('Invalid account');
      test = () => validateAccountKey('xrb_3232123');
      expect(test).toThrowError('Invalid account');
    });

    test('throws when account doesn\'t start with xrb_1 or xrb_3', () => {
      let test = () => validateAccountKey('xrb_4e3j5tkog48pnny9dmfzj1r16pg8t1e76dz5tmac6iq689wyjfpi00000000');
      expect(test).toThrowError('Invalid account');
      test = () => validateAccountKey('xrb_0e3j5tkog48pnny9dmfzj1r16pg8t1e76dz5tmac6iq689wyjfpi00000000');
      expect(test).toThrowError('Invalid account');
    });

    test('throws if special chars are used', () => {
      let test = () => validateAccountKey('xrb_3E3j5tkog48pnny9dmfzj1r16pg8t1e76dz5tmac6iq689wyjfpi00000000');
      expect(test).toThrowError('Invalid account');
      test = () => validateAccountKey('xrb_1!!j5tkog48pnny9dmfzj1r16pg8t1e76dz5tmac6iq689wyjfpi00000000');
      expect(test).toThrowError('Invalid account');
    });
  });

  test('throws if symbols do not match', () => {
    const test = () => validateAccountKey('xrb_3e3j5tkog48pnny9dmfzj1r16pg8t1e76dz5tmac6iq689wyjfpi12345678');
    expect(test).toThrowError('Invalid symbols');
  });

  test('returns key if valid', () => {
    const key = validateAccountKey('xrb_3e3j5tkog48pnny9dmfzj1r16pg8t1e76dz5tmac6iq689wyjfpi12345678');

    console.log(key);

  });
});
