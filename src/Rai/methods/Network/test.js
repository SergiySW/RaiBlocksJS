import mockServer from '../../../../mocks/mockServer';
import rai from '../../../../mocks/mockRai';

describe('Network', () => {
  test('network.availableSupply', async () => {
    const expected = {
      available: 10000,
    };

    mockServer.success({
      request: {
        action: 'available_supply',
      },
      response: expected,
    });

    const response = await rai.network.availableSupply();
    expect(response).toEqual(expected);
  });

  test('network.keepAlive', async () => {
    const expected = {
      success: true,
    };

    const request = {
      address: '::ffff:192.168.1.1',
      port: 1024,
    };

    mockServer.success({
      request: Object.assign({}, request, {
        action: 'keepalive',
      }),
      response: {},
    });

    const response = await rai.network.keepAlive(request);
    expect(response).toEqual(expected);
  });

  test('network.republish', async () => {
    const expected = {
      blocks: [
        '991CF190094C00F0B68E2E5F75F6BEE95A2E0BD93CEAA4A6734DB9F19B728948',
        'A170D51B94E00371ACE76E35AC81DC9405D5D04D4CEBC399AEACE07AE05DD293',
      ],
    };

    const request = {
      hash: '991CF190094C00F0B68E2E5F75F6BEE95A2E0BD93CEAA4A6734DB9F19B728948',
    };

    mockServer.success({
      request: Object.assign({}, request, {
        action: 'republish',
      }),
      response: expected,
    });

    const response = await rai.network.republish(request);
    expect(response).toEqual(expected);
  });
});
