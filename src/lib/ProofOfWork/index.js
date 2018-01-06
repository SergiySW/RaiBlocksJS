import getSuccessResponse from '../../utils/getSuccessResponse';

export default function ProofOfWork(rpc) {
  const cancel = async ({ hash }) => {
    const response = await rpc('work_cancel', { hash });
    if (response) {
      return { success: true };
    }
    return { success: false };
  };

  const generate = async ({ hash }) => {
    const response = await rpc('work_generate', { hash });
    return response;
  };

  const get = async ({ wallet, account }) => {
    const response = await rpc('work_get', { wallet, account });
    return response;
  };

  const set = async ({ wallet, account, work }) => {
    const response = await rpc('work_set', { wallet, account, work });
    return getSuccessResponse(response);
  };

  return {
    cancel,
    get,
    generate,
    set,
  };
}
