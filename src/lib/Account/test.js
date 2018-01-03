import nock from 'nock'; // eslint-disable-line
import Rai from '../../Rai';
import packageJSON from '../../../package.json';

const { testURL } = packageJSON.jest;

describe('Account', () => {
  const rai = new Rai(testURL);

  test('account.balance', async () => {
    nock(testURL)
      .post('/', {
        action: 'account_balance',
        account: 'xrb_test',
      })
      .reply(200, { balance: 100, pending: 0 });

    const response = await rai.account.balance({ account: 'xrb_test' });
    expect(response).toEqual({ balance: 100, pending: 0 });
  });

  test('account.blockCount', async () => {
    nock(testURL)
      .post('/', {
        action: 'account_block_count',
        account: 'xrb_test',
      })
      .reply(200, { block_count: 42 });

    const response = await rai.account.blockCount({ account: 'xrb_test' });
    expect(response).toEqual(42);
  });

  test('account.create', async () => {
    nock(testURL)
      .post('/', {
        action: 'account_create',
        wallet: 'xrb_wallet',
        work: true,
      })
      .reply(200, { account: 'xrb_account' });

    const response = await rai.account.create({ wallet: 'xrb_wallet' });
    expect(response).toEqual('xrb_account');
  });

  test('account.info', async () => {
    const expected = {
      frontier: 'frontier_hash',
      open_block: 'open_block_hash',
      representative_block: 'representative_block_hash',
      balance: '82100232',
      modified_timestamp: '1501793775',
      block_count: '33',
    };

    nock(testURL)
      .post('/', {
        action: 'account_info',
        account: 'xrb_test',
        representative: false,
        weight: false,
        pending: false,
      })
      .reply(200, expected);

    const response = await rai.account.info({
      account: 'xrb_test',
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

    nock(testURL)
      .post('/', {
        action: 'account_history',
        account: 'xrb_wallet',
        count: '2',
      })
      .reply(200, { history: expected });

    const response = await rai.account.history({ account: 'xrb_wallet', count: 2 });
    expect(response).toEqual(expected);
  });
});
