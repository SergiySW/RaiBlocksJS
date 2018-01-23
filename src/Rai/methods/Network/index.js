
export default function Network(rpc) {
  const availableSupply = () => rpc('available_supply');

  const keepAlive = async ({ address, port }) => {
    await rpc('keepalive', { address, port });
    return { success: true };
  };

  const republish = ({ hash }) => rpc('republish', { hash });

  return {
    availableSupply,
    keepAlive,
    republish,
  };
}
