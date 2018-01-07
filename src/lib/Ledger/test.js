import mockServer from '../../../mocks/mockServer';
import rai from '../../../mocks/mockRai';

describe('Ledger', () => {
  test('ledger.get', async () => {
    const expected = {
      accounts: {
        xrb_11119gbh8hb4hj1duf7fdtfyf5s75okzxdgupgpgm1bj78ex3kgy7frt3s9n: {
          frontier: 'E71AF3E9DD86BBD8B4620EFA63E065B34D358CFC091ACB4E103B965F95783321',
          open_block: '643B77F1ECEFBDBE1CC909872964C1DBBE23A6149BD3CEF2B50B76044659B60F',
          representative_block: '643B77F1ECEFBDBE1CC909872964C1DBBE23A6149BD3CEF2B50B76044659B60F',
          balance: '0',
          modified_timestamp: '1511476234',
          block_count: '2',
        },
      },
    };

    const request = {
      account: 'xrb_1111111111111111111111111111111111111111111111111111hifc8npp',
      count: '1',
    };

    mockServer.success({
      request: Object.assign({}, request, {
        action: 'ledger',
      }),
      response: expected,
    });

    const response = await rai.ledger.get(request);
    expect(response).toEqual(expected);
  });

  test('ledger.get default count', async () => {
    const expected = {
      accounts: {
        xrb_11119gbh8hb4hj1duf7fdtfyf5s75okzxdgupgpgm1bj78ex3kgy7frt3s9n: {
          frontier: 'E71AF3E9DD86BBD8B4620EFA63E065B34D358CFC091ACB4E103B965F95783321',
          open_block: '643B77F1ECEFBDBE1CC909872964C1DBBE23A6149BD3CEF2B50B76044659B60F',
          representative_block: '643B77F1ECEFBDBE1CC909872964C1DBBE23A6149BD3CEF2B50B76044659B60F',
          balance: '0',
          modified_timestamp: '1511476234',
          block_count: '2',
        },
        note: '... imagine 4095 more ...',
      },
    };

    const request = {
      account: 'xrb_1111111111111111111111111111111111111111111111111111hifc8npp',
      count: '4096',
    };

    mockServer.success({
      request: Object.assign({}, request, {
        action: 'ledger',
      }),
      response: expected,
    });

    const response = await rai.ledger.get({ account: 'xrb_1111111111111111111111111111111111111111111111111111hifc8npp' });
    expect(response).toEqual(expected);
  });

  test('ledger.history', async () => {
    const expected = {
      history: [{
        hash: '000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A277D81789F3F',
        type: 'receive',
        account: 'xrb_3e3j5tkog48pnny9dmfzj1r16pg8t1e76dz5tmac6iq689wyjfpi00000000',
        amount: '100000000000000000000000000000000',
      }],
    };

    const request = {
      hash: '000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A277D81789F3F',
      count: '1',
    };

    mockServer.success({
      request: Object.assign({}, request, {
        action: 'history',
      }),
      response: expected,
    });

    const response = await rai.ledger.history(request);
    expect(response).toEqual(expected);
  });

  test('ledger.history default count', async () => {
    const expected = {
      history: [{
        hash: '000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A277D81789F3F',
        type: 'receive',
        account: 'xrb_3e3j5tkog48pnny9dmfzj1r16pg8t1e76dz5tmac6iq689wyjfpi00000000',
        amount: '100000000000000000000000000000000',
      },
      {
        note: '... imagine 4095 more ...',
      }],
    };

    const request = {
      hash: '000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A277D81789F3F',
      count: '4096',
    };

    mockServer.success({
      request: Object.assign({}, request, {
        action: 'history',
      }),
      response: expected,
    });

    const response = await rai.ledger.history({ hash: '000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A277D81789F3F' });
    expect(response).toEqual(expected);
  });

  test('ledger.successors', async () => {
    const expected = {
      blocks: [
        'A170D51B94E00371ACE76E35AC81DC9405D5D04D4CEBC399AEACE07AE05DD293',
      ],
    };

    const request = {
      block: '991CF190094C00F0B68E2E5F75F6BEE95A2E0BD93CEAA4A6734DB9F19B728948',
      count: '1',
    };

    mockServer.success({
      request: Object.assign({}, request, {
        action: 'succesors',
      }),
      response: expected,
    });

    const response = await rai.ledger.succesors(request);
    expect(response).toEqual(expected);
  });

  test('ledger.successors default count', async () => {
    const expected = {
      blocks: [
        'A170D51B94E00371ACE76E35AC81DC9405D5D04D4CEBC399AEACE07AE05DD293',
        '... 4095 more ...',
      ],
    };

    const request = {
      block: '991CF190094C00F0B68E2E5F75F6BEE95A2E0BD93CEAA4A6734DB9F19B728948',
      count: '4096',
    };

    mockServer.success({
      request: Object.assign({}, request, {
        action: 'succesors',
      }),
      response: expected,
    });

    const response = await rai.ledger.succesors({ block: '991CF190094C00F0B68E2E5F75F6BEE95A2E0BD93CEAA4A6734DB9F19B728948' });
    expect(response).toEqual(expected);
  });
});
