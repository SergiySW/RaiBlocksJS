import getUnit from '../../utils/getUnit';

export default (rpc) => {
  const balance = (account) => {
    return rpc({ action: 'account_balance', account });
  };

  const blockCount = (account) => {
    const { blockCount: _blockCount } = this.rpc({ action: 'account_block_count', account });
    return _blockCount;
  };

  const create = (wallet, work = true) => {
    const { account } = this.rpc({ action: 'account_create', wallet, work });
    return account;
  };

  const info = (account, unit = 'raw', representative = false, weight = false, pending = false) => {
    const accountInfo = this.rpc({
      action: 'account_info', account, representative, weight, pending,
    });

    if (unit !== 'raw') {
      accountInfo.balance = getUnit(accountInfo.balance, 'raw', unit);
      if (weight) accountInfo.weight = getUnit(accountInfo.weight, 'raw', unit);
      if (pending) accountInfo.pending = getUnit(accountInfo.pending, 'raw', unit);
    }

    return accountInfo;
  };

  const history = (account, count = '4096') => {
    const { history: _history } = this.rpc({ action: 'account_history', account, count });
    return _history;
  };

  const get = (key) => {
    const { account } = this.rpc({ action: 'account_get', key });
    return account;
  };

  const key = (account) => {
    const { key: _key } = this.rpc({ action: 'account_key', account });
    return _key;
  };

  const list = (wallet) => {
    const { accounts } = this.rpc({ action: 'account_list', wallet });
    return accounts;
  };

  const move = (wallet, source, accounts) => {
    const { moved } = this.rpc({
      action: 'account_move', wallet, source, accounts,
    });
    return moved;
  };

  const remove = (wallet, account) => {
    const { removed } = this.rpc({ action: 'account_remove', wallet, account });
    return removed;
  };

  const getRepresentative = (account) => {
    const { representative } = this.rpc({ action: 'account_representative', account });
    return representative;
  };

  const setRepresentative = (wallet, account, representative, work = '0000000000000000') => {
    const { block } = this.rpc({
      action: 'account_representative_set', wallet, account, representative, work,
    });
    return block;
  };

  const weight = (account, unit = 'raw') => {
    const { weight: _weight } = this.rpc({ action: 'account_weight', account });
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
