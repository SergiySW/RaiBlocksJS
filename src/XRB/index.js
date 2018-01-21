import { blake2b, blake2bFinal, blake2bInit, blake2bUpdate } from 'blakejs';
import nacl from '../../node_modules/tweetnacl/nacl';
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
import { isValidAccount, isValidHash, subtract, rawToHex } from './utils';
import { convertToRaw } from '../utils/getConversion';
import { areArraysEqual, arrayCrop, arrayExtend } from '../utils/arrays';

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
  receive,
  seedKey,
  seedKeys,
  send,
};
