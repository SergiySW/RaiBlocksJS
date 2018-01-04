import mockServer from '../../../test/mockServer';
import rai from '../../../test/mockRai';

describe('Ledger', () => {
  test('ledger.get', async () => {
    const expected = {
      private: '9F0E444C69F77A49BD0BE89DB92C38FE713E0963165CCA12FAF5712D7657120F',
      public: 'C008B814A7D269A1FA3C6528B19201A24D797912DB9996FF02A1FF356E45552B',
      account: 'xrb_3i1aq1cchnmbn9x5rsbap8b15akfh7wj7pwskuzi7ahz8oq6cobd99d4r3b7',
    };

    const request = {
      account: 'xrb_1111111111111111111111111111111111111111111111111111hifc8npp',
      count: '1',
      representative: false,
      weight: false,
      pending: false,
      sorting: false,
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
});
