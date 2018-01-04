import nock from 'nock'; // eslint-disable-line
import Rai from '../../Rai';
import packageJSON from '../../../package.json';

const { testURL } = packageJSON.jest;

describe('Accounts', () => {
  const rai = new Rai(testURL);

  test('accounts.balances', async () => {
    nock(testURL)
      .post('/', {
        action: 'accounts_balances',
        accounts: ['xrb_test', 'xrb_test_2'],
      })
      .reply(200, {
        xrb_test: { balance: 100, pending: 0 },
        xrb_test_2: { balance: 1000, pending: 1000 },
      });

    const response = await rai.accounts.balances({ accounts: ['xrb_test', 'xrb_test_2'] });

    expect(response).toEqual({
      xrb_test: { balance: 100, pending: 0 },
      xrb_test_2: { balance: 1000, pending: 1000 },
    });
  });

  test('accounts.create', async () => {
    nock(testURL)
      .post('/', {
        action: 'accounts_create',
        wallet: 'wrb_wallet',
        count: 2,
        work: true,
      })
      .reply(200, {
        accounts: [
          'xrb_account_1',
          'xrb_account_2',
        ],
      });

    const response = await rai.accounts.create({
      wallet: 'wrb_wallet',
      count: 2,
    });

    expect(response).toEqual([
      'xrb_account_1',
      'xrb_account_2',
    ]);
  });

  test('accounts.frontiers', async () => {
    nock(testURL)
      .post('/', {
        action: 'accounts_frontiers',
        accounts: ['xrb_test', 'xrb_test_2'],
      })
      .reply(200, {
        frontiers: {
          xrb_test: 'xrb_frontier_1',
          xrb_test_2: 'xrb_frontier_1',
        },
      });

    const response = await rai.accounts.frontiers({ accounts: ['xrb_test', 'xrb_test_2'] });

    expect(response).toEqual({
      xrb_test: 'xrb_frontier_1',
      xrb_test_2: 'xrb_frontier_1',
    });
  });

  test('accounts.pending', async () => {
    nock(testURL)
      .post('/', {
        action: 'accounts_pending',
        accounts: ['xrb_test', 'xrb_test_2'],
        count: 1,
        threshold: 0,
        source: false,
      })
      .reply(200, {
        blocks: {
          xrb_test: ['pending_block_1'],
          xrb_test_2: ['pending_block_2'],
        },
      });

    const response = await rai.accounts.pending({
      accounts: ['xrb_test', 'xrb_test_2'],
      count: 1,
    });

    expect(response).toEqual({
      xrb_test: ['pending_block_1'],
      xrb_test_2: ['pending_block_2'],
    });
  });
});
