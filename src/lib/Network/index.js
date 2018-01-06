
export default function Network(rpc) {
  const availableSupply = () => rpc('available_supply');

  const keepAlive = async ({ address, port }) => {
    const response = await rpc('keepalive', { address, port });
    if (response) {
      return { success: true };
    }
    return { success: false };
  };

  const republish = ({ hash }) => rpc('republish', { hash });

  return {
    availableSupply,
    keepAlive,
    republish,
  };
}
