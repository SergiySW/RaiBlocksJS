import mockServer from '../../../mocks/mockServer';
import rai from '../../../mocks/mockRai';

describe('Delegators', () => {
  test('delegators.get', async () => {
    const expected = {
      delegators: {
        xrb_13bqhi1cdqq8yb9szneoc38qk899d58i5rcrgdk5mkdm86hekpoez3zxw5sd: '500000000000000000000000000000000000',
        xrb_17k6ug685154an8gri9whhe5kb5z1mf5w6y39gokc1657sh95fegm8ht1zpn: '961647970820730000000000000000000000',
      },
    };

    const request = {
      account: 'xrb_1111111111111111111111111111111111111111111111111117353trpda',
    };

    mockServer.success({
      request: Object.assign({}, request, {
        action: 'delegators',
      }),
      response: expected,
    });

    const response = await rai.delegators.get(request);
    expect(response).toEqual(expected);
  });

  test('delegators.count', async () => {
    const expected = {
      count: 2,
    };

    const request = {
      account: 'xrb_1111111111111111111111111111111111111111111111111117353trpda',
    };

    mockServer.success({
      request: Object.assign({}, request, {
        action: 'delegators_count',
      }),
      response: expected,
    });

    const response = await rai.delegators.count(request);
    expect(response).toEqual(expected);
  });
});
