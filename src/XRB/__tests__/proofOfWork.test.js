import pow, { powThreshold, powValidate, powStart, powCallback } from '../proofOfWork';

describe('proofOfWork', () => {
  describe('powThreshold', () => {
    test('powThreshold returns false', () => {
      const uint8 = new Uint8Array([255, 255, 255, 191]);
      expect(powThreshold(uint8)).toBeFalsy();
    });

    test('powThreshold returns true', () => {
      const uint8 = new Uint8Array([255, 255, 255, 192]);
      expect(powThreshold(uint8)).toBeTruthy();
    });
  });

  describe('powValidate', () => {
    test('throws if hashHex is invalid', () => {
      const testCase = () => powValidate('A24D797912DB9996', '12345');
      expect(testCase).toThrowError('Invalid: hash hex is not a valid hash');
    });

    test('throws if powHex is invalid', () => {
      const testCase = () => powValidate('12345', 'C008B814A7D269A1FA3C6528B19201A24D797912DB9996FF02A1FF356E45552B');
      expect(testCase).toThrowError('Invalid work');
    });

    test('returns false if check fails', () => {
      const isValid = powValidate('A24D797912DB9996', 'C008B814A7D269A1FA3C6528B19201A24D797912DB9996FF02A1FF356E45552B');
      expect(isValid).toBeFalsy();
    });
  });

  describe('pow', () => {
    test('throws if hashHex is invalid', () => {
      const testCase = () => pow('A24D797912DB9996');
      expect(testCase).toThrowError('Invalid: hash hex is not a valid hash');
    });
  });

  describe('powStart', () => {
    test('throws if hash is invalid', () => {
      const testCase = () => powStart('A24D797912DB9996');
      expect(testCase).toThrowError('Invalid hash array');
    });
  });

  describe('powCallback', () => {
    test('throws if hash is invalid', () => {
      const testCase = () => powCallback('A24D797912DB9996');
      expect(testCase).toThrowError('Invalid hash array');
    });
  });
});

