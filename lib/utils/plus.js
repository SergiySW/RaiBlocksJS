import BigNumber from 'bignumber.js';

export default function(base, plus) {
  const value = new BigNumber(base.toString());
  const bigPlus = new BigNumber(plus.toString());
  return value.plus(bigPlus).toFixed();
}
