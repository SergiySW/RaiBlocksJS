import { isValidAccount, isValidHash } from '../utils';

describe('isValidAccount', () => {
  test('return false when account isnt 64 characters', () => {
    let isValid = isValidAccount('xrb_1232123');
    expect(isValid).toBeFalsy();
    isValid = isValidAccount('xrb_3232123');
    expect(isValid).toBeFalsy();
  });

  test('throws when account doesn\'t start with xrb_1 or xrb_3', () => {
    let isValid = isValidAccount('xrb_4e3j5tkog48pnny9dmfzj1r16pg8t1e76dz5tmac6iq689wyjfpi00000000');
    expect(isValid).toBeFalsy();
    isValid = isValidAccount('xrb_0e3j5tkog48pnny9dmfzj1r16pg8t1e76dz5tmac6iq689wyjfpi00000000');
    expect(isValid).toBeFalsy();
  });

  test('returns true if account is valid', () => {
    const isValid = isValidAccount('xrb_3e3j5tkog48pnny9dmfzj1r16pg8t1e76dz5tmac6iq689wyjfpi00000000');
    expect(isValid).toBeTruthy();
  });
});

describe('isValidHash', () => {
  test('throw error if bytes isnt 32 or 64', () => {
    const testCase = () => isValidHash('C008B814A7D269A1FA3C6528B19201A24D797912DB9996FF02A1FF356E45552B', 33);
    expect(testCase).toThrowError('Bytes must be 16, 32 or 64, 33 supplied');
  });

  test('return false if if hash doesnt match regex', () => {
    const validatedHash = isValidHash('!008B814A7D269A1FA3C6528B19201A24D797912DB9996FF02A1FF356E45552B');
    expect(validatedHash).toBeFalsy();
  });

  test('return false if hash is not 64 chars long', () => {
    const validatedHash = isValidHash('1234ADEFEFEF');
    expect(validatedHash).toBeFalsy();
  });

  test('return true if hash correct', () => {
    const validatedHash = isValidHash('C008B814A7D269A1FA3C6528B19201A24D797912DB9996FF02A1FF356E45552B');
    expect(validatedHash).toBeTruthy();
  });

  test('16 bytes: return true if hash correct', () => {
    const hash = '1A24D797912DB9996FF02A1FF356E455';
    const validatedHash = isValidHash(hash, 16);
    expect(validatedHash).toBeTruthy();
  });

  test('64 bytes: return true if hash correct', () => {
    const hash = 'C008B814A7D269A1FA3C6528B19201A24D797912DB9996FF02A1FF356E45552BC008B814A7D269A1FA3C6528B19201A24D797912DB9996FF02A1FF356E45552B';
    const validatedHash = isValidHash(hash, 64);
    expect(validatedHash).toBeTruthy();
  });
});
