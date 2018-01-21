import { isValidHash } from './utils';

const powInitiate = (_threads, workerPath = '') => {
  if (!window || !window.Worker || !window.navigator) return false;
  let threads = _threads;
  if (Number.isNaN(Number(threads))) {
    threads = window.navigator.hardwareConcurrency - 1;
  }
  const workers = [];
  for (let i = 0; i < threads; i += 1) {
    workers[i] = new Worker(`${workerPath}rai.pow.js`);
  }
  return workers;
};

const powThreshold = (Uint8Array) => {
  if (
    (Uint8Array[0] === 255)
    && (Uint8Array[1] === 255)
    && (Uint8Array[2] === 255)
    && (Uint8Array[3] >= 192)
  ) {
    return true;
  }
  return false;
};

const powValidate = (powHex, hashHex) => {
  if (!isValidHash(hashHex)) {
    throw new Error('Invalid: hash hex is not a valid hash');
  }

  const hash = hexToUint8(hashHex);
  const isValidPOW = /^[0123456789ABCDEFabcdef]+$/.test(powHex);
  if (isValidPOW && (powHex.length === 16)) {
    const pow = hexToUint8(powHex);
    const context = blake2bInit(8, null);
    blake2bUpdate(context, pow.reverse());
    blake2bUpdate(context, hash);
    const check = blake2bFinal(context).reverse();

    if (powThreshold(check)) {
      return true;
    }

    return false;
  }

  throw new Error('Invalid work');
};

const powTerminate = (workers) => {
  const threads = workers.length;
  for (let i = 0; i < threads; i += 1) {
    workers[i].terminate();
  }
};

const onWorkerMessage = (worker, workers, hash, callback) => (e) => {
  const result = e.data;
  if (result) {
    powTerminate(workers);
    callback(result);
  } else worker.postMessage(hash);
};

const powCallback = (workers, hash, callback) => {
  if ((hash instanceof Uint8Array) && (hash.length === 32) && (typeof callback === 'function')) {
    const threads = workers.length;
    for (let i = 0; i < threads; i += 1) {
      const worker = workers[i];
      worker.onmessage = onWorkerMessage(worker, workers, hash, callback);
    }
  } else if (typeof callback !== 'function') {
    throw new Error('Invalid callback function');
  } else {
    throw new Error('Invalid hash array');
  }
};

const powStart = (workers, hash) => {
  if ((hash instanceof Uint8Array) && (hash.length === 32)) {
    const threads = workers.length;
    for (let i = 0; i < threads; i += 1) {
      workers[i].postMessage(hash);
    }
  } else {
    throw new Error('Invalid hash array');
  }
};

const pow = (hashHex, threads, callback, workerPath) => {
  if (!isValidHash(hashHex)) {
    throw new Error('Invalid hash');
  }

  const hash = hexToUint8(hashHex);
  const workers = powInitiate(threads, workerPath);
  powStart(workers, hash);

  return powCallback(workers, hash, callback);
};