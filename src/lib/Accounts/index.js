import getConversion from '../../utils/getConversion';

export default function Accounts(rpc) {
  const balances = ({ accounts }) =>
    rpc('accounts_balances', { accounts });


  const create = async ({ wallet, count = 1, work = null }) => {
    const { accounts } = await rpc('accounts_create', {
      wallet, count, work,
    });
    return accounts;
  };

  const frontiers = async ({ accounts }) => {
    const { frontiers: _frontiers } = await rpc('accounts_frontiers', { accounts });
    return _frontiers;
  };

  const pending = async ({
    accounts,
    count = 4096,
    threshold = 0,
    unit = 'raw',
    source = null,
  }) => {
    let thresholdCopy = threshold;
    if (thresholdCopy !== 0) {
      thresholdCopy = getConversion({
        value: threshold,
        from: unit,
        to: 'raw',
      });
    }
    const { blocks } = await rpc('accounts_pending', {
      accounts, count, threshold: thresholdCopy, source,
    });

    return blocks;
  };

  return {
    balances,
    create,
    frontiers,
    pending,
  };
}
