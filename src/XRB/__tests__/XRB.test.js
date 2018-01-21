

import { getAccountKey, getAccount, seedKey, isValidHash, checkSignature, publicFromPrivateKey, getAccountFromPrivateKey, signBlock } from '../';

describe('isValidHash', () => {
  test('throw error if bytes isnt 32 or 64', () => {
    const test = () => isValidHash('C008B814A7D269A1FA3C6528B19201A24D797912DB9996FF02A1FF356E45552B', 33);
    expect(test).toThrowError('Bytes must be 32 or 64, 33 supplied');
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

  test('64 bytes: return true if hash correct', () => {
    const hash = 'C008B814A7D269A1FA3C6528B19201A24D797912DB9996FF02A1FF356E45552BC008B814A7D269A1FA3C6528B19201A24D797912DB9996FF02A1FF356E45552B';
    const validatedHash = isValidHash(hash, 64);
    expect(validatedHash).toBeTruthy();
  });
});

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
  test('throws if key is invalid', () => {
    const test = () => getAccount('!008B814A7D269A1FA3C6528B19201A24D797912DB9996FF02A1FF356E45552B');
    expect(test).toThrowError('Invalid: Public key is not a valid hash');
  });

  test('returns account', () => {
    const account = getAccount('C008B814A7D269A1FA3C6528B19201A24D797912DB9996FF02A1FF356E45552B');
    expect(account.substr(0, 3)).toBe('xrb');
    expect(account.length).toBe(64);
  });
});

describe('seedKey', () => {
  test('throws if seed is invalid', () => {
    const test = () => seedKey('!008B814A7D269A1FA3C6528B19201A24D797912DB9996FF02A1FF356E45552B');
    expect(test).toThrowError('Invalid: Seed is not a valid hash');
  });

  test('throws if index is not an integer', () => {
    const test = () => seedKey('C008B814A7D269A1FA3C6528B19201A24D797912DB9996FF02A1FF356E45552B', null);
    expect(test).toThrowError('Invalid: index is not an integer');
  });

  test('returns a seeded key', () => {
    const key = seedKey('C008B814A7D269A1FA3C6528B19201A24D797912DB9996FF02A1FF356E45552B', 0);
    expect(isValidHash(key)).toBeTruthy();
  });
});

describe('checkSignature', () => {
  const blockHash = 'B8C51B22BFE48B358C437BE5ACE3F203BD5938A5231F4F1C177488E879317B5E';
  const account = 'xrb_39ymww61tksoddjh1e43mprw5r8uu1318it9z3agm7e6f96kg4ndqg9tuds4';
  const pubKey = getAccountKey(account);
  const signature = '0E5DC6C6CDBC96A9885B1DDB0E782BC04D9B2DCB107FDD4B8A3027695A3B3947BE8E6F413190AD304B8BC5129A50ECFB8DB918FAA3EEE2856C4449A329325E0A';

  test('throws if signature is invalid', () => {
    const test = () => checkSignature('!008B814A7D269A1FA3C6528B19201A24D797912DB9996FF02A1FF356E45552B');
    expect(test).toThrowError('Invalid signature. Needs to be a 64 byte hex encoded ed25519 signature.');
  });

  test('throws if not an account or 32 byte key', () => {
    const test = () => checkSignature('12323123', signature, '123241');
    expect(test).toThrowError('Invalid account');
  });

  test('verifies hex encoded key', () => {
    const verfication = checkSignature(blockHash, signature, account);
    expect(verfication).toBeTruthy();
  });

  test('verifies account', () => {
    const verfication = checkSignature(blockHash, signature, pubKey);
    expect(verfication).toBeTruthy();
  });
});

describe('publicFromPrivateKey', () => {
  test('throws if not an account or 32 byte key', () => {
    const test = () => publicFromPrivateKey('12323123');
    expect(test).toThrowError('Invalid secret key. Should be a 32 byte hex string.');
  });
  test('return public key', () => {
    const key = publicFromPrivateKey('B8C51B22BFE48B358C437BE5ACE3F203BD5938A5231F4F1C177488E879317B5E');
    expect(isValidHash(key)).toBeTruthy();
  });
});

describe('getAccountFromPrivateKey', () => {
  test('return account', () => {
    const key = getAccountFromPrivateKey('B8C51B22BFE48B358C437BE5ACE3F203BD5938A5231F4F1C177488E879317B5E');
    expect(key.substr(0, 3)).toBe('xrb');
  });
});

describe('signBlock', () => {
  test('throws if secret key is invalid', () => {
    const test = () => signBlock('B8C51B22BFE48B358C437BE5ACE3F203BD5938A5231F4F1C177488E879317B5E', '123342');
    expect(test).toThrowError('Invalid secret key. Should be a 32 byte hex string.');
  });
  test('throws if block hash is invalid', () => {
    const test = () => signBlock('123232', 'B8C51B22BFE48B358C437BE5ACE3F203BD5938A5231F4F1C177488E879317B5E');
    expect(test).toThrowError('Invalid block hash. Should be a 32 byte hex string.');
  });
  test('return public key', () => {
    const key = signBlock('B8C51B22BFE48B358C437BE5ACE3F203BD5938A5231F4F1C177488E879317B5E', 'B8C51B22BFE48B358C437BE5ACE3F203BD5938A5231F4F1C177488E879317B5E');
    console.log(key.length);
    expect(isValidHash(key, 64)).toBeTruthy();
  });
});
