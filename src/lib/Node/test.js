import mockServer from '../../../mocks/mockServer';
import rai from '../../../mocks/mockRai';

describe('Network', () => {
  test('node.version', async () => {
    const expected = {
      rpc_version: '1',
      store_version: '2',
      node_vendor: 'RaiBlocks 7.5.0',
    };

    mockServer.success({
      request: {
        action: 'version',
      },
      response: expected,
    });

    const response = await rai.node.version();
    expect(response).toEqual(expected);
  });

  test('node.stop', async () => {
    const expected = {
      success: true,
    };

    mockServer.success({
      request: {
        action: 'stop',
      },
      response: { success: '' },
    });

    const response = await rai.node.stop();
    expect(response).toEqual(expected);
  });
});
