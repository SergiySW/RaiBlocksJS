
export default function Frontiers(rpc) {
  const getCount = () => rpc('frontiers_count');

  const get = ({ account, count }) => rpc('frontiers', { account, count });

  return {
    count: getCount,
    get,
  };
}
