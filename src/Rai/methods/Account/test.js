import mockServer from '../../../../mocks/mockServer';
import rai from '../../../../mocks/mockRai';

describe('Account', () => {
  test('account.balance', async () => {
    const expected = { balance: 100, pending: 0 };
    mockServer.success({
      request: {
        action: 'account_balance',
        account: 'xrb_test',
      },
      response: expected,
    });

    const response = await rai.account.balance({ account: 'xrb_test' });
    expect(response).toEqual(expected);
  });

  test('account.blockCount', async () => {
    mockServer.success({
      request: {
        action: 'account_block_count',
        account: 'xrb_test',
      },
      response: { block_count: 42 },
    });

    const response = await rai.account.blockCount({ account: 'xrb_test' });
    expect(response).toEqual(42);
  });

  test('account.create', async () => {
    mockServer.success({
      request: {
        action: 'account_create',
        wallet: 'xrb_wallet',
        work: true,
      },
      response: { account: 'xrb_account' },
    });

    const response = await rai.account.create({ wallet: 'xrb_wallet' });
    expect(response).toEqual('xrb_account');
  });

  test('account.info', async () => {
    const expected = {
      frontier: 'frontier_hash',
      open_block: 'open_block_hash',
      representative_block: 'representative_block_hash',
      balance: 82100232,
      modified_timestamp: 1501793775,
      block_count: 33,
    };

    mockServer.success({
      request: {
        action: 'account_info',
        account: 'xrb_test',
      },
      response: expected,
    });

    const response = await rai.account.info({
      account: 'xrb_test',
    });
    expect(response).toEqual(expected);
  });

  test('account.info w/weight and pending', async () => {
    const expected = {
      frontier: 'frontier_hash',
      open_block: 'open_block_hash',
      representative_block: 'representative_block_hash',
      balance: 82100232,
      modified_timestamp: 1501793775,
      block_count: 33,
      weight: 110557703093564966460912964485513217,
      pending: 2309370929000000000000000000000000,
    };

    mockServer.success({
      request: {
        action: 'account_info',
        account: 'xrb_test',
        weight: true,
        pending: true,
      },
      response: expected,
    });

    const response = await rai.account.info({
      account: 'xrb_test',
      weight: true,
      pending: true,
    });

    expect(response).toEqual(expected);
  });

  test('account.history', async () => {
    const expected = [{
      hash: '000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A277D81789F3F',
      type: 'receive',
      account: 'xrb_3e3j5tkog48pnny9dmfzj1r16pg8t1e76dz5tmac6iq689wyjfpi00000000',
      amount: '100000000000000000000000000000000',
    },
    {
      hash: '000D1CAEC8EC2F8142C99059B393051BAC8380F9B5A2E6B2489A277D81789F3F',
      type: 'receive',
      account: 'xrb_2e3j5tkog48pnny9dmfzj1r16pg8t1e76dz5tmac6iq689wyjfpi00000000',
      amount: '1000000',
    }];

    mockServer.success({
      request: {
        action: 'account_history',
        account: 'xrb_wallet',
        count: '2',
      },
      response: { history: expected },
    });

    const response = await rai.account.history({ account: 'xrb_wallet', count: 2 });
    expect(response).toEqual(expected);
  });

  test('account.history default count', async () => {
    const expected = [{
      hash: '000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A277D81789F3F',
      type: 'receive',
      account: 'xrb_3e3j5tkog48pnny9dmfzj1r16pg8t1e76dz5tmac6iq689wyjfpi00000000',
      amount: '100000000000000000000000000000000',
    },
    {
      note: '4095 more items ...',
    }];

    mockServer.success({
      request: {
        action: 'account_history',
        account: 'xrb_wallet',
        count: '4096',
      },
      response: { history: expected },
    });

    const response = await rai.account.history({ account: 'xrb_wallet' });
    expect(response).toEqual(expected);
  });

  test('account.get', async () => {
    mockServer.success({
      request: {
        action: 'account_get',
        key: 'xrb_key',
      },
      response: { account: 'xrb_account' },
    });

    const response = await rai.account.get({ key: 'xrb_key' });
    expect(response).toEqual('xrb_account');
  });

  test('account.key', async () => {
    mockServer.success({
      request: {
        action: 'account_key',
        account: 'xrb_account',
      },
      response: { key: 'xrb_key' },
    });

    const response = await rai.account.key({ account: 'xrb_account' });
    expect(response).toEqual('xrb_key');
  });

  test('account.list', async () => {
    const expected = ['xrb_account_1', 'xrb_account_2'];

    mockServer.success({
      request: {
        action: 'account_list',
        wallet: 'xrb_wallet',
      },
      response: { accounts: expected },
    });

    const response = await rai.account.list({ wallet: 'xrb_wallet' });
    expect(response).toEqual(expected);
  });

  test('account.move', async () => {
    mockServer.success({
      request: {
        action: 'account_move',
        wallet: 'xrb_wallet',
        source: 'source',
        accounts: ['xrb_account_1'],
      },
      response: { moved: '1' },
    });

    const response = await rai.account.move({
      wallet: 'xrb_wallet',
      source: 'source',
      accounts: ['xrb_account_1'],
    });
    expect(response).toEqual({ moved: 1 });
  });

  test('account.remove', async () => {
    mockServer.success({
      request: {
        action: 'account_remove',
        wallet: 'xrb_wallet',
        account: 'xrb_account',
      },
      response: { removed: '1' },
    });

    const response = await rai.account.remove({
      wallet: 'xrb_wallet',
      account: 'xrb_account',
    });

    expect(response).toEqual({ removed: 1 });
  });

  test('account.getRepresentative', async () => {
    mockServer.success({
      request: {
        action: 'account_representative',
        account: 'xrb_account',
      },
      response: { representative: 'xrb_representative' },
    });

    const response = await rai.account.getRepresentative({
      account: 'xrb_account',
    });

    expect(response).toEqual('xrb_representative');
  });

  test('account.setRepresentative', async () => {
    mockServer.success({
      request: {
        action: 'account_representative_set',
        account: 'xrb_account',
        wallet: 'xrb_wallet',
        representative: 'xrb_representative',
        work: '0000000000000000',
      },
      response: { block: 'xrb_block' },
    });

    const response = await rai.account.setRepresentative({
      account: 'xrb_account',
      wallet: 'xrb_wallet',
      representative: 'xrb_representative',
    });

    expect(response).toEqual({ block: 'xrb_block' });
  });

  test('account.weight', async () => {
    mockServer.success({
      request: {
        action: 'account_weight',
        account: 'xrb_account',
      },
      response: { weight: '10000' },
    });

    const response = await rai.account.weight({
      account: 'xrb_account',
    });

    expect(response).toEqual('10000');
  });
});
