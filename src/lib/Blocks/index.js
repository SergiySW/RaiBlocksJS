export default function Blocks(rpc) {
  const account = ({ hash }) => rpc('block_account', { hash });

  const getCount = () => rpc('block_count');

  const countByType = () => rpc('block_count_type');

  const chain = ({ block, count = 1 }) => rpc('chain', { block, count });

  /*
    blockData: Object {
      account: String,
      key: String,
      representative: String,
      source: String,
      type: String 'open|send|recieve'|change,
    }
    see https://github.com/clemahieu/raiblocks/wiki/RPC-protocol#offline-signing--create-block
  */
  const create = blockData => rpc('block_create', blockData);

  /*
    block: Object {
      account: String,
      representative: String,
      signature: String,
      source: String,
      type: String 'open|send|recieve'|change,
      work: String,
    }
    see https://github.com/clemahieu/raiblocks/wiki/RPC-protocol#offline-signing--create-block
  */
  const process = block => rpc('process', { block });

  const get = async (hashes, { info = false } = {}) => {
    if (Array.isArray(hashes)) {
      if (info) {
        return rpc('blocks_info', { hashes });
      }

      return rpc('blocks', { hashes });
    }

    const { contents } = await rpc('block', { hash: hashes });
    return contents;
  };

  return {
    account,
    count: getCount,
    countByType,
    chain,
    create,
    process,
    get,
  };
}
