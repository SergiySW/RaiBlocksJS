

import { getAccountKey, getAccount, seedKey, isValidHash, checkSignature, publicFromPrivateKey, getAccountFromPrivateKey, signBlock, seedKeys, isValidAccount, computeBlockHash, open, receive, change, send } from '../';

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

describe('getAccountKey', () => {
  describe('throws on invalid account', () => {
    test('throws if special chars are used', () => {
      let testCase = () => getAccountKey('xrb_3E3j5tkog48pnny9dmfzj1r16pg8t1e76dz5tmac6iq689wyjfpi00000000');
      expect(testCase).toThrowError('Invalid account');
      testCase = () => getAccountKey('xrb_1!!j5tkog48pnny9dmfzj1r16pg8t1e76dz5tmac6iq689wyjfpi00000000');
      expect(testCase).toThrowError('Invalid account');
    });
  });

  test('throws if symbols do not match', () => {
    const testCase = () => getAccountKey('xrb_3e3j5tkog48pnny9dmfzj1r16pg8t1e76dz5tmac6iq689wyjfpi12345678');
    expect(testCase).toThrowError('Invalid symbols');
  });

  test('returns key if valid', () => {
    const key = getAccountKey('xrb_3i1aq1cchnmbn9x5rsbap8b15akfh7wj7pwskuzi7ahz8oq6cobd99d4r3b7');
    expect(key).toBeTruthy();
  });
});

describe('getAccount', () => {
  test('throws if key is invalid', () => {
    const testCase = () => getAccount('!008B814A7D269A1FA3C6528B19201A24D797912DB9996FF02A1FF356E45552B');
    expect(testCase).toThrowError('Invalid: Public key is not a valid hash');
  });

  test('returns account', () => {
    const account = getAccount('C008B814A7D269A1FA3C6528B19201A24D797912DB9996FF02A1FF356E45552B');
    expect(account.substr(0, 3)).toBe('xrb');
    expect(account.length).toBe(64);
  });
});

describe('seedKey', () => {
  test('throws if seed is invalid', () => {
    const testCase = () => seedKey('!008B814A7D269A1FA3C6528B19201A24D797912DB9996FF02A1FF356E45552B');
    expect(testCase).toThrowError('Invalid: Seed is not a valid hash');
  });

  test('throws if index is not an integer', () => {
    const testCase = () => seedKey('C008B814A7D269A1FA3C6528B19201A24D797912DB9996FF02A1FF356E45552B', null);
    expect(testCase).toThrowError('Invalid: index is not an integer');
  });

  test('returns a seeded key', () => {
    const key = seedKey('C008B814A7D269A1FA3C6528B19201A24D797912DB9996FF02A1FF356E45552B', 0);
    expect(isValidHash(key)).toBeTruthy();
  });
});

describe('seedKeys', () => {
  test('throws if seed is invalid', () => {
    const testCase = () => seedKeys('!008B814A7D269A1FA3C6528B19201A24D797912DB9996FF02A1FF356E45552B');
    expect(testCase).toThrowError('Invalid: Seed is not a valid hash');
  });

  test('throws if index is not an integer', () => {
    const testCase = () => seedKeys('C008B814A7D269A1FA3C6528B19201A24D797912DB9996FF02A1FF356E45552B', null);
    expect(testCase).toThrowError('Invalid: count is not an integer');
  });

  test('returns an array of seeded keys, default count', () => {
    const keys = seedKeys('C008B814A7D269A1FA3C6528B19201A24D797912DB9996FF02A1FF356E45552B');
    keys.forEach(key => expect(isValidHash(key)).toBeTruthy());
  });

  test('returns an array of seeded keys, count = 5', () => {
    const keys = seedKeys('C008B814A7D269A1FA3C6528B19201A24D797912DB9996FF02A1FF356E45552B', 5);
    expect(keys.length).toBe(5);
    keys.forEach(key => expect(isValidHash(key)).toBeTruthy());
  });
});

