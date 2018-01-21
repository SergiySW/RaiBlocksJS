import BigNumber from 'bignumber.js';
import { blake2b, blake2bFinal, blake2bInit, blake2bUpdate } from 'blakejs';
import nacl from '../../vendor/nacl';
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
} from '../utils/uint';
import { convertToRaw } from '../utils/getConversion';
import { areArraysEqual, arrayCrop, arrayExtend } from '../utils/arrays';

export const isValidHash = (hash, bytes = 32) => {
  if (bytes === 16) return /[0-9A-F]{32}\b/i.test(hash) && hash.length === (bytes * 2);
  if (bytes === 32) return /[0-9A-F]{64}\b/i.test(hash) && hash.length === (bytes * 2);
  if (bytes === 64) return /[0-9A-F]{128}/i.test(hash) && hash.length === (bytes * 2);
  throw new Error(`Bytes must be 16, 32 or 64, ${bytes} supplied`);
};

export const isValidAccount = account =>
  (account.startsWith('xrb_1') || account.startsWith('xrb_3')) && account.length === 64;


// Use for RAW
const subtract = (base, minus) => {
  let value = new BigNumber(base.toString());
  const bigMinus = new BigNumber(minus.toString());
  if (bigMinus.greaterThan(value)) {
    throw new Error('Subtraction will result in negative value');
  }

  value = value.minus(bigMinus);
  value = value.toFixed(0);
  return value;
};

// Use for RAW
const rawToHex = (raw) => {
  let value = new BigNumber(raw.toString());
  value = value.toString(16).toUpperCase();
  if (value.length < 32) {
    for (let n = value.length; n < 32; n += 1) {
      value = `0${value}`;
    }
  }
  return value;
};

export const getAccountKey = (account) => {
  if (!isValidAccount(account)) {
    throw new Error('Invalid account');
  }

  const accountCrop = account.substring(4, 64);
  const isValid = /^[123456789abcdefghijkmnopqrstuwxyz]+$/.test(accountCrop);
  if (!isValid) throw new Error('Invalid account');

  const keyUint4 = arrayCrop(uint5ToUint4(stringToUint5(accountCrop.substring(0, 52))));
  const hashUint4 = uint5ToUint4(stringToUint5(accountCrop.substring(52, 60)));
  const keyArray = uint4ToUint8(keyUint4);
  const blakeHash = blake2b(keyArray, null, 5).reverse();

  if (areArraysEqual(hashUint4, uint8ToUint4(blakeHash))) {
    return uint4ToHex(keyUint4);
  }

  throw new Error('Invalid symbols');
};

export const getAccount = (key) => {
  if (!isValidHash(key)) {
    throw new Error('Invalid: Public key is not a valid hash');
  }

  const keyArray = hexToUint8(key);
  const bytes = uint4ToUint5(arrayExtend(uint8ToUint4(keyArray)));
  const blakeHash = blake2b(keyArray, null, 5).reverse();
  const hashBytes = uint4ToUint5(uint8ToUint4(blakeHash));
  const account = `xrb_${uint5ToString(bytes)}${uint5ToString(hashBytes)}`;
  return account;
};

export const seedKey = (seedHex, index = 0) => {
  if (!isValidHash(seedHex)) {
    throw new Error('Invalid: Seed is not a valid hash');
  }

  if (!Number.isInteger(index)) throw new Error('Invalid: index is not an integer');

  const seed = hexToUint8(seedHex);
  const uint8 = intToUint8(index, 4);
  const context = blake2bInit(32, null);
  blake2bUpdate(context, seed);
  blake2bUpdate(context, uint8.reverse());

  const key = uint8ToHex(blake2bFinal(context));
  return key;
};

export const checkSignature = (hexMessage, hexSignature, publicKeyOrXRBAccount) => {
  if (!isValidHash(hexSignature, 64)) {
    throw new Error('Invalid signature. Needs to be a 64 byte hex encoded ed25519 signature.');
  }

  // it's a 32 byte hex encoded key
  if (isValidHash(publicKeyOrXRBAccount)) {
    return nacl.sign.detached.verify(
      hexToUint8(hexMessage),
      hexToUint8(hexSignature),
      hexToUint8(publicKeyOrXRBAccount),
    );
  }

  // it's a XRB account
  const pubKey = getAccountKey(publicKeyOrXRBAccount);
  return nacl.sign.detached.verify(
    hexToUint8(hexMessage),
    hexToUint8(hexSignature),
    hexToUint8(pubKey),
  );
};

export const publicFromPrivateKey = (secretKey) => {
  if (!isValidHash(secretKey)) {
    throw new Error('Invalid secret key. Should be a 32 byte hex string.');
  }

  return uint8ToHex(nacl.sign.keyPair.fromSecretKey(hexToUint8(secretKey)).publicKey);
};

export const getAccountFromPrivateKey = privateKey => getAccount(publicFromPrivateKey(privateKey));

export const signBlock = (blockHash, secretKey) => {
  if (!/[0-9A-F]{64}/i.test(secretKey)) {
    throw new Error('Invalid secret key. Should be a 32 byte hex string.');
  }

  if (!/[0-9A-F]{64}/i.test(blockHash)) {
    throw new Error('Invalid block hash. Should be a 32 byte hex string.');
  }

  return uint8ToHex(nacl.sign.detached(hexToUint8(blockHash), hexToUint8(secretKey)));
};

