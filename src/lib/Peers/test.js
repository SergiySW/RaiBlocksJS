import mockServer from '../../../test/mockServer';
import rai from '../../../test/mockRai';

describe('Peers', () => {
  test('peers.begin', async () => {
    const expected = {
      account: 'xrb_3e3j5tkog48pnny9dmfzj1r16pg8t1e76dz5tmac6iq689wyjfpi00000000'
    };

    const request = {
      wallet: '000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A277D81789F3F'
    };

    mockServer.success({
      request: Object.assign({}, request, {
        action: 'peers_begin',
      }),
      response: expected,
    });

    const response = await rai.peers.begin(request);
    expect(response).toEqual(expected);
  });

  test('peers.init', async () => {
    const expected = {
      status: 'Ready',
    };

    const request = {
      wallet: '000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A277D81789F3F'
    };

    mockServer.success({
      request: Object.assign({}, request, {
        action: 'peers_init',
      }),
      response: expected,
    });

    const response = await rai.peers.init(request);
    expect(response).toEqual(expected);
  });

  test('peers.end', async () => {
    const expected = {
      success: true,
    };

    const request = {
      wallet: '000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A277D81789F3F',
      account: 'xrb_3e3j5tkog48pnny9dmfzj1r16pg8t1e76dz5tmac6iq689wyjfpi00000000'
    };

    mockServer.success({
      request: Object.assign({}, request, {
        action: 'peers_end',
      }),
      response: {},
    });

    const response = await rai.peers.end(request);
    expect(response).toEqual(expected);
  });

  test('peers.wait', async () => {
    const expected = {
      success: true,
    };

    const request = {
      account: 'xrb_3e3j5tkog48pnny9dmfzj1r16pg8t1e76dz5tmac6iq689wyjfpi00000000',
      amount: '1',
      timeout: '1000',
    };

    mockServer.success({
      request: Object.assign({}, request, {
        action: 'peers_wait',
      }),
      response: {
        status: 'success',
      },
    });

    const response = await rai.peers.wait(request);
    expect(response).toEqual(expected);
  });
});