describe('checkSignature', () => {
  const blockHash = 'B8C51B22BFE48B358C437BE5ACE3F203BD5938A5231F4F1C177488E879317B5E';
  const account = 'xrb_39ymww61tksoddjh1e43mprw5r8uu1318it9z3agm7e6f96kg4ndqg9tuds4';
  const pubKey = getAccountKey(account);
  const signature = '0E5DC6C6CDBC96A9885B1DDB0E782BC04D9B2DCB107FDD4B8A3027695A3B3947BE8E6F413190AD304B8BC5129A50ECFB8DB918FAA3EEE2856C4449A329325E0A';

  test('throws if signature is invalid', () => {
    const testCase = () => checkSignature('!008B814A7D269A1FA3C6528B19201A24D797912DB9996FF02A1FF356E45552B');
    expect(testCase).toThrowError('Invalid signature. Needs to be a 64 byte hex encoded ed25519 signature.');
  });

  test('throws if not an account or 32 byte key', () => {
    const testCase = () => checkSignature('12323123', signature, '123241');
    expect(testCase).toThrowError('Invalid account');
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
    const testCase = () => publicFromPrivateKey('12323123');
    expect(testCase).toThrowError('Invalid secret key. Should be a 32 byte hex string.');
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
    const testCase = () => signBlock('B8C51B22BFE48B358C437BE5ACE3F203BD5938A5231F4F1C177488E879317B5E', '123342');
    expect(testCase).toThrowError('Invalid secret key. Should be a 32 byte hex string.');
  });
  test('throws if block hash is invalid', () => {
    const testCase = () => signBlock('123232', 'B8C51B22BFE48B358C437BE5ACE3F203BD5938A5231F4F1C177488E879317B5E');
    expect(testCase).toThrowError('Invalid block hash. Should be a 32 byte hex string.');
  });
  test('return public key', () => {
    const key = signBlock('B8C51B22BFE48B358C437BE5ACE3F203BD5938A5231F4F1C177488E879317B5E', 'B8C51B22BFE48B358C437BE5ACE3F203BD5938A5231F4F1C177488E879317B5E');
    expect(isValidHash(key, 64)).toBeTruthy();
  });
});

describe('computeBlockHash', () => {
  const previous = '8236334D6EF07F8ED8414B31B9375670F8D4CA8DFF3B086AE57F061B3AEECCD6';
  const destination = 'xrb_3dcfozsmekr1tr9skf1oa5wbgmxt81qepfdnt7zicq5x3hk65fg4fqj58mbr';
  const balance = '0000000665EA1FD2BB39ED14DE000000';
  const source = 'F8FB44774BD3843400BAEE0A41A64D791B43C9B9EC887F8C739558BEF14A210F';
  const account = 'xrb_19qqpxntqady4zqk34ad9eyy4q6tp4rkj8mejf589zzgqemqypmjufg6po1o';
  const representative = '8F02D66117CAC96AD0C66DB2DD583F8452D1CCE979FAEA5C72E4937F33F4ADA4';

  test('invalid block type', () => {
    const testCase = () => computeBlockHash('invalid', {});
    expect(testCase).toThrowError('Invalid block type.');
  });

  describe('send', () => {
    test('invalid previous param', () => {
      const params = {
        previous: '1234',
        destination,
        balance,
      };
      const testCase = () => computeBlockHash('send', params);
      expect(testCase).toThrowError('Invalid `send` parameters. Expected previous, destination and balance');
    });

    test('invalid destination param', () => {
      const params = {
        previous,
        destination: '12345',
        balance,
      };
      const testCase = () => computeBlockHash('send', params);
      expect(testCase).toThrowError('Invalid `send` parameters. Expected previous, destination and balance');
    });

    test('invalid balance param', () => {
      const params = {
        previous,
        destination,
        balance: '12345',
      };
      const testCase = () => computeBlockHash('send', params);
      expect(testCase).toThrowError('Invalid `send` parameters. Expected previous, destination and balance');
    });

    test('returns valid hash', () => {
      const params = {
        previous,
        destination,
        balance,
      };
      const hash = computeBlockHash('send', params);
      expect(isValidHash(hash)).toBeTruthy();
    });
  });

  describe('receive', () => {
    test('invalid source param', () => {
      const params = {
        source: '1234',
        previous,
      };
      const testCase = () => computeBlockHash('receive', params);
      expect(testCase).toThrowError('Invalid `receive` parameters. Expected previous and source');
    });

    test('invalid previous param', () => {
      const params = {
        source,
        previous: '12345',
      };
      const testCase = () => computeBlockHash('receive', params);
      expect(testCase).toThrowError('Invalid `receive` parameters. Expected previous and source');
    });

    test('returns valid hash', () => {
      const params = {
        source,
        previous,
      };
      const hash = computeBlockHash('receive', params);
      expect(isValidHash(hash)).toBeTruthy();
    });
  });

  describe('open', () => {
    test('invalid source param', () => {
      const params = {
        source: '1234',
        representative,
        account,
      };
      const testCase = () => computeBlockHash('open', params);
      expect(testCase).toThrowError('Invalid `open` parameters. Expected source, representative, and account');
    });

    test('invalid representative param', () => {
      const params = {
        source,
        representative: '12345',
        account,
      };
      const testCase = () => computeBlockHash('open', params);
      expect(testCase).toThrowError('Invalid `open` parameters. Expected source, representative, and account');
    });

    test('invalid account param', () => {
      const params = {
        source,
        representative,
        account: '12345',
      };
      const testCase = () => computeBlockHash('open', params);
      expect(testCase).toThrowError('Invalid `open` parameters. Expected source, representative, and account');
    });

    test('returns valid hash', () => {
      const params = {
        source,
        representative,
        account,
      };
      const hash = computeBlockHash('open', params);
      expect(isValidHash(hash)).toBeTruthy();
    });
  });

  describe('change', () => {
    test('invalid previous param', () => {
      const params = {
        previous: '12345',
        representative,
      };
      const testCase = () => computeBlockHash('change', params);
      expect(testCase).toThrowError('Invalid `change` parameters. Expected previous and representative');
    });

    test('invalid representative param', () => {
      const params = {
        previous,
        representative: '12345',
      };
      const testCase = () => computeBlockHash('change', params);
      expect(testCase).toThrowError('Invalid `change` parameters. Expected previous and representative');
    });

    test('returns valid hash', () => {
      const params = {
        previous,
        representative,
      };
      const hash = computeBlockHash('change', params);
      expect(isValidHash(hash)).toBeTruthy();
    });
  });
});

