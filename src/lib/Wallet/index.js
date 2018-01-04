import getUnit from '../../utils/getUnit';

export default (rpc) => {
  const add = async ({ wallet, key, work = true }) => {
    const { account } = await rpc('wallet_add', {
      wallet, key, work,
    });

    return account;
  };

  // Object output
  const balanceTotal = async ({ wallet, unit = 'raw' }) => {
    const { balance, pending } = await rpc('wallet_balance_total', { wallet });

    return {
      balance: getUnit(balance, 'raw', unit),
      pending: getUnit(pending, 'raw', unit),
    };
  };

  const balances = async ({ wallet, unit = 'raw', threshold = 0 }) => {
    let newThreshold = threshold;
    if (newThreshold !== 0) {
      newThreshold = getUnit(threshold, unit, 'raw');
    }

    const { balances: _balances } = await rpc('wallet_balances', { wallet, threshold: newThreshold });

    Object.keys(_balances).forEach((account) => {
      _balances[account].balance = getUnit(_balances[account].balance, 'raw', unit);
      _balances[account].pending = getUnit(_balances[account].pending, 'raw', unit);
    });

    return _balances;
  };


  // Empty output
  const changeSeed = async ({ wallet, seed }) => {
    const response = await rpc('wallet_change_seed', { wallet, seed });
    if (Object.prototype.hasOwnProperty.call(response, 'success')) {
      return { success: true };
    }
    return { success: false };
  };


  const contains = async ({ wallet, account }) => {
    const response = await rpc('wallet_contains', { wallet, account });
    return { exists: Boolean(Number(response.exists)) };
  };


  const create = () => rpc('wallet_create');

  const destroy = async ({ wallet }) => {
    const response = await rpc('wallet_destroy', { wallet });
    if (response) {
      return { success: true };
    }
    return { success: false };
  };

  const exportWallet = ({ wallet }) => rpc('wallet_export', { wallet });

  const frontiers = ({ wallet }) => rpc('wallet_frontiers', { wallet });

  const locked = async ({ wallet }) => {
    const { locked: isLocked } = await rpc('wallet_locked', { wallet });
    return { locked: Boolean(Number(isLocked)) };
  };

  const pending = async ({
    wallet,
    count = '4096',
    threshold = 0,
    unit = 'raw',
    source = false,
  }) => {
    let newThreshold = threshold;
    if (newThreshold !== 0) {
      newThreshold = getUnit(threshold, unit, 'raw');
    }
    const { blocks } = await rpc('wallet_pending', {
      wallet, count, threshold: newThreshold, source,
    });

    if (source) {
      Object.keys(blocks).forEach((account) => {
        Object.keys(blocks[account]).forEach((hash) => {
          blocks[account][hash].amount = getUnit(blocks[account][hash].amount, 'raw', unit);
        });
      });
    } else if (threshold !== 0) {
      Object.keys(blocks).forEach((account) => {
        Object.keys(blocks[account]).forEach((hash) => {
          blocks[account][hash] = getUnit(blocks[account][hash], 'raw', unit);
        });
      });
    }
    return { blocks };
  };


  const getRepresentative = ({ wallet }) => rpc('wallet_representative', { wallet });


  const setRepresentative = async ({ wallet, representative }) => {
    const { set } = await rpc('wallet_representative_set', { wallet, representative });
    const success = Boolean(Number(set));
    return { set: success };
  };


  const republish = ({ wallet, count = 2 }) => rpc('wallet_republish', { wallet, count });


  const workGet = ({ wallet }) => rpc('wallet_work_get', { wallet });

  return {
    add,
    balanceTotal,
    balances,
    changeSeed,
    contains,
    create,
    destroy,
    export: exportWallet,
    frontiers,
    locked,
    pending,
    getRepresentative,
    setRepresentative,
    republish,
    workGet,
  };
};
