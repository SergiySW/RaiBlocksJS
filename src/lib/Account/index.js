import getUnit from '../../utils/getUnit';

export default function Account(rpc) {
  const balance = ({ account }) =>
    rpc('account_balance', { account });


  const blockCount = async ({ account }) => {
    const { block_count: _blockCount } = await rpc('account_block_count', { account });
    return _blockCount;
  };

  const create = async ({ wallet, work = true }) => {
    const { account } = await rpc('account_create', { wallet, work });
    return account;
  };

  const info = async ({
    account,
    unit = 'raw',
    representative = false,
    weight = false,
    pending = false,
  }) => {
    const accountInfo = await rpc('account_info', {
      account, representative, weight, pending,
    });

    if (unit !== 'raw') {
      accountInfo.balance = getUnit(accountInfo.balance, 'raw', unit);
      if (weight) accountInfo.weight = getUnit(accountInfo.weight, 'raw', unit);
      if (pending) accountInfo.pending = getUnit(accountInfo.pending, 'raw', unit);
    }

    return accountInfo;
  };

  const history = async ({ account, count = '4096' }) => {
    const { history: _history } = await rpc('account_history', { account, count: count.toString() });
    return _history;
  };

  const get = async ({ key }) => {
    const { account } = await rpc('account_get', { key });
    return account;
  };

  const key = async ({ account }) => {
    const { key: _key } = await rpc('account_key', { account });
    return _key;
  };

  const list = async ({ wallet }) => {
    const { accounts } = await rpc('account_list', { wallet });
    return accounts;
  };

  const move = ({ wallet, source, accounts }) =>
    rpc('account_move', { wallet, source, accounts });


  const remove = ({ wallet, account }) =>
    rpc('account_remove', { wallet, account });


  const getRepresentative = async ({ account }) => {
    const { representative } = await rpc('account_representative', { account });
    return representative;
  };

  const setRepresentative = ({
    wallet,
    account,
    representative,
    work = '0000000000000000',
  }) => rpc('account_representative_set', {
    wallet, account, representative, work,
  });


  const weight = async ({ account, unit = 'raw' }) => {
    const { weight: _weight } = await rpc('account_weight', { account });
    return getUnit(_weight, 'raw', unit);
  };

  return {
    balance,
    blockCount,
    create,
    info,
    history,
    get,
    key,
    list,
    move,
    remove,
    getRepresentative,
    setRepresentative,
    weight,
  };
};
