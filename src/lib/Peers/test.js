import mockServer from '../../../test/mockServer';
import rai from '../../../test/mockRai';

describe('Peers', () => {
  test('peers.addWorkPeer', async () => {
    const expected = {
      success: true,
    };

    const request = {
      address: '::ffff:172.17.0.1:7076',
      port: '7076',
    };

    mockServer.success({
      request: Object.assign({}, request, {
        action: 'work_peer_add',
      }),
      response: { success: '' },
    });

    const response = await rai.peers.addWorkPeer(request);
    expect(response).toEqual(expected);
  });

  test('peers.getWorkPeers', async () => {
    const expected = {
      work_peers: [
        '::ffff:172.17.0.1:7076',
      ],
    };

    mockServer.success({
      request: {
        action: 'work_peers',
      },
      response: expected,
    });

    const response = await rai.peers.getWorkPeers();
    expect(response).toEqual(expected);
  });

  test('peers.clearWorkPeers', async () => {
    const expected = {
      success: true,
    };

    mockServer.success({
      request: {
        action: 'work_peers_clear',
      },
      response: {},
    });

    const response = await rai.peers.clearWorkPeers();
    expect(response).toEqual(expected);
  });

  test('peers.get', async () => {
    const expected = {
      peers: [
        '::ffff:172.17.0.1:7076',
      ],
    };

    mockServer.success({
      request: {
        action: 'peers',
      },
      response: expected,
    });

    const response = await rai.peers.get();
    expect(response).toEqual(expected);
  });
});
