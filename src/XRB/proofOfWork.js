import { blake2bInit, blake2bUpdate, blake2bFinal } from 'blakejs';
import cpus from 'cpus';
import workerPool from 'workerpool';
import getRandomValues from 'get-random-values';
import { isValidHash } from './utils';
import { hexToUint8 } from '../utils/uint';

const isValidPOW = powHex => /^[0123456789ABCDEFabcdef]+$/.test(powHex) && powHex.length === 16;

const isValidHashArray = hash => hash instanceof Uint8Array && hash.length === 32;

const noop = () => {};

export const powThreshold = Uint8Array => (
  Uint8Array[0] === 255
  && Uint8Array[1] === 255
  && Uint8Array[2] === 255
  && Uint8Array[3] >= 192
);

function randomUint() {
  const array = new Uint8Array(8);
  getRandomValues(array);
  return array;
}

function generator256(hash) {
  const random = randomUint();
  for (let r = 0; r < 256; r += 1) {
    random[7] = (random[7] + r) % 256; // pseudo random part
    const context = blake2bInit(8, null);
    blake2bUpdate(context, random);
    blake2bUpdate(context, hash);
    const blakeRandom = blake2bFinal(context).reverse();
    const check = powThreshold(blakeRandom);
    if (check) return random.reverse();
  }
  return false;
}

const onmessage = function (ev) {
  for (let i = 0; i < 4096; i++) {
    const generate = generator256(ev.data);
    if (generate) {
      postMessage(generate); // Worker return
      break;
    }
  }
  postMessage(false);
};

// ------------------------------------------------------

const powInitiate = (_threads, workerPath = '') => {
  let threads = _threads;
  if (Number.isNaN(Number(threads))) {
    threads = cpus().length - 1;
  }
  const workers = [];
  for (let i = 0; i < threads; i += 1) {
    workers[i] = new Worker(`${workerPath}rai.pow.js`);
  }
  return workers;
};

export const powValidate = (powHex, hashHex) => {
  if (!isValidHash(hashHex)) {
    throw new Error('Invalid: hash hex is not a valid hash');
  }
  if (!isValidPOW(powHex)) throw new Error('Invalid work');

  const hash = hexToUint8(hashHex);
  const pow = hexToUint8(powHex);
  const context = blake2bInit(8, null);

  blake2bUpdate(context, pow.reverse());
  blake2bUpdate(context, hash);
  const check = blake2bFinal(context).reverse();

  if (powThreshold(check)) {
    return true;
  }
  return false;
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

export const powCallback = (workers, hash, callback = noop) => {
  if (!isValidHashArray(hash)) {
    throw new Error('Invalid hash array');
  }
  const threads = workers.length;
  for (let i = 0; i < threads; i += 1) {
    const worker = workers[i];
    worker.onmessage = onWorkerMessage(worker, workers, hash, callback);
  }
};

export const powStart = (workers, hash) => {
  if (!isValidHashArray(hash)) {
    throw new Error('Invalid hash array');
  }

  const threads = workers.length;
  for (let i = 0; i < threads; i += 1) {
    workers[i].postMessage(hash);
  }
};

export default (hashHex, threads, callback, workerPath) => {
  if (!isValidHash(hashHex)) {
    throw new Error('Invalid: hash hex is not a valid hash');
  }

  const hash = hexToUint8(hashHex);
  const workers = powInitiate(threads, workerPath);
  powStart(workers, hash);

  return powCallback(workers, hash, callback);
};