export const seedKeys = (seedHex, count = 1) => {
  if (!isValidHash(seedHex)) {
    throw new Error('Invalid: Seed is not a valid hash');
  }

  if (!Number.isInteger(count)) {
    throw new Error('Invalid: count is not an integer');
  }

  const seed = hexToUint8(seedHex);

  const keys = [];
  for (let index = 0; index < count; index += 1) {
    const uint8 = intToUint8(index, 4);
    const context = blake2bInit(32, null);
    blake2bUpdate(context, seed);
    blake2bUpdate(context, uint8.reverse());
    keys.push(uint8ToHex(blake2bFinal(context)));
  }
  return keys;
};

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

/**
 * Computes the block hash given its type and the required parameters
 * Parameters should be hex encoded (block hashes, accounts (its public key) and balances)
 *
 * @param {string} blockType - send, receive, change and open
 * @param {object} parameters - {previous: "", destination: "", balance: ""} (send)
 *                {previous: "", source: ""} (receive)
 *                {previous: "", representative: "" } (change)
 *                {source:   "", representative: "", account: "" } (open)
 * @returns {string} The block hash
 */

export const computeBlockHash = (_blockType, _parameters) => {
  const parameters = _parameters;
  let blockType = _blockType;

  if (parameters.destination && isValidAccount(parameters.destination)) {
    parameters.destination = getAccountKey(parameters.destination);
  }
  if (parameters.representative && isValidAccount(parameters.representative)) {
    parameters.representative = getAccountKey(parameters.representative);
  }
  if (parameters.account && isValidAccount(parameters.account)) {
    parameters.account = getAccountKey(parameters.account);
  }
  if (parameters.type && blockType === null) {
    blockType = parameters.type;
  }

  if (blockType === 'send') {
    if (
      !isValidHash(parameters.previous)
      || !isValidHash(parameters.destination)
      || !isValidHash(parameters.balance, 16)
    ) {
      throw new Error('Invalid `send` parameters. Expected previous, destination and balance');
    }
  } else if (blockType === 'receive') {
    if (
      !isValidHash(parameters.previous)
      || !isValidHash(parameters.source)
    ) {
      throw new Error('Invalid `receive` parameters. Expected previous and source');
    }
  } else if (blockType === 'open') {
    if (
      !isValidHash(parameters.source)
      || !isValidHash(parameters.representative)
      || !isValidHash(parameters.account)
    ) {
      throw new Error('Invalid `open` parameters. Expected source, representative, and account');
    }
  } else if (blockType === 'change') {
    if (
      !isValidHash(parameters.previous)
      || !isValidHash(parameters.representative)
    ) {
      throw new Error('Invalid `change` parameters. Expected previous and representative');
    }
  }

  let hash;
  let context;
  switch (blockType) {
    case 'send':
      context = blake2bInit(32, null);
      blake2bUpdate(context, hexToUint8(parameters.previous));
      blake2bUpdate(context, hexToUint8(parameters.destination));
      blake2bUpdate(context, hexToUint8(parameters.balance));
      hash = uint8ToHex(blake2bFinal(context));
      break;

    case 'receive':
      context = blake2bInit(32, null);
      blake2bUpdate(context, hexToUint8(parameters.previous));
      blake2bUpdate(context, hexToUint8(parameters.source));
      hash = uint8ToHex(blake2bFinal(context));
      break;

    case 'open':
      context = blake2bInit(32, null);
      blake2bUpdate(context, hexToUint8(parameters.source));
      blake2bUpdate(context, hexToUint8(parameters.representative));
      blake2bUpdate(context, hexToUint8(parameters.account));
      hash = uint8ToHex(blake2bFinal(context));
      break;

    case 'change':
      context = blake2bInit(32, null);
      blake2bUpdate(context, hexToUint8(parameters.previous));
      blake2bUpdate(context, hexToUint8(parameters.representative));
      hash = uint8ToHex(blake2bFinal(context));
      break;

    default:
      throw new Error('Invalid block type.');
  }

  return hash;
};


export const open = ({
  privateKey,
  work,
  source,
  representative = 'xrb_16k5pimotz9zehjk795wa4qcx54mtusk8hc5mdsjgy57gnhbj3hj6zaib4ic',
}) => {
  const block = {
    type: 'open',
    source,
    representative,
    work,
  };

  block.account = getAccountFromPrivateKey(privateKey);
  const hash = computeBlockHash(null, block);
  block.signature = signBlock(hash, privateKey);
  return block;
};

export const receive = ({
  privateKey,
  work,
  source,
  previous,
}) => {
  const block = {
    type: 'receive',
    source,
    previous,
    work,
  };

  const hash = computeBlockHash(null, block);
  block.signature = signBlock(hash, privateKey);
  return block;
};

export const change = ({
  privateKey,
  work,
  previous,
  representative = 'xrb_16k5pimotz9zehjk795wa4qcx54mtusk8hc5mdsjgy57gnhbj3hj6zaib4ic',
}) => {
  const block = {
    type: 'change',
    work,
    previous,
    representative,
  };
  const hash = computeBlockHash(null, block);
  block.signature = signBlock(hash, privateKey);
  return (block);
};

// new_balance in RAW
export const send = ({
  privateKey,
  work,
  previous,
  destination,
  oldBalance,
  amount,
  unit = 'raw',
}) => {
  const block = {};
  block.type = 'send';
  block.previous = previous;
  block.destination = destination;
  block.work = work;

  const oldRaw = convertToRaw(oldBalance, unit);
  const amountRaw = convertToRaw(amount, unit);
  const balance = subtract(oldRaw, amountRaw);

  block.balance = rawToHex(balance);
  const hash = computeBlockHash(null, block);
  block.signature = signBlock(hash, privateKey);
  return block;
};

export default {
  change,
  checkSignature,
  open,
  pow,
  powValidate,
  receive,
  seedKey,
  seedKeys,
  send,
};
