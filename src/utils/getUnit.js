import BigNumber from 'bignumber.js';

const throwError = (type, value) => {
  throw new Error(`'${value}' is not a valid ${type} type`);
};

export default (input, inputUnit, outputUnit) => {
  let value = new BigNumber(input);

  // Step 1: to RAW
  switch (inputUnit) {
    case 'Trai': value = value.shift(36); break; // draft
    case 'Grai': value = value.shift(33); break;
    case 'XRB': value = value.shift(30); break;
    case 'Mrai': value = value.shift(30); break;
    case 'krai': value = value.shift(27); break;
    case 'rai': value = value.shift(24); break;
    case 'mrai': value = value.shift(21); break;
    case 'urai': value = value.shift(18); break;
    case 'prai': value = value.shift(15); break; // draft
    case 'raw': break;
    default: throwError('input', inputUnit);
  }

  // Step 2: to output
  switch (outputUnit) {
    case 'Trai': value = value.shift(-36); break; // draft
    case 'Grai': value = value.shift(-33); break;
    case 'XRB': value = value.shift(-30); break;
    case 'Mrai': value = value.shift(-30); break;
    case 'krai': value = value.shift(-27); break;
    case 'rai': value = value.shift(-24); break;
    case 'mrai': value = value.shift(-21); break;
    case 'urai': value = value.shift(-18); break;
    case 'prai': value = value.shift(-15); break; // draft
    case 'raw': break;
    default: throwError('output', outputUnit);
  }

  value = value.toFixed();
  return value;
};
