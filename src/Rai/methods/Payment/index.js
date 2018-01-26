export default function Payment(rpc) {
  const begin = ({ wallet }) => rpc('payment_begin', { wallet });

  const init = ({ wallet }) => rpc('payment_init', { wallet });

  const end = async ({ wallet, account }) => {
    await rpc('payment_end', { wallet, account });
    return { success: true };
  };

  const wait = async ({ account, amount, timeout = 5000 }) => {
    const { status } = await rpc('payment_wait', { account, amount, timeout });
    if (status === 'success') return { success: true };
    return { success: false };
  };

  return {
    begin,
    init,
    end,
    wait,
  };
}
