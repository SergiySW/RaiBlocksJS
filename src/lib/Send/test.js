import mockServer from '../../../test/mockServer';
import rai from '../../../test/mockRai';

describe('Send', () => {
  test('send', async () => {
    const expected = {
      block: '000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A277D81789F3F',
    };

    const request = {
      wallet: '000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A277D81789F3F',
      source: 'xrb_3e3j5tkog48pnny9dmfzj1r16pg8t1e76dz5tmac6iq689wyjfpi00000000',
      destination: 'xrb_3e3j5tkog48pnny9dmfzj1r16pg8t1e76dz5tmac6iq689wyjfpi00000000',
      amount: '1000000',
    };

    mockServer.success({
      request: Object.assign({}, request, {
        action: 'send',
      }),
      response: expected,
    });

    const response = await rai.send(request);
    expect(response).toEqual(expected);
  });
});
