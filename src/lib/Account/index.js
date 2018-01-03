import getUnit from '../../utils/getUnit';

export default (rpc) => {
  const balance = ({ account }) =>
    rpc({ action: 'account_balance', account });


  const blockCount = async ({ account }) => {
    const { block_count: _blockCount } = await rpc({ action: 'account_block_count', account });
    return _blockCount;
  };

  const create = async ({ wallet, work = true }) => {
    const { account } = await rpc({ action: 'account_create', wallet, work });
    return account;
  };

  const info = async ({
    account,
    unit = 'raw',
    representative = false,
    weight = false,
    pending = false,
  }) => {
    const accountInfo = await rpc({
      action: 'account_info', account, representative, weight, pending,
    });

    if (unit !== 'raw') {
      accountInfo.balance = getUnit(accountInfo.balance, 'raw', unit);
      if (weight) accountInfo.weight = getUnit(accountInfo.weight, 'raw', unit);
      if (pending) accountInfo.pending = getUnit(accountInfo.pending, 'raw', unit);
    }

    return accountInfo;
  };

  const history = async ({ account, count = '4096' }) => {
    const { history: _history } = await rpc({ action: 'account_history', account, count: count.toString() });
    return _history;
  };

  const get = (key) => {
    const { account } = rpc({ action: 'account_get', key });
    return account;
  };

  const key = (account) => {
    const { key: _key } = rpc({ action: 'account_key', account });
    return _key;
  };

  const list = (wallet) => {
    const { accounts } = rpc({ action: 'account_list', wallet });
    return accounts;
  };

  const move = (wallet, source, accounts) => {
    const { moved } = rpc({
      action: 'account_move', wallet, source, accounts,
    });
    return moved;
  };

  const remove = (wallet, account) => {
    const { removed } = rpc({ action: 'account_remove', wallet, account });
    return removed;
  };

  const getRepresentative = (account) => {
    const { representative } = rpc({ action: 'account_representative', account });
    return representative;
  };

  const setRepresentative = (wallet, account, representative, work = '0000000000000000') => {
    const { block } = rpc({
      action: 'account_representative_set', wallet, account, representative, work,
    });
    return block;
  };

  const weight = (account, unit = 'raw') => {
    const { weight: _weight } = rpc({ action: 'account_weight', account });
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
