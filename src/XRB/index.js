import BigNumber from 'bignumber.js';
import blake2b, { blake2bFinal, blake2bInit, blake2bUpdate } from 'blakejs';
import nacl from 'nacl';
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

import { areArraysEqual, arrayCrop, arrayExtend } from '../utils/arrays';

// Use for RAW
const minus = (base, _minus) => {
  let value = new BigNumber(base.toString());
  const bigMinus = new BigNumber(_minus.toString());
  if (bigMinus.greaterThan(value)) {
    throw new Error('Incorrect amount');
  }

  value = value.minus(bigMinus);
  value = value.toFixed(0);
  return value;
};

// Use for RAW
const plus = (base, _plus) => {
  let value = new BigNumber(base.toString());
  const bigPlus = new BigNumber(_plus.toString());
  value = value.plus(bigPlus);
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

const accountValidate = (account) => {
  const valid = accountKey(account);
  if (valid)	return true;
  return false;
};

const powInitiate = (threads, workerPath = '') => {
  if (isNaN(threads)) { threads = self.navigator.hardwareConcurrency - 1; }
  const workers = [];
  for (let i = 0; i < threads; i += 1) {
    workers[i] = new Worker(`${workerPath}rai.pow.js`);
  }
  return workers;
};

const powValidate = (powHex, hashHex) => {
  const isValidHash = /^[0123456789ABCDEF]+$/.test(hashHex);
  if (isValidHash && (hashHex.length == 64)) {
    const hash = hexToUint8(hashHex);
    const isValidPOW = /^[0123456789ABCDEFabcdef]+$/.test(powHex);
    if (isValidPOW && (powHex.length == 16)) {
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
  }

  throw new Error('Invalid hash');
};

const seedKey = (seedHex, index = 0) => {
  const isValidHash = /^[0123456789ABCDEF]+$/.test(seedHex);
  if (isValidHash && (seedHex.length == 64)) {
    const seed = hexToUint8(seedHex);
    if (Number.isInteger(index)) {
      const uint8 = intToUint8(index, 4);
      const context = blake2bInit(32, null);
      blake2bUpdate(context, seed);
      blake2bUpdate(context, uint8.reverse());
      const key = uint8ToHex(blake2bFinal(context));
      return key;
    }

    throw new Error('Invalid index');
  }

  throw new Error('Invalid seed');
};

const checkSignature = (hexMessage, hexSignature, publicKeyOrXRBAccount) => {
  if (!/[0-9A-F]{128}/i.test(hexSignature)) {
    throw new Error('Invalid signature. Needs to be a 64 byte hex encoded ed25519 signature.');
  }

  if (/[0-9A-F]{64}/i.test(publicKeyOrXRBAccount)) {
    // it's a 32 byte hex encoded key
    return nacl.sign.detached.verify(
      hexToUint8(hexMessage),
      hexToUint8(hexSignature),
      hexToUint8(publicKeyOrXRBAccount),
    );
  }

  const pubKey = accountKey(publicKeyOrXRBAccount);
  if (pubKey) {
    // it's a XRB account
    return nacl.sign.detached.verify(
      hexToUint8(hexMessage),
      hexToUint8(hexSignature),
      hexToUint8(pubKey),
    );
  }
  throw new Error('Invalid public key or XRB account.');
};

const keyAccount = privateKey => accountGet(publicFromPrivateKey(privateKey));

const signBlock = (blockHash, secretKey) => {
  if (!/[0-9A-F]{64}/i.test(secretKey)) {
    error = 'Invalid secret key. Should be a 32 byte hex string.';
    return false;
  }

  if (!/[0-9A-F]{64}/i.test(blockHash)) {
    error = 'Invalid block hash. Should be a 32 byte hex string.';
    return false;
  }

  return uint8ToHex(nacl.sign.detached(hexToUint8(blockHash), hexToUint8(secretKey)));
};

const publicFromPrivateKey = (secretKey) => {
  if (!/[0-9A-F]{64}/i.test(secretKey)) {
    error = 'Invalid secret key. Should be a 32 byte hex string.';
    return false;
  }

  return uint8ToHex(nacl.sign.keyPair.fromSecretKey(hexToUint8(secretKey)).publicKey);
};

const seedKeys = (seedHex, count = 1) => {
  const isValidHash = /^[0123456789ABCDEF]+$/.test(seedHex);
  if (isValidHash && (seedHex.length == 64)) {
    const seed = hexToUint8(seedHex);
    if (Number.isInteger(count)) {
      const keys = [];
      for (let index = 0; index < count; index += 1) {
        const uint8 = intToUint8(index, 4);
        const context = blake2bInit(32, null);
        blake2bUpdate(context, seed);
        blake2bUpdate(context, uint8.reverse());
        keys.push(uint8ToHex(blake2bFinal(context)));
      }
      return keys;
    }

    throw new Error('Invalid count');
  }

  throw new Error('Invalid seed');
};

const powTerminate = (workers) => {
  const threads = workers.length;
  for (let i = 0; i < threads; i += 1) {
    workers[i].terminate();
  }
};

const powCallback = (workers, hash, callback) => {
  if ((hash instanceof Uint8Array) && (hash.length == 32) && (typeof callback === 'function')) {
    const threads = workers.length;
    for (let i = 0; i < threads; i += 1) {
      workers[i].onmessage = (e) => {
        result = e.data;
        if (result) {
          powTerminate(workers);
          callback(result);
        } else workers[i].postMessage(hash);
      };
    }
  } else if (typeof callback !== 'function') {
    throw new Error('Invalid callback function');
  } else {
    throw new Error('Invalid hash array');
  }
};

const powStart = (workers, hash) => {
  if ((hash instanceof Uint8Array) && (hash.length == 32)) {
    const threads = workers.length;
    for (let i = 0; i < threads; i += 1) {
      workers[i].postMessage(hash);
    }
  } else {
    throw new Error('Invalid hash array');
  }
};

const pow = (hashHex, threads, callback, workerPath) => {
  const isValid = /^[0123456789ABCDEF]+$/.test(hashHex);
  if (isValid && (hashHex.length === 64)) {
    const hash = hexToUint8(hashHex);
    const workers = powInitiate(threads, workerPath);
    powStart(workers, hash);

    return powCallback(workers, hash, callback);
  }

  throw new Error('Invalid hash');
};

const accountKey = (account) => {
  if ((account.startsWith('xrb_1') || account.startsWith('xrb_3')) && (account.length === 64)) {
    const accountCrop = account.substring(4, 64);
    const isValid = /^[13456789abcdefghijkmnopqrstuwxyz]+$/.test(accountCrop);
    if (isValid) {
      const keyUint4 = arrayCrop(uint5ToUint4(stringToUint5(accountCrop.substring(0, 52))));
      const hashUint4 = uint5ToUint4(stringToUint5(accountCrop.substring(52, 60)));
      const keyArray = uint4ToUint8(keyUint4);
      const blakeHash = blake2b(keyArray, null, 5).reverse();
      if (areArraysEqual(hashUint4, uint8ToUint4(blakeHash))) {
        const key = uint4ToHex(keyUint4);
        return key;
      }

      throw new Error('Invalid account');
    }

    throw new Error('Invalid symbols');
  }

  throw new Error('Invalid account');
};

const accountGet = (key) => {
  const isValid = /^[0123456789ABCDEF]+$/.test(key);
  if (isValid && (key.length == 64)) {
    const keyArray = hexToUint8(key);
    const bytes = uint4ToUint5(arrayExtend(uint8ToUint4(keyArray)));
    const blakeHash = blake2b(keyArray, null, 5).reverse();
    const hashBytes = uint4ToUint5(uint8ToUint4(blakeHash));
    const account = `xrb_${uint5ToString(bytes)}${uint5ToString(hashBytes)}`;
    return account;
  }

  throw new Error('Invalid public key');
};

const computeBlockHash = (blockType, parameters) => {
  if ((typeof parameters.destination !== 'undefined') && (parameters.destination.startsWith('xrb_')))	parameters.destination = accountKey(parameters.destination);
  if ((typeof parameters.representative !== 'undefined') && (parameters.representative.startsWith('xrb_')))	parameters.representative = accountKey(parameters.representative);
  if ((typeof parameters.account !== 'undefined') && (parameters.account.startsWith('xrb_')))	parameters.account = accountKey(parameters.account);
  if ((typeof parameters.type !== 'undefined') && (blockType == null)) blockType = parameters.type;

  if (
    blockType === 'send' && (
      !/[0-9A-F]{64}/i.test(parameters.previous) ||
      !/[0-9A-F]{64}/i.test(parameters.destination) ||
      !/[0-9A-F]{32}/i.test(parameters.balance)
    ) || blockType === 'receive' && (
      !/[0-9A-F]{64}/i.test(parameters.previous) ||
      !/[0-9A-F]{64}/i.test(parameters.source)
    ) || blockType === 'open' && (
      !/[0-9A-F]{64}/i.test(parameters.source) ||
      !/[0-9A-F]{64}/i.test(parameters.representative) ||
      !/[0-9A-F]{64}/i.test(parameters.account)
    ) || blockType === 'change' && (
      !/[0-9A-F]{64}/i.test(parameters.previous) ||
      !/[0-9A-F]{64}/i.test(parameters.representative)
    )
  ) {
    throw new Error('Invalid parameters.');
  }

  let hash;

  switch (blockType) {
    case 'send':
      var context = blake2bInit(32, null);
      blake2bUpdate(context, hexToUint8(parameters.previous));
      blake2bUpdate(context, hexToUint8(parameters.destination));
      blake2bUpdate(context, hexToUint8(parameters.balance));
      hash = uint8ToHex(blake2bFinal(context));
      break;

    case 'receive':
      var context = blake2bInit(32, null);
      blake2bUpdate(context, hexToUint8(parameters.previous));
      blake2bUpdate(context, hexToUint8(parameters.source));
      hash = uint8ToHex(blake2bFinal(context));
      break;

    case 'open':
      var context = blake2bInit(32, null);
      blake2bUpdate(context, hexToUint8(parameters.source));
      blake2bUpdate(context, hexToUint8(parameters.representative));
      blake2bUpdate(context, hexToUint8(parameters.account));
      hash = uint8ToHex(blake2bFinal(context));
      break;

    case 'change':
      var context = blake2bInit(32, null);
      blake2bUpdate(context, hexToUint8(parameters.previous));
      blake2bUpdate(context, hexToUint8(parameters.representative));
      hash = uint8ToHex(blake2bFinal(context));
      break;

    default:
      throw new Error('Invalid block type.');
  }

  return hash;
};


const open = (privateKey, work, source, representative = 'xrb_16k5pimotz9zehjk795wa4qcx54mtusk8hc5mdsjgy57gnhbj3hj6zaib4ic') => {
  const block = {};
  block.type = 'open';
  block.source = source;
  block.representative = representative;
  block.account = keyAccount(privateKey);
  const hash = computeBlockHash(null, block);
  block.account = keyAccount(privateKey);
  block.work = work;
  block.signature = signBlock(hash, privateKey);
  return (block);
};

const receive = (privateKey, work, source, previous) => {
  const block = {};
  block.type = 'receive';
  block.source = source;
  block.previous = previous;
  const hash = computeBlockHash(null, block);
  block.work = work;
  block.signature = signBlock(hash, privateKey);
  return (block);
};

const change = (privateKey, work, previous, representative = 'xrb_16k5pimotz9zehjk795wa4qcx54mtusk8hc5mdsjgy57gnhbj3hj6zaib4ic') => {
  const block = {};
  block.type = 'change';
  block.previous = previous;
  block.representative = representative;
  const hash = computeBlockHash(null, block);
  block.representative = representative;
  block.work = work;
  block.signature = signBlock(hash, privateKey);
  return (block);
};

// new_balance in RAW
const send = (privateKey, work, previous, destination, oldBalance, amount, unit = 'raw') => {
  const block = {};
  block.type = 'send';
  block.previous = previous;
  block.destination = destination;
  const oldRaw = unit(oldBalance, unit, 'raw');
  const amountRaw = unit(amount, unit, 'raw');
  const balance = minus(oldRaw, amountRaw);
  block.balance = rawToHex(balance);
  const hash = computeBlockHash(null, block);
  block.destination = destination;
  block.work = work;
  block.signature = signBlock(hash, privateKey);
  return (block);
};

export default {
  plus,
  minus,
  rawToHex,
};
