import getSuccessResponse from '../../utils/getSuccessResponse';

export default function Unchecked(rpc) {
  const clear = async () => {
    const response = await rpc('unchecked_clear');
    return getSuccessResponse(response);
  };

  const get = ({ hash }) => rpc('unchecked_get', { hash });

  const keys = ({ key, count }) => rpc('unchecked_keys', { key, count });

  const list = ({ count }) => rpc('unchecked', { count });

  return {
    clear,
    get,
    keys,
    list,
  };
}
