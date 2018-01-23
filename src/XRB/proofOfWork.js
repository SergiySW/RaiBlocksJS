import workerPool from 'workerpool';
import { isValidHash } from './utils';
import { hexToUint8 } from '../utils/uint';

export default async ({ hashHex, amountOfAttempts = 4096 }) => {
  if (!isValidHash(hashHex)) {
    throw new Error('Invalid: hash hex is not a valid hash');
  }
  const pool = workerPool.pool(`${__dirname}/powWorker.js`, { minWorkers: 'max' });
  const hash = hexToUint8(hashHex);

  const workers = [];

  for (let i = 0; i < workerPool.cpus - 1; i += 1) {
    workers[i] = new Promise((resolve, reject) => {
      pool.exec('doProofOfWork', [hash, amountOfAttempts]).then((result) => {
        pool.terminate({ force: true });
        if (result) {
          resolve(result);
        }
        reject(new Error('Error: could not prove work, try increasing attempts'));
      });
    });
  }

  const result = await Promise.race(workers);
  return result;
};
