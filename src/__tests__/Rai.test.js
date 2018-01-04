import Rai from '../Rai';
import packageJSON from '../../package.json';
import Account from '../lib/Account';
import Accounts from '../lib/Accounts';
import Blocks from '../lib/Blocks';
import Wallet from '../lib/Wallet';

const { testURL } = packageJSON.jest;

const rai = new Rai(testURL);

const testMethodPresence = (method) => {
  test(method.name, () => {
    expect(typeof method).toBe('function');
  });
};

const testAllModelMethods = (model) => {
  Object.keys(model(rai.rpc)).forEach((method) => {
    testMethodPresence(rai[model.name.toLowerCase()][method]);
  });
};

describe('Rai', () => {
  test('Rai is a class', () => {
    expect(rai instanceof Rai).toBeTruthy();
  });

  describe('Has all of the Account methods', () => {
    testAllModelMethods(Account);
  });

  describe('Has all of the Accounts methods', () => {
    testAllModelMethods(Accounts);
  });

  describe('Has all of the Blocks methods', () => {
    testAllModelMethods(Blocks);
  });

  describe('Has all of the Bootstrap methods', () => {
    test('bootstrap', () => {
      expect(typeof rai.bootstrap).toBe('function');
    });
  });

  describe('Has all of the Wallet methods', () => {
    testAllModelMethods(Wallet);
  });
});
