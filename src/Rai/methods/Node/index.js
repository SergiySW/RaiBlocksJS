import getSuccessResponse from '../../../utils/getSuccessResponse';

export default function Node(rpc) {
  const version = () => rpc('version');

  const stop = async () => {
    const response = await rpc('stop');
    return getSuccessResponse(response);
  };

  return {
    version,
    stop,
  };
}
