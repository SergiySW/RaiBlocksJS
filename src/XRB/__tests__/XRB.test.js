import { getAccountKey, getAccount, seedKey } from '../';


describe('getAccountKey', () => {
  describe('throws on invalid account', () => {
    test('throws when account isnt 64 characters', () => {
      let test = () => getAccountKey('xrb_1232123');
      expect(test).toThrowError('Invalid account');
      test = () => getAccountKey('xrb_3232123');
      expect(test).toThrowError('Invalid account');
    });

    test('throws when account doesn\'t start with xrb_1 or xrb_3', () => {
      let test = () => getAccountKey('xrb_4e3j5tkog48pnny9dmfzj1r16pg8t1e76dz5tmac6iq689wyjfpi00000000');
      expect(test).toThrowError('Invalid account');
      test = () => getAccountKey('xrb_0e3j5tkog48pnny9dmfzj1r16pg8t1e76dz5tmac6iq689wyjfpi00000000');
      expect(test).toThrowError('Invalid account');
    });

    test('throws if special chars are used', () => {
      let test = () => getAccountKey('xrb_3E3j5tkog48pnny9dmfzj1r16pg8t1e76dz5tmac6iq689wyjfpi00000000');
      expect(test).toThrowError('Invalid account');
      test = () => getAccountKey('xrb_1!!j5tkog48pnny9dmfzj1r16pg8t1e76dz5tmac6iq689wyjfpi00000000');
      expect(test).toThrowError('Invalid account');
    });
  });

  test('throws if symbols do not match', () => {
    const test = () => getAccountKey('xrb_3e3j5tkog48pnny9dmfzj1r16pg8t1e76dz5tmac6iq689wyjfpi12345678');
    expect(test).toThrowError('Invalid symbols');
  });

  test('returns key if valid', () => {
    const key = getAccountKey('xrb_3i1aq1cchnmbn9x5rsbap8b15akfh7wj7pwskuzi7ahz8oq6cobd99d4r3b7');
    expect(key).toBeTruthy();
  });
});

describe('getAccount', () => {
  test('throws if key doesnt match regex', () => {
    const test = () => getAccount('!008B814A7D269A1FA3C6528B19201A24D797912DB9996FF02A1FF356E45552B');
    expect(test).toThrowError('Invalid: Public key is not a valid hex');
  });

  test('throws if key is not 64 chars long', () => {
    const test = () => getAccount('1234ADEFEFEF');
    expect(test).toThrowError('Invalid: Public is not 64 bit');
  });

  test('returns account', () => {
    const account = getAccount('C008B814A7D269A1FA3C6528B19201A24D797912DB9996FF02A1FF356E45552B');
    expect(account.substr(0, 3)).toBe('xrb');
    expect(account.length).toBe(64);
  });
});

describe('seedKey', () => {

});
