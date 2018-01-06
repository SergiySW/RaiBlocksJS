import getSuccessResponse from '../../utils/getSuccessResponse';

export default function Peers(rpc) {
  const addWorkPeer = async ({ address, port }) => {
    const response = await rpc('work_peer_add', { address, port });
    return getSuccessResponse(response);
  };

  const getWorkPeers = () => rpc('work_peers');

  const clearWorkPeers = async () => {
    const response = await rpc('work_peers_clear');
    if (response) return { success: true };
    return { success: false };
  };

  const get = () => rpc('peers');

  return {
    addWorkPeer,
    getWorkPeers,
    clearWorkPeers,
    get,
  };
}