describe('open', () => {
  const block = open({
    privateKey: 'B8C51B22BFE48B358C437BE5ACE3F203BD5938A5231F4F1C177488E879317B5E',
    work: '7b4199da8c51bac8',
    source: 'A170D51B94E00371ACE76E35AC81DC9405D5D04D4CEBC399AEACE07AE05DD293',
  });

  describe('block with default representative', () => {
    test('block.account is valid', () => {
      expect(isValidHash(block.account)).toBeTruthy();
    });
    test('block.signature is valid', () => {
      expect(isValidHash(block.signature, 64)).toBeTruthy();
    });
  });

  describe('block with custom representative', () => {
    block.representative = 'xrb_1awsn43we17c1oshdru4azeqjz9wii41dy8npubm4rg11so7dx3jtqgoeahy';
    test('block.account is valid', () => {
      expect(isValidHash(block.account)).toBeTruthy();
    });
    test('block.signature is valid', () => {
      expect(isValidHash(block.signature, 64)).toBeTruthy();
    });
  });
});

describe('receive', () => {
  const block = receive({
    privateKey: 'B8C51B22BFE48B358C437BE5ACE3F203BD5938A5231F4F1C177488E879317B5E',
    work: '7b4199da8c51bac8',
    source: 'A170D51B94E00371ACE76E35AC81DC9405D5D04D4CEBC399AEACE07AE05DD293',
    previous: '9B28339C2426642B11A8477F83CF40442CB13B89FEC8173673F8D1AF41FF2827',
  });

  test('block.signature is valid', () => {
    expect(isValidHash(block.signature, 64)).toBeTruthy();
  });
});

describe('change', () => {
  const params = {
    privateKey: 'B8C51B22BFE48B358C437BE5ACE3F203BD5938A5231F4F1C177488E879317B5E',
    work: '7b4199da8c51bac8',
    previous: '9B28339C2426642B11A8477F83CF40442CB13B89FEC8173673F8D1AF41FF2827',
  };

  describe('block with default representative', () => {
    const block = change(params);
    test('block.signature is valid', () => {
      expect(isValidHash(block.signature, 64)).toBeTruthy();
    });
  });

  describe('block with custom representative', () => {
    params.representative = 'xrb_1awsn43we17c1oshdru4azeqjz9wii41dy8npubm4rg11so7dx3jtqgoeahy';
    const block = change(params);
    test('block.signature is valid', () => {
      expect(isValidHash(block.signature, 64)).toBeTruthy();
    });
  });
});

describe('send', () => {
  const params = {
    privateKey: 'B8C51B22BFE48B358C437BE5ACE3F203BD5938A5231F4F1C177488E879317B5E',
    work: '7b4199da8c51bac8',
    previous: '9B28339C2426642B11A8477F83CF40442CB13B89FEC8173673F8D1AF41FF2827',
    destination: 'xrb_3dcfozsmekr1tr9skf1oa5wbgmxt81qepfdnt7zicq5x3hk65fg4fqj58mbr',
    oldBalance: '423000000000000000000000000000000',
    amount: '3000000000000000000000000000000',
  };

  describe('block with default representative', () => {
    const block = send(params);
    test('block.signature is valid', () => {
      expect(isValidHash(block.signature, 64)).toBeTruthy();
    });
  });

  describe('block with custom unit', () => {
    params.unit = 'XRB';
    params.oldBalance = '423';
    params.amount = '3';
    const block = send(params);

    test('block.signature is valid', () => {
      expect(isValidHash(block.signature, 64)).toBeTruthy();
    });
  });

  describe('sending more than availble in account', () => {
    params.unit = 'XRB';
    params.oldBalance = '423';
    params.amount = '432';
    const testCase = () => send(params);

    test('it will throw an error', () => {
      expect(testCase).toThrowError('Subtraction will result in negative value');
    });
  });
});
