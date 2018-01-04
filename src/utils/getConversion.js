import BigNumber from 'bignumber.js';

const throwError = (type, value) => {
  throw new Error(`'${value}' is not a valid ${type} type`);
};

export default function getConversion({ value, from, to }) {
  let result = new BigNumber(value);

  // Step 1: to RAW
  switch (from) {
    case 'Trai': result = result.shift(36); break; // draft
    case 'Grai': result = result.shift(33); break;
    case 'XRB': result = result.shift(30); break;
    case 'Mrai': result = result.shift(30); break;
    case 'krai': result = result.shift(27); break;
    case 'rai': result = result.shift(24); break;
    case 'mrai': result = result.shift(21); break;
    case 'urai': result = result.shift(18); break;
    case 'prai': result = result.shift(15); break; // draft
    case 'raw': break;
    default: throwError('from', from);
  }

  // Step 2: to output
  switch (to) {
    case 'Trai': result = result.shift(-36); break; // draft
    case 'Grai': result = result.shift(-33); break;
    case 'XRB': result = result.shift(-30); break;
    case 'Mrai': result = result.shift(-30); break;
    case 'krai': result = result.shift(-27); break;
    case 'rai': result = result.shift(-24); break;
    case 'mrai': result = result.shift(-21); break;
    case 'urai': result = result.shift(-18); break;
    case 'prai': result = result.shift(-15); break; // draft
    case 'raw': break;
    default: throwError('to', to);
  }

  result = result.toFixed();
  return result;
}

export const convertFromRaw = (value, unit) =>
  getConversion({ value, from: 'raw', to: unit });

