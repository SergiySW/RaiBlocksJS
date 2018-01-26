export default function Pending(rpc) {
  const get = async ({
    account,
    count,
    threshold,
    source,
  }) => {
    const response = await rpc('pending', {
      account,
      count,
      threshold,
      source,
    });
    return response;
  };

  const exists = async ({ hash }) => {
    const response = await rpc('pending_exists', { hash });
    if (response.exists) {
      return { exists: true };
    }
    return { exists: false };
  };

  const search = async ({ wallet } = {}) => {
    if (wallet) {
      const response = await rpc('search_pending', { wallet });
      if (response.started) {
        return { started: true };
      }
      return { started: false };
    }
    const response = await rpc('search_pending_all', { wallet });
    if (response.success) {
      return { success: true };
    }
    return { success: false };
  };

  return {
    get,
    exists,
    search,
  };
}
