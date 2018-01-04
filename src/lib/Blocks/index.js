export default (rpc) => {
  const account = ({ hash }) => rpc('block_account', { hash });

  const getCount = () => rpc('block_count');

  const countByType = () => rpc('block_count_type');

  const chain = ({ block, count }) => rpc('chain', { block, count });

  /*
    blockData: Object {
      type: String 'open|send|recieve'|change,
      key: String,
      account: String,
      representative: String,
      source: String,
    }
    see https://github.com/clemahieu/raiblocks/wiki/RPC-protocol#offline-signing--create-block
  */
  const create = blockData => rpc('block_create', blockData);

  /*
    block: Object {
      type: String 'open|send|recieve'|change,
      account: String,
      representative: String,
      source: String,
      work: String,
      signature: String,
    }
    see https://github.com/clemahieu/raiblocks/wiki/RPC-protocol#offline-signing--create-block
  */
  const process = block => rpc('process', { block });

  const get = ({ hashes, info = false }) => {
    if (Array.isArray(hashes)) {
      if (info) {
        return rpc('blocks_info', { hashes });
      }

      return rpc('blocks', { hashes });
    }

    return rpc('block', { hash: hashes });
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
};
