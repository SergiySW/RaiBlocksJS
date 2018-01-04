import mockServer from '../../../test/mockServer';
import rai from '../../../test/mockRai';

describe('Accounts', () => {
  test('accounts.balances', async () => {
    const expected = {
      xrb_test: { balance: 100, pending: 0 },
      xrb_test_2: { balance: 1000, pending: 1000 },
    };

    mockServer.success({
      request: {
        action: 'accounts_balances',
        accounts: ['xrb_test', 'xrb_test_2'],
      },
      response: expected,
    });

    const response = await rai.accounts.balances({ accounts: ['xrb_test', 'xrb_test_2'] });

    expect(response).toEqual(expected);
  });

  test('accounts.create', async () => {
    const expected = [
      'xrb_account_1',
      'xrb_account_2',
    ];

    mockServer.success({
      request: {
        action: 'accounts_create',
        wallet: 'wrb_wallet',
        count: 2,
        work: true,
      },
      response: {
        accounts: expected,
      },
    });

    const response = await rai.accounts.create({
      wallet: 'wrb_wallet',
      count: 2,
    });

    expect(response).toEqual(expected);
  });

  test('accounts.frontiers', async () => {
    const expected = {
      xrb_test: 'xrb_frontier_1',
      xrb_test_2: 'xrb_frontier_1',
    };

    mockServer.success({
      request: {
        action: 'accounts_frontiers',
        accounts: ['xrb_test', 'xrb_test_2'],
      },
      response: {
        frontiers: expected,
      },
    });

    const response = await rai.accounts.frontiers({ accounts: ['xrb_test', 'xrb_test_2'] });

    expect(response).toEqual(expected);
  });

  test('accounts.pending', async () => {
    const expected = {
      xrb_test: ['pending_block_1'],
      xrb_test_2: ['pending_block_2'],
    };

    mockServer.success({
      request: {
        action: 'accounts_pending',
        accounts: ['xrb_test', 'xrb_test_2'],
        count: 1,
        threshold: 0,
        source: false,
      },
      response: {
        blocks: expected,
      },
    });

    const response = await rai.accounts.pending({
      accounts: ['xrb_test', 'xrb_test_2'],
      count: 1,
    });

    expect(response).toEqual(expected);
  });
});
