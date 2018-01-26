import { areArraysEqual, arrayCrop, arrayExtend } from './';

describe('array methods', () => {
  test('areArraysEqual', () => {
    let arrA = [1, 2, 3, 4, 5];
    let arrB = [1, 2, 3, 4, 5];
    expect(areArraysEqual(arrA, arrB)).toBeTruthy();

    arrB = [1, 2, 3, 5, 4];
    expect(areArraysEqual(arrA, arrB)).toBeFalsy();

    arrA = [1, 2, 3, 5, 4];
    expect(areArraysEqual(arrA, arrB)).toBeTruthy();
  });

  test('arrayCrop', () => {
    let arrA = [1, 2, 3, 4, 5];
    let croppedArray = arrayCrop(arrA);

    expect(croppedArray).toEqual(new Uint8Array([2, 3, 4, 5]));

    arrA = [1123, 212, 173, 43574, 35, 234, 89, 234];
    croppedArray = arrayCrop(arrA);

    expect(croppedArray).toEqual(new Uint8Array([212, 173, 43574, 35, 234, 89, 234]));
  });

  test('arrayExtend', () => {
    let arrA = [1, 2, 3, 4, 5];
    let extendedArray = arrayExtend(arrA);

    expect(extendedArray).toEqual(new Uint8Array([0, 1, 2, 3, 4, 5]));

    arrA = [1123, 212, 173, 43574, 35, 234, 89, 234];
    extendedArray = arrayExtend(arrA);

    expect(extendedArray).toEqual(new Uint8Array([0, 99, 212, 173, 54, 35, 234, 89, 234]));
  });
});
