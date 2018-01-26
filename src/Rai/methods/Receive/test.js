import mockServer from '../../../../mocks/mockServer';
import rai from '../../../../mocks/mockRai';

describe('Receive', () => {
  test('receive.get', async () => {
    const expected = {
      block: 'EE5286AB32F580AB65FD84A69E107C69FBEB571DEC4D99297E19E3FA5529547B',
    };

    const request = {
      wallet: '000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A277D81789F3F',
      account: 'xrb_3e3j5tkog48pnny9dmfzj1r16pg8t1e76dz5tmac6iq689wyjfpi00000000',
      block: '53EAA25CE28FA0E6D55EA9704B32604A736966255948594D55CBB05267CECD48',
    };

    mockServer.success({
      request: Object.assign({}, request, {
        action: 'receive',
      }),
      response: expected,
    });

    const response = await rai.receive.get(request);
    expect(response).toEqual(expected);
  });

  test('receive.minimum', async () => {
    const expected = {
      amount: 100000000,
    };

    mockServer.success({
      request: {
        action: 'receive_minimum',
      },
      response: expected,
    });

    const response = await rai.receive.minimum();
    expect(response).toEqual(expected);
  });

  test('receive.setMinimum', async () => {
    const expected = {
      success: true,
    };

    const request = {
      amount: '1000000',
    };

    mockServer.success({
      request: Object.assign({}, request, {
        action: 'receive_minimum_set',
      }),
      response: { success: '' },
    });

    const response = await rai.receive.setMinimum(request);
    expect(response).toEqual(expected);
  });
});
