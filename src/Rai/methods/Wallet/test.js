import mockServer from '../../../../mocks/mockServer';
import rai from '../../../../mocks/mockRai';

describe('Wallet', () => {
  test('wallet.add', async () => {
    const expected = {
      account: 'xrb_3e3j5tkog48pnny9dmfzj1r16pg8t1e76dz5tmac6iq689wyjfpi00000000',
    };

    const request = {
      wallet: '000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A277D81789F3F',
      key: '34F0A37AAD20F4A260F0A5B3CB3D7FB50673212263E58A380BC10474BB039CE4',
    };

    mockServer.success({
      request: Object.assign({}, request, {
        action: 'wallet_add',
        work: true,
      }),
      response: expected,
    });

    const response = await rai.wallet.add(request);
    expect(response).toEqual(expected.account);
  });

  test('wallet.balanceTotal', async () => {
    const expected = {
      balance: '10000',
      pending: '10000',
    };
    const request = {
      wallet: '000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A277D81789F3F',
    };

    mockServer.success({
      request: Object.assign({}, request, {
        action: 'wallet_balance_total',
      }),
      response: expected,
    });

    const response = await rai.wallet.balanceTotal(request);
    expect(response).toEqual(expected);
  });

  test('wallet.balances', async () => {
    const expected = {
      xrb_3e3j5tkog48pnny9dmfzj1r16pg8t1e76dz5tmac6iq689wyjfpi00000000: {
        balance: '10000',
        pending: '10000',
      },
    };
    const request = {
      wallet: '000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A277D81789F3F',
      threshold: '1000',
    };

    mockServer.success({
      request: Object.assign({}, request, {
        action: 'wallet_balances',
      }),
      response: { balances: expected },
    });

    const response = await rai.wallet.balances(request);
    expect(response).toEqual(expected);
  });

  test('wallet.balances default threshold', async () => {
    const expected = {
      xrb_3e3j5tkog48pnny9dmfzj1r16pg8t1e76dz5tmac6iq689wyjfpi00000000: {
        balance: '10000',
        pending: '10000',
      },
    };
    const request = {
      wallet: '000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A277D81789F3F',
      threshold: '0',
    };

    mockServer.success({
      request: Object.assign({}, request, {
        action: 'wallet_balances',
      }),
      response: { balances: expected },
    });

    const response = await rai.wallet.balances({ wallet: '000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A277D81789F3F' });
    expect(response).toEqual(expected);
  });


  test('wallet.changeSeed', async () => {
    const request = {
      wallet: '000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A277D81789F3F',
      seed: '74F2B37AAD20F4A260F0A5B3CB3D7FB51673212263E58A380BC10474BB039CEE',
    };
    const expected = {
      success: true,
    };

    mockServer.success({
      request: Object.assign({}, request, {
        action: 'wallet_change_seed',
      }),
      response: { success: '' },
    });

    const response = await rai.wallet.changeSeed(request);
    expect(response).toEqual(expected);
  });

  test('wallet.changeSeed failed', async () => {
    const request = {
      wallet: '000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A277D81789F3F',
      seed: '74F2B37AAD20F4A260F0A5B3CB3D7FB51673212263E58A380BC10474BB039CEE',
    };
    const expected = {
      success: false,
    };

    mockServer.success({
      request: Object.assign({}, request, {
        action: 'wallet_change_seed',
      }),
      response: { error: true },
    });

    const response = await rai.wallet.changeSeed(request);
    expect(response).toEqual(expected);
  });

  test('wallet.contains', async () => {
    const request = {
      wallet: '000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A277D81789F3F',
      account: 'xrb_3e3j5tkog48pnny9dmfzj1r16pg8t1e76dz5tmac6iq689wyjfpi00000000',
    };
    const expected = {
      exists: true,
    };

    mockServer.success({
      request: Object.assign({}, request, {
        action: 'wallet_contains',
      }),
      response: { exists: '1' },
    });

    const response = await rai.wallet.contains(request);
    expect(response).toEqual(expected);
  });

  test('wallet.contains failed', async () => {
    const request = {
      wallet: '000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A277D81789F3F',
      account: 'xrb_3e3j5tkog48pnny9dmfzj1r16pg8t1e76dz5tmac6iq689wyjfpi00000000',
    };
    const expected = {
      exists: false,
    };

    mockServer.success({
      request: Object.assign({}, request, {
        action: 'wallet_contains',
      }),
      response: { exists: '0' },
    });

    const response = await rai.wallet.contains(request);
    expect(response).toEqual(expected);
  });

  test('wallet.create', async () => {
    const request = {};
    const expected = {
      wallet: '000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A277D81789F3F',
    };

    mockServer.success({
      request: Object.assign({}, request, {
        action: 'wallet_create',
      }),
      response: expected,
    });

    const response = await rai.wallet.create(request);
    expect(response).toEqual(expected);
  });

  test('wallet.destroy', async () => {
    const request = {
      wallet: '000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A277D81789F3F',
    };
    const expected = { success: true };

    mockServer.success({
      request: Object.assign({}, request, {
        action: 'wallet_destroy',
      }),
      response: {},
    });

    const response = await rai.wallet.destroy(request);
    expect(response).toEqual(expected);
  });

  test('wallet.export', async () => {
    const request = {
      wallet: '000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A277D81789F3F',
    };
    const expected = {
      json: {
        '000000000000000000': '0000000000000000001',
      },
    };

    mockServer.success({
      request: Object.assign({}, request, {
        action: 'wallet_export',
      }),
      response: expected,
    });

    const response = await rai.wallet.export(request);
    expect(response).toEqual(expected);
  });

  test('wallet.frontiers', async () => {
    const request = {
      wallet: '000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A277D81789F3F',
    };
    const expected = {
      frontiers: {
        xrb_3e3j5tkog48pnny9dmfzj1r16pg8t1e76dz5tmac6iq689wyjfpi00000000: '000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A277D81789F3F',
      },
    };

    mockServer.success({
      request: Object.assign({}, request, {
        action: 'wallet_frontiers',
      }),
      response: expected,
    });

    const response = await rai.wallet.frontiers(request);
    expect(response).toEqual(expected);
  });

  test('wallet.locked true', async () => {
    const request = {
      wallet: '000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A277D81789F3F',
    };
    const expected = {
      locked: true,
    };

    mockServer.success({
      request: Object.assign({}, request, {
        action: 'wallet_locked',
      }),
      response: { locked: '1' },
    });

    const response = await rai.wallet.locked(request);
    expect(response).toEqual(expected);
  });

  test('wallet.locked false', async () => {
    const request = {
      wallet: '000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A277D81789F3F',
    };
    const expected = {
      locked: false,
    };

    mockServer.success({
      request: Object.assign({}, request, {
        action: 'wallet_locked',
      }),
      response: { locked: '0' },
    });

    const response = await rai.wallet.locked(request);
    expect(response).toEqual(expected);
  });

  test('wallet.passwordChange', async () => {
    const request = {
      wallet: '000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A277D81789F3F',
      password: 'new_password_gary_bags_pizza_$kull',
    };
    const expected = {
      changed: true,
    };

    mockServer.success({
      request: Object.assign({}, request, {
        action: 'password_change',
      }),
      response: { changed: '1' },
    });

    const response = await rai.wallet.passwordChange(request);
    expect(response).toEqual(expected);
  });

  test('wallet.passwordEnter', async () => {
    const request = {
      wallet: '000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A277D81789F3F',
      password: 'new_password_gary_bags_pizza_$kull',
    };
    const expected = {
      valid: true,
    };

    mockServer.success({
      request: Object.assign({}, request, {
        action: 'password_enter',
      }),
      response: { valid: '1' },
    });

    const response = await rai.wallet.passwordEnter(request);
    expect(response).toEqual(expected);
  });

  test('wallet.passwordValid', async () => {
    const request = {
      wallet: '000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A277D81789F3F',
    };
    const expected = {
      valid: true,
    };

    mockServer.success({
      request: Object.assign({}, request, {
        action: 'password_valid',
      }),
      response: { valid: '1' },
    });

    const response = await rai.wallet.passwordValid(request);
    expect(response).toEqual(expected);
  });

  test('wallet.pending', async () => {
    const request = {
      wallet: '000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A277D81789F3F',
      count: '1',
      threshold: '0',
      source: false,
    };
    const expected = {
      blocks: {
        xrb_1111111111111111111111111111111111111111111111111117353trpda: ['142A538F36833D1CC78B94E11C766F75818F8B940771335C6C1B8AB880C5BB1D'],
        xrb_3t6k35gi95xu6tergt6p69ck76ogmitsa8mnijtpxm9fkcm736xtoncuohr3: ['4C1FEEF0BEA7F50BE35489A1233FE002B212DEA554B55B1B470D78BD8F210C74'],
      },
    };

    mockServer.success({
      request: Object.assign({}, request, {
        action: 'wallet_pending',
      }),
      response: expected,
    });

    const response = await rai.wallet.pending(request);
    expect(response).toEqual(expected);
  });

  test('wallet.pending default args', async () => {
    const request = {
      wallet: '000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A277D81789F3F',
      count: 4096,
      threshold: 0,
    };
    const expected = {
      blocks: {
        xrb_1111111111111111111111111111111111111111111111111117353trpda: ['142A538F36833D1CC78B94E11C766F75818F8B940771335C6C1B8AB880C5BB1D'],
        xrb_3t6k35gi95xu6tergt6p69ck76ogmitsa8mnijtpxm9fkcm736xtoncuohr3: ['4C1FEEF0BEA7F50BE35489A1233FE002B212DEA554B55B1B470D78BD8F210C74'],
      },
    };

    mockServer.success({
      request: Object.assign({}, request, {
        action: 'wallet_pending',
      }),
      response: expected,
    });

    const response = await rai.wallet.pending({
      wallet: '000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A277D81789F3F',
    });
    expect(response).toEqual(expected);
  });

  test('wallet.getRepresentative', async () => {
    const request = {
      wallet: '000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A277D81789F3F',
    };
    const expected = {
      representative: 'xrb_3e3j5tkog48pnny9dmfzj1r16pg8t1e76dz5tmac6iq689wyjfpi00000000',
    };

    mockServer.success({
      request: Object.assign({}, request, {
        action: 'wallet_representative',
      }),
      response: expected,
    });

    const response = await rai.wallet.getRepresentative(request);
    expect(response).toEqual(expected);
  });

  test('wallet.setRepresentative', async () => {
    const request = {
      wallet: '000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A277D81789F3F',
      representative: 'xrb_3e3j5tkog48pnny9dmfzj1r16pg8t1e76dz5tmac6iq689wyjfpi00000000',
    };
    const expected = {
      set: true,
    };

    mockServer.success({
      request: Object.assign({}, request, {
        action: 'wallet_representative_set',
      }),
      response: { set: 1 },
    });

    const response = await rai.wallet.setRepresentative(request);
    expect(response).toEqual(expected);
  });

  test('wallet.republish', async () => {
    const request = {
      wallet: '000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A277D81789F3F',
      count: 1,
    };
    const expected = {
      blocks: [
        '991CF190094C00F0B68E2E5F75F6BEE95A2E0BD93CEAA4A6734DB9F19B728948',
        'A170D51B94E00371ACE76E35AC81DC9405D5D04D4CEBC399AEACE07AE05DD293',
      ],
    };

    mockServer.success({
      request: Object.assign({}, request, {
        action: 'wallet_republish',
      }),
      response: expected,
    });

    const response = await rai.wallet.republish(request);
    expect(response).toEqual(expected);
  });

  test('wallet.republish default count', async () => {
    const request = {
      wallet: '000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A277D81789F3F',
      count: '2',
    };
    const expected = {
      blocks: [
        '991CF190094C00F0B68E2E5F75F6BEE95A2E0BD93CEAA4A6734DB9F19B728948',
        'A170D51B94E00371ACE76E35AC81DC9405D5D04D4CEBC399AEACE07AE05DD293',
        '90D0C16AC92DD35814E84BFBCC739A039615D0A42A76EF44ADAEF1D99E9F8A35',
      ],
    };

    mockServer.success({
      request: Object.assign({}, request, {
        action: 'wallet_republish',
      }),
      response: expected,
    });

    const response = await rai.wallet.republish({
      wallet: '000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A277D81789F3F',
    });
    expect(response).toEqual(expected);
  });

  test('wallet.unlock', async () => {
    const request = {
      wallet: '000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A277D81789F3F',
      password: 'new_password_gary_bags_pizza_$kull',
    };
    const expected = {
      valid: true,
    };

    mockServer.success({
      request: Object.assign({}, request, {
        action: 'password_enter',
      }),
      response: { valid: '1' },
    });

    const response = await rai.wallet.unlock(request);
    expect(response).toEqual(expected);
  });

  test('wallet.workGet', async () => {
    const request = {
      wallet: '000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A277D81789F3F',
    };
    const expected = {
      works: {
        xrb_1111111111111111111111111111111111111111111111111111hifc8npp: '432e5cf728c90f4f',
      },
    };

    mockServer.success({
      request: Object.assign({}, request, {
        action: 'wallet_work_get',
      }),
      response: expected,
    });

    const response = await rai.wallet.workGet(request);
    expect(response).toEqual(expected);
  });
});
