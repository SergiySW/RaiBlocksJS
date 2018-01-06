import mockServer from '../../../mocks/mockServer';
import rai from '../../../mocks/mockRai';

describe('Frontiers', () => {
  test('frontiers.get', async () => {
    const expected = {
      frontiers: {
        xrb_13bqhi1cdqq8yb9szneoc38qk899d58i5rcrgdk5mkdm86hekpoez3zxw5sd: '500000000000000000000000000000000000',
      },
    };

    const request = {
      account: 'xrb_1111111111111111111111111111111111111111111111111117353trpda',
      count: 1,
    };

    mockServer.success({
      request: Object.assign({}, request, {
        action: 'frontiers',
      }),
      response: expected,
    });

    const response = await rai.frontiers.get(request);
    expect(response).toEqual(expected);
  });

  test('frontiers.count', async () => {
    const expected = {
      count: '1000',
    };

    mockServer.success({
      request: {
        action: 'frontiers_count',
      },
      response: expected,
    });

    const response = await rai.frontiers.count();
    expect(response).toEqual(expected);
  });
});
