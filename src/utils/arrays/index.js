export const areArraysEqual = (array1, array2) => {
  for (let i = 0; i < array1.length; i += 1) {
    if (array1[i] !== array2[i]) return false;
  }
  return true;
};

export const arrayCrop = (array) => {
  const length = array.length - 1;
  const croppedArray = new Uint8Array(length);
  for (let i = 0; i < length; i += 1) {
    croppedArray[i] = array[i + 1];
  }
  return croppedArray;
};

export const arrayExtend = (array) => {
  const length = array.length + 1;
  const extendedArray = new Uint8Array(length);
  for (let i = 0; i < (length - 1); i += 1) {
    extendedArray[i + 1] = array[i];
  }
  return extendedArray;
};

