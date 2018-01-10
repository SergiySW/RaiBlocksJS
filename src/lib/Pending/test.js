import mockServer from '../../../mocks/mockServer';
import rai from '../../../mocks/mockRai';

describe('Pending', () => {
  test('pending.get', async () => {
    const expected = {
      blocks: ['000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A277D81789F3F'],
    };

    const request = {
      account: 'xrb_1111111111111111111111111111111111111111111111111117353trpda',
      count: '1',
    };

    mockServer.success({
      request: Object.assign({}, request, {
        action: 'pending',
      }),
      response: expected,
    });

    const response = await rai.pending.get(request);
    expect(response).toEqual(expected);
  });

  test('pending.get w/threshold', async () => {
    const expected = {
      blocks: {
        '000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A277D81789F3F': '6000000000000000000000000000000',
      },
    };

    const request = {
      account: 'xrb_1111111111111111111111111111111111111111111111111117353trpda',
      count: '1',
      threshold: '100000000',
    };

    mockServer.success({
      request: Object.assign({}, request, {
        action: 'pending',
      }),
      response: expected,
    });

    const response = await rai.pending.get(request);
    expect(response).toEqual(expected);
  });

  test('pending.get w/source', async () => {
    const expected = {
      blocks: {
        '000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A277D81789F3F': {
          amount: '6000000000000000000000000000000',
          source: 'xrb_3dcfozsmekr1tr9skf1oa5wbgmxt81qepfdnt7zicq5x3hk65fg4fqj58mbr',
        },
      },
    };

    const request = {
      account: 'xrb_1111111111111111111111111111111111111111111111111117353trpda',
      count: '1',
      source: true,
    };

    mockServer.success({
      request: Object.assign({}, request, {
        action: 'pending',
      }),
      response: expected,
    });

    const response = await rai.pending.get(request);
    expect(response).toEqual(expected);
  });

  test('pending.exists', async () => {
    const expected = {
      exists: true,
    };

    const request = {
      hash: '000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A277D81789F3F',
    };

    mockServer.success({
      request: Object.assign({}, request, {
        action: 'pending_exists',
      }),
      response: expected,
    });

    const response = await rai.pending.exists(request);
    expect(response).toEqual(expected);
  });

  test.only('pending.exists false', async () => {
    const expected = {
      exists: false,
    };

    const request = {
      hash: '000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A277D81789F3F',
    };

    mockServer.success({
      request: Object.assign({}, request, {
        action: 'pending_exists',
      }),
      response: { exists: '0' },
    });

    const response = await rai.pending.exists(request);
    expect(response).toEqual(expected);
  });

  test('pending.search', async () => {
    const expected = {
      started: true,
    };

    const request = {
      wallet: '000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A277D81789F3F',
    };

    mockServer.success({
      request: Object.assign({}, request, {
        action: 'search_pending',
      }),
      response: { started: '1' },
    });

    const response = await rai.pending.search(request);
    expect(response).toEqual(expected);
  });

  test('pending.search all (no args)', async () => {
    const expected = {
      success: true,
    };

    mockServer.success({
      request: {
        action: 'search_pending_all',
      },
      response: {
        success: '1',
      },
    });

    const response = await rai.pending.search();
    expect(response).toEqual(expected);
  });
});
