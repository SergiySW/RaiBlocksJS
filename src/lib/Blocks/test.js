import mockServer from '../../../mocks/mockServer';
import rai from '../../../mocks/mockRai';

const mockBlock = {
  account: 'xrb_account',
  key: '123890123AJHU',
  representative: 'FYJ2KJS8B3FKLU1PKJS4ANBV',
  source: 'sourceFA5B51D063BADDF345EFD7EF0D3C',
  type: 'open',
  work: '00000000000',
  signature: '000000000000000000000',
};

describe('Blocks', () => {
  test('blocks.account', async () => {
    const expected = { account: 'xrb_3e3j5' };

    mockServer.success({
      request: {
        action: 'block_account',
        hash: 'xrb_1234',
      },
      response: expected,
    });

    const response = await rai.blocks.account({ hash: 'xrb_1234' });
    expect(response).toEqual(expected);
  });

  test('blocks.count', async () => {
    const expected = {
      count: '1000',
      unchecked: '10',
    };

    mockServer.success({
      request: {
        action: 'block_count',
      },
      response: expected,
    });

    const response = await rai.blocks.count();
    expect(response).toEqual(expected);
  });

  test('blocks.countByType', async () => {
    const expected = {
      send: '1000',
      receive: '900',
      open: '100',
      change: '50',
    };

    mockServer.success({
      request: {
        action: 'block_count_type',
      },
      response: expected,
    });

    const response = await rai.blocks.countByType();
    expect(response).toEqual(expected);
  });

  test('blocks.chain', async () => {
    const expected = {
      blocks: [
        '000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A277D81789F3',
        '000D1BAEC8EC208142C99059B3987123klJSNL123901280AKLMLL_L:SBDS891',
        '000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B248124124ASASF12',
        '000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A27712312321',
      ],
    };

    mockServer.success({
      request: {
        action: 'chain',
        block: '000HGHJGSHD1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B248',
        count: '4',
      },
      response: expected,
    });

    const response = await rai.blocks.chain({
      block: '000HGHJGSHD1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B248',
      count: 4,
    });

    expect(response).toEqual(expected);
  });

  test('blocks.chain default count', async () => {
    const expected = {
      blocks: [
        '000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A277D81789F3',
        '000D1BAEC8EC208142C99059B3987123klJSNL123901280AKLMLL_L:SBDS891',
        '000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B248124124ASASF12',
        '000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A27712312321',
      ],
    };

    mockServer.success({
      request: {
        action: 'chain',
        block: '000HGHJGSHD1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B248',
        count: '1',
      },
      response: expected,
    });

    const response = await rai.blocks.chain({
      block: '000HGHJGSHD1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B248',
    });

    expect(response).toEqual(expected);
  });

  test('blocks.create', async () => {
    const expected = {
      hash: 'hash',
      block: mockBlock,
    };

    mockServer.success({
      request: {
        action: 'block_create',
        account: 'account',
        key: 'key',
        representative: 'representative',
        source: 'source',
        type: 'open',
      },
      response: expected,
    });

    const response = await rai.blocks.create({
      account: 'account',
      key: 'key',
      representative: 'representative',
      source: 'source',
      type: 'open',
    });
    expect(response).toEqual(expected);
  });

  test('blocks.process', async () => {
    const expected = { hash: 'hash' };
    mockServer.success({
      request: {
        action: 'process',
        block: mockBlock,
      },
      response: expected,
    });

    const response = await rai.blocks.process(mockBlock);
    expect(response).toEqual(expected);
  });

  describe('blocks.get', () => {
    test('1 hash', async () => {
      mockServer.success({
        request: {
          action: 'block',
          hash: 'hash',
        },
        response: {
          contents: mockBlock,
        },
      });

      const response = await rai.blocks.get('hash');
      expect(response).toEqual(mockBlock);
    });

    test('array of hashes', async () => {
      const expected = {
        blocks: {
          hash_1: mockBlock,
          hash_2: mockBlock,
        },
      };

      mockServer.success({
        request: {
          action: 'blocks',
          hashes: ['hash_1', 'hash_2'],
        },
        response: expected,
      });

      const response = await rai.blocks.get(['hash_1', 'hash_2']);
      expect(response).toEqual(expected);
    });

    test('array of hashes with info', async () => {
      const expected = {
        blocks: {
          hash_1: {
            block_account: 'block_account',
            ammount: '100000000',
            contents: mockBlock,
          },
        },
      };

      mockServer.success({
        request: {
          action: 'blocks_info',
          hashes: ['hash_1'],
        },
        response: expected,
      });

      const response = await rai.blocks.get(['hash_1'], { info: true });
      expect(response).toEqual(expected);
    });
  });
});
