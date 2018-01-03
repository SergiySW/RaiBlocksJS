import nock from 'nock'; // eslint-disable-line
import Rai from '../../Rai';
import packageJSON from '../../../package.json';

const { testURL } = packageJSON.jest;

describe('Accounts', () => {
  const rai = new Rai(testURL);

  test('accounts.balances', async () => {
    nock(testURL)
      .post('/', {
        action: 'account_balance',
        account: 'xrb_test',
      })
      .reply(200, { balance: 100, pending: 0 });

    const response = await rai.account.balance('xrb_test');
    expect(response.data).toEqual({ balance: 100, pending: 0 });
  });
});
