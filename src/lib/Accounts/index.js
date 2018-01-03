import getUnit from '../../utils/getUnit';

export default (rpc) => {
  const balances = (accounts) => {
    const { balances: _balances } = rpc({ action: 'accounts_balances', accounts });
    return _balances;
  };

  const create = (wallet, count = 1, work = true) => {
    const { accounts } = rpc({
      action: 'accounts_create', wallet, count, work,
    });
    return accounts;
  };

  const frontiers = (accounts) => {
    const { frontiers: _frontiers } = rpc({ action: 'accounts_frontiers', accounts });
    return _frontiers;
  };

  const pending = ({
    accounts,
    count = '4096',
    _threshold = 0,
    unit = 'raw',
    source = false,
  }) => {
    let threshold = _threshold;
    if (threshold !== 0)	{
      threshold = getUnit(threshold, unit, 'raw');
    }
    const { blocks } = rpc({
      action: 'accounts_pending', accounts, count, threshold, source,
    });

    if (source) {
      for (const account in blocks) {
        for (const hash in blocks[account]) {
          blocks[account][hash].amount = getUnit(blocks[account][hash].amount, 'raw', unit);
        }
      }
    } else if (threshold != 0) {
      for (const account in blocks) {
        for (const hash in blocks[account]) {
          blocks[account][hash] = getUnit(blocks[account][hash], 'raw', unit);
        }
      }
    }
    return blocks;
  }

  return {
    balances,
    create,
    frontiers,
    pending,
  };
};
