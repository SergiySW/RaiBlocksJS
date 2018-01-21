import BigNumber from 'bignumber.js';

const throwError = (type, value) => {
  throw new Error(`'${value}' is not a valid ${type} type`);
};

const units = {
  Trai: 36,
  Grai: 33,
  XRB: 30,
  Mrai: 30,
  krai: 27,
  rai: 24,
  mrai: 21,
  urai: 18,
  prai: 15,
  raw: 0,
};

export default function getConversion({ value, from, to }) {
  if (units[from] === undefined) throwError('from', from);
  if (units[to] === undefined) throwError('to', to);

  const bigNumber = new BigNumber(value);

  const getRaw = bigNumber.shift(units[from]);
  const getOutput = getRaw.shift(units[to] * -1);

  return getOutput.toFixed();
}

export const convertToRaw = (value, unit) =>
  getConversion({ value, from: unit, to: 'raw' });

export const convertFromRaw = (value, unit) =>
  getConversion({ value, from: 'raw', to: unit });

