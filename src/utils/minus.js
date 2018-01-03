import BigNumber from 'bignumber.js';

export default (base, minus) => {
  const value = new BigNumber(base.toString());
  const bigMinus = new BigNumber(minus.toString());

  if (bigMinus.greaterThan(value)) {
    throw new Error(`Cannot subtract ${value} from ${bigMinus}`);
  }
  return value.minus(bigMinus).toFixed();
};
