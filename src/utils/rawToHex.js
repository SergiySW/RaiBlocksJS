import BigNumber from 'bignumber.js';

export default (raw) => {
  let value = new BigNumber(raw.toString());
  value = value.toString(16).toUpperCase();
  if (value.length < 32) {
    for (let n = value.length; n < 32; n += 1) {
      value = `0${value}`;
    }
  }
  return value;
};
