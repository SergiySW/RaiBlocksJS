export default function Representatives(rpc) {
  const get = () => rpc('representatives');

  const getWalletRepresentative = ({ wallet }) => rpc('wallet_representative', { wallet });

  const walletSet = async ({ wallet, representative }) => {
    const response = await rpc('wallet_representative_set', { wallet, representative });
    if (response.set) {
      return { success: true };
    }
    return { success: false };
  };

  return {
    get,
    wallet: getWalletRepresentative,
    walletSet,
  };
}
