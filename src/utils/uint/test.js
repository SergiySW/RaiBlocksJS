import {
  uint8ToUint4,
  uint4ToUint8,
  uint4ToUint5,
  uint5ToUint4,
  uint5ToString,
  stringToUint5,
  uint4ToHex,
  uint8ToHex,
  hexToUint8,
  intToUint8,
} from './';

describe('uint methods', () => {
  test('uint8ToUint4', () => {
    let uint8 = new Uint8Array([1, 2, 3, 4, 5]);
    let uint4 = uint8ToUint4(uint8);
    expect(uint4).toEqual(new Uint8Array([0, 1, 0, 2, 0, 3, 0, 4, 0, 5]));

    uint8 = new Uint8Array([16, 32, 64, 32, 5]);
    uint4 = uint8ToUint4(uint8);
    expect(uint4).toEqual(new Uint8Array([1, 0, 2, 0, 4, 0, 2, 0, 0, 5]));
  });

  test('uint4ToUint8', () => {
    let uint4 = new Uint8Array([0, 1, 0, 2, 0, 3, 0, 4, 0, 5]);
    let uint8 = uint4ToUint8(uint4);
    expect(uint8).toEqual(new Uint8Array([1, 2, 3, 4, 5]));

    uint4 = new Uint8Array([1, 0, 2, 0, 4, 0, 2, 0, 0, 5]);
    uint8 = uint4ToUint8(uint4);
    expect(uint8).toEqual(new Uint8Array([16, 32, 64, 32, 5]));
  });

  test('uint4ToUint5', () => {
    let uint4 = new Uint8Array([0, 1, 0, 2, 0, 3, 0, 4, 0, 5]);
    let uint5 = uint4ToUint5(uint4);
    expect(uint5).toEqual(new Uint8Array([0, 4, 1, 0, 6, 1, 0, 5]));

    uint4 = new Uint8Array([1, 0, 2, 0, 4, 0, 2, 0, 0, 5]);
    uint5 = uint4ToUint5(uint4);
    expect(uint5).toEqual(new Uint8Array([2, 0, 16, 4, 0, 8, 0, 5]));
  });

  test('uint5ToUint4', () => {
    let uint5 = new Uint8Array([0, 4, 1, 0, 6, 1, 0, 5]);
    let uint4 = uint5ToUint4(uint5);
    expect(uint4).toEqual(new Uint8Array([0, 1, 0, 2, 0, 3, 0, 4, 0, 5]));

    uint5 = new Uint8Array([2, 0, 16, 4, 0, 8, 0, 5]);
    uint4 = uint5ToUint4(uint5);
    expect(uint4).toEqual(new Uint8Array([1, 0, 2, 0, 4, 0, 2, 0, 0, 5]));
  });

  test('uint5ToString', () => {
    let uint5 = new Uint8Array([0, 4, 1, 0, 6, 1, 0, 5]);
    let string = uint5ToString(uint5);
    expect(string).toEqual('16318317');

    uint5 = new Uint8Array([2, 0, 16, 4, 0, 8, 0, 5]);
    string = uint5ToString(uint5);
    expect(string).toEqual('41i61a17');
  });

  test('stringToUint5', () => {
    let string = '16318317';
    let uint5 = stringToUint5(string);
    expect(uint5).toEqual(new Uint8Array([0, 4, 1, 0, 6, 1, 0, 5]));

    string = '41i61a17';
    uint5 = stringToUint5(string);
    expect(uint5).toEqual(new Uint8Array([2, 0, 16, 4, 0, 8, 0, 5]));
  });

  test('uint4ToHex', () => {
    let uint4 = new Uint8Array([1, 0, 2, 0, 4, 0, 2, 0, 0, 5]);
    let hex = uint4ToHex(uint4);
    expect(hex).toBe('1020402005');

    uint4 = new Uint8Array([0, 1, 0, 2, 0, 3, 0, 4, 0, 5]);
    hex = uint4ToHex(uint4);
    expect(hex).toBe('0102030405');
  });

  test('uint8ToHex', () => {
    let uint8 = new Uint8Array([1, 2, 3, 4, 5]);
    let hex = uint8ToHex(uint8);
    expect(hex).toBe('0102030405');

    uint8 = new Uint8Array([16, 32, 64, 32, 5]);
    hex = uint8ToHex(uint8);
    expect(hex).toBe('1020402005');
  });

  test('hexToUint8', () => {
    let hex = '0102030405';
    let uint8 = hexToUint8(hex);
    expect(uint8).toEqual(new Uint8Array([1, 2, 3, 4, 5]));

    hex = '1020402005';
    uint8 = hexToUint8(hex);
    expect(uint8).toEqual(new Uint8Array([16, 32, 64, 32, 5]));
  });

  test('intToUint8', () => {
    let int = 12345;
    let uint8 = intToUint8(int, 4);
    expect(uint8).toEqual(new Uint8Array([57, 48, 0, 0]));

    int = 12320012023123;
    uint8 = intToUint8(int, 4);
    expect(uint8).toEqual(new Uint8Array([83, 181, 240, 121]));
  });
});
