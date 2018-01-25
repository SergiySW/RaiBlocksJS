/*  eslint-disable no-bitwise */

export const uint8ToUint4 = (uint8) => {
  const { length } = uint8;
  const uint4 = new Uint8Array(length * 2);
  for (let i = 0; i < length; i += 1) {
    uint4[i * 2] = uint8[i] / 16 | 0;
    uint4[(i * 2) + 1] = uint8[i] % 16;
  }
  return uint4;
};

export const uint4ToUint8 = (uint4) => {
  const length = uint4.length / 2;
  const uint8 = new Uint8Array(length);
  for (let i = 0; i < length; i += 1) {
    uint8[i] = (uint4[i * 2] * 16) + uint4[(i * 2) + 1];
  }
  return uint8;
};

export const uint4ToUint5 = (uint4) => {
  const length = (uint4.length / 5) * 4;
  const uint5 = new Uint8Array(length);
  for (let i = 1; i <= length; i += 1) {
    const n = i - 1;
    const m = i % 4;
    const z = n + ((i - m) / 4);
    const right = uint4[z] << m;
    let left;
    if (((length - i) % 4) === 0) {
      left = uint4[z - 1] << 4;
    } else {
      left = uint4[z + 1] >> (4 - m);
    }
    uint5[n] = (left + right) % 32;
  }
  return uint5;
};

export const uint5ToUint4 = (uint5) => {
  const length = (uint5.length / 4) * 5;
  const uint4 = new Uint8Array(length);
  for (let i = 1; i <= length; i += 1) {
    const n = i - 1;
    const m = i % 5;
    const z = n - ((i - m) / 5);
    const right = uint5[z - 1] << (5 - m);
    const left = uint5[z] >> m;
    uint4[n] = (left + right) % 16;
  }
  return uint4;
};

export const stringToUint5 = (string) => {
  const letterList = '13456789abcdefghijkmnopqrstuwxyz'.split('');
  const { length } = string;
  const stringArray = string.split('');
  const uint5 = new Uint8Array(length);
  for (let i = 0; i < length; i += 1) {
    uint5[i] = letterList.indexOf(stringArray[i]);
  }
  return uint5;
};

export const uint5ToString = (uint5) => {
  const letterList = '13456789abcdefghijkmnopqrstuwxyz'.split('');
  let string = '';
  for (let i = 0; i < uint5.length; i += 1) {
    string += letterList[uint5[i]];
  }
  return string;
};

export const hexToUint8 = (hex) => {
  const length = (hex.length / 2) | 0;
  const uint8 = new Uint8Array(length);
  for (let i = 0; i < length; i += 1) {
    uint8[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return uint8;
};

export const uint4ToHex = (uint4) => {
  let hex = '';
  for (let i = 0; i < uint4.length; i += 1) {
    hex += uint4[i].toString(16).toUpperCase();
  }
  return (hex);
};

export const uint8ToHex = (uint8) => {
  const hex = uint4ToHex(uint8ToUint4(uint8));
  return (hex);
};

export const intToUint8 = (_integer, length) => {
  let integer = _integer;
  const uint8 = new Uint8Array(length);
  for (let i = 0; i < length; i += 1) {
    const byte = integer & 0xff;
    uint8[i] = byte;
    integer = (integer - byte) / 256;
  }
  return uint8;
};
