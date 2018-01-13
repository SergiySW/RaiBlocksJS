import mockServer from '../../../mocks/mockServer';
import rai from '../../../mocks/mockRai';

describe('Unchecked', () => {
  test('unchecked.clear', async () => {
    const expected = {
      success: true,
    };

    mockServer.success({
      request: {
        action: 'unchecked_clear',
      },
      response: { success: '' },
    });

    const response = await rai.unchecked.clear();
    expect(response).toEqual(expected);
  });

  test('unchecked.get', async () => {
    const expected = {
      contents: {
        type: 'open',
        account: 'xrb_3e3j5tkog48pnny9dmfzj1r16pg8t1e76dz5tmac6iq689wyjfpi00000000',
        representative: 'xrb_3e3j5tkog48pnny9dmfzj1r16pg8t1e76dz5tmac6iq689wyjfpi00000000',
        source: 'FA5B51D063BADDF345EFD7EF0D3C5FB115C85B1EF4CDE89D8B7DF3EAF60A04A4',
        work: '0000000000000000',
        signature: '00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
      },
    };

    const request = {
      hash: '000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A277D81789F3F',
    };

    mockServer.success({
      request: Object.assign({}, request, {
        action: 'unchecked_get',
      }),
      response: expected,
    });

    const response = await rai.unchecked.get(request);
    expect(response).toEqual(expected);
  });

  test('unchecked.keys', async () => {
    const expected = {
      unchecked: [{
        key: 'FA5B51D063BADDF345EFD7EF0D3C5FB115C85B1EF4CDE89D8B7DF3EAF60A04A4',
        hash: '000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A277D81789F3F',
        contents: {
          type: 'open',
          account: 'xrb_3e3j5tkog48pnny9dmfzj1r16pg8t1e76dz5tmac6iq689wyjfpi00000000',
          representative: 'xrb_3e3j5tkog48pnny9dmfzj1r16pg8t1e76dz5tmac6iq689wyjfpi00000000',
          source: 'FA5B51D063BADDF345EFD7EF0D3C5FB115C85B1EF4CDE89D8B7DF3EAF60A04A4',
          work: '0000000000000000',
          signature: '00000000000000000000000000000000000',
        },
      }],
    };

    const request = {
      key: 'FA5B51D063BADDF345EFD7EF0D3C5FB115C85B1EF4CDE89D8B7DF3EAF60A04A4',
      count: '1',
    };

    mockServer.success({
      request: Object.assign({}, request, {
        action: 'unchecked_keys',
      }),
      response: expected,
    });

    const response = await rai.unchecked.keys(request);
    expect(response).toEqual(expected);
  });

  test('unchecked.list', async () => {
    const expected = {
      blocks: {
        '000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A277D81789F3F': {
          type: 'open',
          account: 'xrb_3e3j5tkog48pnny9dmfzj1r16pg8t1e76dz5tmac6iq689wyjfpi00000000',
          representative: 'xrb_3e3j5tkog48pnny9dmfzj1r16pg8t1e76dz5tmac6iq689wyjfpi00000000',
          source: 'FA5B51D063BADDF345EFD7EF0D3C5FB115C85B1EF4CDE89D8B7DF3EAF60A04A4',
          work: '0000000000000000',
          signature: '00000000000000000000000000000000000',
        },
      },
    };

    const request = {
      count: '1',
    };

    mockServer.success({
      request: Object.assign({}, request, {
        action: 'unchecked',
      }),
      response: expected,
    });

    const response = await rai.unchecked.list(request);
    expect(response).toEqual(expected);
  });
});
