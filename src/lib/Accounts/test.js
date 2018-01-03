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

    const response = await rai.accounts.balances(['xrb_test', 'xrb_test_2']);

    console.log(response);

    expect(response).toEqual({
      xrb_test: { balance: 100, pending: 0 },
      xrb_test_2: { balance: 1000, pending: 1000 },
    });
  });
});
