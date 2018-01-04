import mockServer from '../../../test/mockServer';
import rai from '../../../test/mockRai';

describe('Bootstrap', () => {
  test('bootstrap', async () => {
    const expected = {
      success: true,
    };

    const request = {
      address: '::ffff:138.201.94.249',
      port: '7075',
    };

    mockServer.success({
      request: Object.assign({}, request, {
        action: 'bootstrap',
      }),
      response: { success: '1' },
    });

    const response = await rai.bootstrap(request);
    expect(response).toEqual(expected);
  });

  test('bootstrap any', async () => {
    const expected = {
      success: true,
    };

    mockServer.success({
      request: {
        action: 'bootstrap_any',
      },
      response: { success: '1' },
    });

    const response = await rai.bootstrap();
    expect(response).toEqual(expected);
  });
});
