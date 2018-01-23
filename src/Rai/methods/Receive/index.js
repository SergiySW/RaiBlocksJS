import getSuccessResponse from '../../../utils/getSuccessResponse';

export default function Receive(rpc) {
  const get = ({ wallet, account, block }) => rpc('receive', { wallet, account, block });

  const minimum = () => rpc('receive_minimum');

  const setMinimum = async ({ amount }) => {
    const response = await rpc('receive_minimum_set', { amount });
    return getSuccessResponse(response);
  };

  return {
    get,
    minimum,
    setMinimum,
  };
}
