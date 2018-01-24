import workerPool from 'workerpool';
import { isValidHash } from './utils';
import { hexToUint8 } from '../utils/uint';

export const spinUpWorkers = async ({
  scriptPath,
  functionName,
  functionArgs,
  threads = null,
  errorMessage,
}) => {
  const pool = workerPool.pool(scriptPath, { minWorkers: 'max' });
  const workerCount = threads || workerPool.cpus - 1;
  const workers = [];

  for (let i = 0; i < workerCount; i += 1) {
    workers[i] = new Promise((resolve, reject) => {
      pool.exec(functionName, functionArgs).then((result) => {
        pool.terminate({ force: true });
        if (result) {
          resolve(result);
        }
        reject(new Error(errorMessage));
      });
    });
  }

  const result = await Promise.race(workers);
  return result;
};

export default async ({ hashHex, amountOfAttempts = 4096, threads = null }) => {
  if (!isValidHash(hashHex)) {
    throw new Error('Invalid: hash hex is not a valid hash');
  }
  const hash = hexToUint8(hashHex);

  return spinUpWorkers({
    scriptPath: `${__dirname}/powWorker.js`,
    functionName: 'doProofOfWork',
    functionArgs: [hash, amountOfAttempts],
    threads,
    errorMessage: 'Error: could not prove work, try increasing attempts',
  });
};
