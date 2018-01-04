import getUnit from '../../utils/getUnit';

export default (rpc) => {
  const balances = ({ accounts }) =>
    rpc({ action: 'accounts_balances', accounts });


  const create = async ({ wallet, count = 1, work = true }) => {
    const { accounts } = await rpc({
      action: 'accounts_create', wallet, count, work,
    });
    return accounts;
  };

  const frontiers = async ({ accounts }) => {
    const { frontiers: _frontiers } = await rpc({ action: 'accounts_frontiers', accounts });
    return _frontiers;
  };

  const pending = async ({
    accounts,
    count = '4096',
    threshold = 0,
    unit = 'raw',
    source = false,
  }) => {
    let thresholdCopy = threshold;
    if (thresholdCopy !== 0) {
      thresholdCopy = getUnit(threshold, unit, 'raw');
    }
    const { blocks } = await rpc({
      action: 'accounts_pending', accounts, count, threshold: thresholdCopy, source,
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
