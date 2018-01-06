
export default function Delegators(rpc) {
  const count = ({ account }) => rpc('delegators_count', { account });

  const get = ({ account }) => rpc('delegators', { account });

  return {
    count,
    get,
  };
}
