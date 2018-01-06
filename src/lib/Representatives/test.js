import mockServer from '../../../mocks/mockServer';
import rai from '../../../mocks/mockRai';

describe('Representatives', () => {
  test('representatives.get', async () => {
    const expected = {
      representatives: {
        xrb_1111111111111111111111111111111111111111111111111117353trpda: '3822372327060170000000000000000000000',
        xrb_1111111111111111111111111111111111111111111111111awsq94gtecn: '30999999999999999999999999000000',
        xrb_114nk4rwjctu6n6tr6g6ps61g1w3hdpjxfas4xj1tq6i8jyomc5d858xr1xi: '0',
      },
    };

    mockServer.success({
      request: {
        action: 'representatives',
      },
      response: expected,
    });

    const response = await rai.representatives.get();
    expect(response).toEqual(expected);
  });

  test('representatives.wallet', async () => {
    const expected = {
      representative: 'xrb_1111111111111111111111111111111111111111111111111117353trpda',
    };

    const request = {
      wallet: '000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A277D81789F3F',
    };

    mockServer.success({
      request: Object.assign({}, request, {
        action: 'wallet_representative',
      }),
      response: expected,
    });

    const response = await rai.representatives.wallet(request);
    expect(response).toEqual(expected);
  });

  test('representatives.walletSet', async () => {
    const expected = {
      success: true,
    };

    const request = {
      wallet: '000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A277D81789F3F',
      representative: 'xrb_3e3j5tkog48pnny9dmfzj1r16pg8t1e76dz5tmac6iq689wyjfpi00000000'
    };

    mockServer.success({
      request: Object.assign({}, request, {
        action: 'wallet_representative_set',
      }),
      response: { set: '1' },
    });

    const response = await rai.representatives.walletSet(request);
    expect(response).toEqual(expected);
  });
});
