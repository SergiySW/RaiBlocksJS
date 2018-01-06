import getConversion, { convertFromRaw } from '../../utils/getConversion';
import getSuccessResponse from '../../utils/getSuccessResponse';

export default function Wallet(rpc) {
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
      balance: convertFromRaw(balance, unit),
      pending: convertFromRaw(pending, unit),
    };
  };

  const balances = async ({ wallet, unit = 'raw', threshold = 0 }) => {
    let newThreshold = threshold;
    if (newThreshold !== 0) {
      newThreshold = getConversion({
        value: threshold,
        from: unit,
        to: 'raw',
      });
    }

    const { balances: _balances } = await rpc('wallet_balances', { wallet, threshold: newThreshold });

    Object.keys(_balances).forEach((account) => {
      _balances[account].balance = convertFromRaw(_balances[account].balance, unit);
      _balances[account].pending = convertFromRaw(_balances[account].pending, unit);
    });

    return _balances;
  };

  // Empty output
  const changeSeed = async ({ wallet, seed }) => {
    const response = await rpc('wallet_change_seed', { wallet, seed });
    return getSuccessResponse(response);
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

  const passwordChange = async ({ wallet, password }) => {
    const { changed } = await rpc('password_change', { wallet, password });
    return { changed: Boolean(Number(changed)) };
  };

  const passwordEnter = async ({ wallet, password }) => {
    const { valid } = await rpc('password_enter', { wallet, password });
    return { valid: Boolean(Number(valid)) };
  };

  const passwordValid = async ({ wallet }) => {
    const { valid } = await rpc('password_valid', { wallet });
    return { valid: Boolean(Number(valid)) };
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
      newThreshold = getConversion(threshold, unit, 'raw');
    }
    const { blocks } = await rpc('wallet_pending', {
      wallet, count, threshold: newThreshold, source,
    });

    if (source) {
      Object.keys(blocks).forEach((account) => {
        Object.keys(blocks[account]).forEach((hash) => {
          blocks[account][hash].amount = convertFromRaw(blocks[account][hash].amount, unit);
        });
      });
    } else if (threshold !== 0) {
      Object.keys(blocks).forEach((account) => {
        Object.keys(blocks[account]).forEach((hash) => {
          blocks[account][hash] = convertFromRaw(blocks[account][hash], unit);
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

  // alias for rai.wallet.passwordEnter
  const unlock = ({ wallet, password }) => passwordEnter({ wallet, password });

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
    passwordChange,
    passwordEnter,
    passwordValid,
    pending,
    getRepresentative,
    setRepresentative,
    republish,
    unlock,
    workGet,
  };
}
