import removeEmptyObjectProperties from '../../utils/removeEmptyObjectProperties';

export default function Keys(rpc) {
  const get = ({
    account,
    count = '4096',
    representative,
    weight,
    pending,
    sorting,
  }) => rpc('ledger', removeEmptyObjectProperties({
    account,
    count,
    representative,
    weight,
    pending,
    sorting,
  }));

  const history = ({ hash, count = '4096' }) => rpc('history', { hash, count });

  const succesors = ({ block, count = '4096' }) => rpc('succesors', { block, count });

  return {
    get,
    history,
    succesors,
  };
}
