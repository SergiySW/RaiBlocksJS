import BigNumber from 'bignumber.js';

export const isValidHash = (hash, bytes = 32) => {
  if (bytes === 16) return /[0-9A-F]{32}\b/i.test(hash) && hash.length === (bytes * 2);
  if (bytes === 32) return /[0-9A-F]{64}\b/i.test(hash) && hash.length === (bytes * 2);
  if (bytes === 64) return /[0-9A-F]{128}/i.test(hash) && hash.length === (bytes * 2);
  throw new Error(`Bytes must be 16, 32 or 64, ${bytes} supplied`);
};

export const isValidAccount = account =>
  (account.startsWith('xrb_1') || account.startsWith('xrb_3')) && account.length === 64;


// Use for RAW
export const subtract = (base, minus) => {
  let value = new BigNumber(base.toString());
  const bigMinus = new BigNumber(minus.toString());
  if (bigMinus.greaterThan(value)) {
    throw new Error('Subtraction will result in negative value');
  }

  value = value.minus(bigMinus);
  value = value.toFixed(0);
  return value;
};

// Use for RAW
export const rawToHex = (raw) => {
  let value = new BigNumber(raw.toString());
  value = value.toString(16).toUpperCase();
  /* istanbul ignore next */
  if (value.length < 32) {
    for (let n = value.length; n < 32; n += 1) {
      value = `0${value}`;
    }
  }
  return value;
};
