
export default function Keys(rpc) {
  const create = () => rpc('key_create');

  const deterministic = ({ seed, index }) => rpc('key_deterministic', { seed, index });

  const expand = ({ key }) => rpc('key_expand', { key });

  return {
    create,
    deterministic,
    expand,
  };
}
