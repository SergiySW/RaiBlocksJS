import BigNumber from 'bignumber.js';

export default (base, plus) => {
  const value = new BigNumber(base.toString());
  const bigPlus = new BigNumber(plus.toString());
  return value.plus(bigPlus).toFixed();
};
