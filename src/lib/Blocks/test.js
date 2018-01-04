import nock from 'nock'; // eslint-disable-line
import Rai from '../../Rai';
import packageJSON from '../../../package.json';

const { testURL } = packageJSON.jest;

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
  const rai = new Rai(testURL);

  test('blocks.account', async () => {
    nock(testURL)
      .post('/', {
        action: 'block_account',
        hash: 'xrb_1234',
      })
      .reply(200, {
        account: 'xrb_3e3j5',
      });

    const response = await rai.blocks.account({ hash: 'xrb_1234' });
    expect(response).toEqual({
      account: 'xrb_3e3j5',
    });
  });

  test('blocks.count', async () => {
    nock(testURL)
      .post('/', {
        action: 'block_count',
      })
      .reply(200, {
        count: '1000',
        unchecked: '10',
      });

    const response = await rai.blocks.count();
    expect(response).toEqual({
      count: '1000',
      unchecked: '10',
    });
  });

  test('blocks.countByType', async () => {
    nock(testURL)
      .post('/', {
        action: 'block_count_type',
      })
      .reply(200, {
        send: '1000',
        receive: '900',
        open: '100',
        change: '50',
      });

    const response = await rai.blocks.countByType();
    expect(response).toEqual({
      send: '1000',
      receive: '900',
      open: '100',
      change: '50',
    });
  });

  test('blocks.chain', async () => {
    nock(testURL)
      .post('/', {
        action: 'chain',
        block: '000HGHJGSHD1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B248',
        count: 4,
      })
      .reply(200, {
        blocks: [
          '000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A277D81789F3',
          '000D1BAEC8EC208142C99059B3987123klJSNL123901280AKLMLL_L:SBDS891',
          '000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B248124124ASASF12',
          '000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A27712312321',
        ],
      });

    const response = await rai.blocks.chain({
      block: '000HGHJGSHD1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B248',
      count: 4,
    });
    expect(response).toEqual({
      blocks: [
        '000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A277D81789F3',
        '000D1BAEC8EC208142C99059B3987123klJSNL123901280AKLMLL_L:SBDS891',
        '000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B248124124ASASF12',
        '000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A27712312321',
      ],
    });
  });

  test('blocks.create', async () => {
    nock(testURL)
      .post('/', {
        action: 'block_create',
        account: 'account',
        key: 'key',
        representative: 'representative',
        source: 'source',
        type: 'open',
      })
      .reply(200, {
        hash: 'hash',
        block: mockBlock,
      });

    const response = await rai.blocks.create({
      account: 'account',
      key: 'key',
      representative: 'representative',
      source: 'source',
      type: 'open',
    });
    expect(response).toEqual({
      hash: 'hash',
      block: mockBlock,
    });
  });

  test('blocks.process', async () => {
    nock(testURL)
      .post('/', {
        action: 'process',
        block: mockBlock,
      })
      .reply(200, {
        hash: 'hash',
      });

    const response = await rai.blocks.process(mockBlock);
    expect(response).toEqual({
      hash: 'hash',
    });
  });

  describe('blocks.get', () => {
    test('1 hash', async () => {
      nock(testURL)
        .post('/', {
          action: 'block',
          hash: 'hash',
        })
        .reply(200, {
          contents: mockBlock,
        });

      const response = await rai.blocks.get('hash');
      expect(response).toEqual(mockBlock);
    });

    test('array of hashes', async () => {
      nock(testURL)
        .post('/', {
          action: 'blocks',
          hashes: ['hash_1', 'hash_2'],
        })
        .reply(200, {
          blocks: {
            hash_1: mockBlock,
            hash_2: mockBlock,
          },
        });

      const response = await rai.blocks.get(['hash_1', 'hash_2']);
      expect(response).toEqual({
        blocks: {
          hash_1: mockBlock,
          hash_2: mockBlock,
        },
      });
    });

    test('array of hashes with info', async () => {
      nock(testURL)
        .post('/', {
          action: 'blocks_info',
          hashes: ['hash_1'],
        })
        .reply(200, {
          blocks: {
            hash_1: {
              block_account: 'block_account',
              ammount: '100000000',
              contents: mockBlock,
            },
          },
        });

      const response = await rai.blocks.get(['hash_1'], { info: true });
      expect(response).toEqual({
        blocks: {
          hash_1: {
            block_account: 'block_account',
            ammount: '100000000',
            contents: mockBlock,
          },
        },
      });
    });
  });
});
