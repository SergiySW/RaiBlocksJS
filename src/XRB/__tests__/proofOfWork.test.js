/**
 * @jest-environment node
 */

import runPowWorkers from '../proofOfWork';

beforeAll(() => {
  jest.setTimeout(20000);
});

describe('proofOfWork', () => {
  describe('runPowWorkers', () => {
    test('throws if hashHex is invalid', async () => {
      expect.assertions(1);
      try {
        await runPowWorkers({ hashHex: 'A24D797912DB9996' });
      } catch (err) {
        expect(err.message).toContain('hash hex is not a valid hash');
      }
    });

    test('run workers with amountOfAttempts set to 1', async () => {
      try {
        await runPowWorkers({
          hashHex: 'CB69CCAF7B573DA26158DFC815F04C2830A85D402553D25D06558CE7657C1337',
          amountOfAttempts: 1,
        });
      } catch (err) {
        expect(err.message).toContain('Error: could not prove work, try increasing attempts');
      }
    });

    test('run workers with default 4096 attempts', async () => {
      try {
        await runPowWorkers({
          hashHex: 'CB69CCAF7B573DA26158DFC815F04C2830A85D402553D25D06558CE7657C1337',
        });
      } catch (err) {
        expect(err.message).toContain('Error: could not prove work, try increasing attempts');
      }
    });
  });
});

