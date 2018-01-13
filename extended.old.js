/* eslint-disable */

/*
* RaiBlocks extended functions in JavaScript
* https://github.com/SergiySW/RaiBlocksJS
*
* Released under the BSD 3-Clause License
*
*/


// Global variables: block_count, count, unchecked, frontier_count, frontiers, peers
var RaiBlocks = RaiBlocks || {};

Rai.prototype.initialize = function () {
  RaiBlocks.available_supply = this.available_supply();
  RaiBlocks.block_count = this.block_count();
  RaiBlocks.count = RaiBlocks.block_count.count;
  RaiBlocks.unchecked = RaiBlocks.block_count.unchecked;
  RaiBlocks.frontier_count = this.frontier_count();
  RaiBlocks.frontiers = this.frontiers();
  RaiBlocks.peers = this.peers();
};


// Extended function, jQuery is required
Rai.prototype.ext_account_history = function (account, count) {
  const rpc_request = this;

  if (typeof RaiBlocks.frontiers === 'undefined') this.initialize(); // if not initialized
  const hash = RaiBlocks.frontiers[account];

  if (typeof hash !== 'undefined') {
    var account_history = this.history(hash);
    const chain = this.chain(hash);

    // Retrieve change blocks
    $.each(chain, (key, value) => {
      if (account_history[key].hash !== value) {
        const block = rpc_request.block(value);
        if (block.type == 'change') {
          const insert = {
            account: block.representative, amount: 0, hash: value, type: block.type,
          };
          account_history.splice(key, 0, insert);
        }
      }
    });
  } else {
    console.log(`Empty account ${account}`);
  }

  return account_history;
};


// Extended function, jQuery is required
Rai.prototype.wallet_accounts_info = function (wallet, count) {
  const rpc_request = this;

  if (typeof RaiBlocks.frontiers === 'undefined') this.initialize(); // if not initialized

  const accounts_list = rpc_request.account_list(wallet);

  const wallet_accounts_info = []; // Accounts Array + balances
  $.each(accounts_list, function () {
    const account_balance = rai.account_balance(this);
    const balance = account_balance.balance;
    const pending = account_balance.pending;
    const history = rai.ext_account_history(this, count);
    wallet_accounts_info.push({
      key: this, raw_balance: balance, balance: rai.unit(balance, 'raw', 'rai'), raw_pending: pending, pending: rai.unit(pending, 'raw', 'rai'), history,
    });
  });

  return wallet_accounts_info;
};


Rai.prototype.rpc_version = function () {
  const rpc_version = this.version().rpc_version;
  return rpc_version;
};


Rai.prototype.store_version = function () {
  const store_version = this.version().store_version;
  return store_version;
};


Rai.prototype.node_vendor = function () {
  const node_vendor = this.version().node_vendor;
  return node_vendor;
};


// String output
Rai.prototype.balance = function (account, unit = 'raw') {
  const account_balance = this.account_balance(account);
  const balance = this.unit(account_balance.balance, 'raw', unit);
  return balance;
};


// String output
Rai.prototype.account_pending = function (account, unit = 'raw') {
  const account_balance = this.account_balance(account);
  const pending = this.unit(account_balance.pending, 'raw', unit);
  return pending;
};


// String output
Rai.prototype.count = function () {
  const count = this.block_count().count;
  return count;
};


// String output
Rai.prototype.unchecked_count = function () {
  const unchecked_count = this.block_count().unchecked;
  return unchecked_count;
};


// String output
Rai.prototype.wallet_balance = function (wallet, unit = 'raw') {
  const wallet_balance = this.wallet_balance_total(wallet, unit);
  return wallet_balance;
};


// String output
Rai.prototype.wallet_pending = function (wallet, unit = 'raw') {
  const wallet_pending = this.wallet_balance_total(wallet, unit);
  return wallet_pending;
};


// String output
XRB.account_get = function (key) {
  const isValid = /^[0123456789ABCDEF]+$/.test(key);
  if (isValid && (key.length == 64)) {
    const key_array = hex_uint8(key);
    const bytes = uint4_uint5(array_extend(uint8_uint4(key_array)));
    const blake_hash = blake2b(key_array, null, 5).reverse();
    const hash_bytes = uint4_uint5(uint8_uint4(blake_hash));
    const account = `xrb_${uint5_string(bytes)}${uint5_string(hash_bytes)}`;
    return account;
  }

  XRB.error('Invalid public key');
  return false;
};
Rai.prototype.ext_account_get = function (key) {
  return XRB.account_get(key);
};


// String output
XRB.account_key = function (account) {
  if ((account.startsWith('xrb_1') || account.startsWith('xrb_3')) && (account.length == 64)) {
    const account_crop = account.substring(4, 64);
    const isValid = /^[13456789abcdefghijkmnopqrstuwxyz]+$/.test(account_crop);
    if (isValid) {
      const key_uint4 = array_crop(uint5_uint4(string_uint5(account_crop.substring(0, 52))));
      const hash_uint4 = uint5_uint4(string_uint5(account_crop.substring(52, 60)));
      const key_array = uint4_uint8(key_uint4);
      const blake_hash = blake2b(key_array, null, 5).reverse();
      if (equal_arrays(hash_uint4, uint8_uint4(blake_hash))) {
        const key = uint4_hex(key_uint4);
        return key;
      }

      XRB.error('Invalid account');
      return false;
    }

    XRB.error('Invalid symbols');
    return false;
  }

  XRB.error('Invalid account');
  return false;
};
Rai.prototype.ext_account_key = function (account) {
  return XRB.account_key(account);
};


// Boolean output
XRB.account_validate = function (account) {
  const valid = XRB.account_key(account);
  if (valid)	return true;
  return false;
};
Rai.prototype.account_validate = function (account) {
  return XRB.account_validate(account);
};


function pow_threshold(Uint8Array) {
  if ((Uint8Array[0] == 255) && (Uint8Array[1] == 255) && (Uint8Array[2] == 255) && (Uint8Array[3] >= 192))	return true;
  return false;
}


XRB.pow_initiate = function (threads, worker_path = '') {
  if (isNaN(threads)) { threads = self.navigator.hardwareConcurrency - 1; }
  const workers = [];
  for (let i = 0; i < threads; i++) {
    workers[i] = new Worker(`${worker_path}rai.pow.js`);
  }
  return workers;
};
Rai.prototype.pow_initiate = function (threads, worker_path = '') {
  return XRB.pow_initiate(threads, worker_path);
};


// hash input as Uint8Array
XRB.pow_start = function (workers, hash) {
  if ((hash instanceof Uint8Array) && (hash.length == 32)) {
    const threads = workers.length;
    for (let i = 0; i < threads; i++) {
      workers[i].postMessage(hash);
    }
  } else	XRB.error('Invalid hash array');
};
Rai.prototype.pow_start = function (workers, hash) {
  return XRB.pow_start(workers, hash);
};


XRB.pow_terminate = function (workers) {
  const threads = workers.length;
  for (let i = 0; i < threads; i++) {
    workers[i].terminate();
  }
};
Rai.prototype.pow_terminate = function (workersh) {
  return XRB.pow_terminate(workers);
};


// hash input as Uint8Array, callback as function
XRB.pow_callback = function (workers, hash, callback) {
  if ((hash instanceof Uint8Array) && (hash.length == 32) && (typeof callback === 'function')) {
    const threads = workers.length;
    for (let i = 0; i < threads; i++) {
      workers[i].onmessage = function (e) {
        result = e.data;
        if (result) {
          XRB.pow_terminate(workers);
          callback(result);
        } else workers[i].postMessage(hash);
      };
    }
  } else if (typeof callback !== 'function')	XRB.error('Invalid callback function');
  else	XRB.error('Invalid hash array');
};
Rai.prototype.pow_callback = function (workers, hash, callback) {
  return XRB.pow_callback(workers, hash, callback);
};


// hash_hex input as text, callback as function
XRB.pow = function (hash_hex, threads, callback, worker_path) {
  const isValid = /^[0123456789ABCDEF]+$/.test(hash_hex);
  if (isValid && (hash_hex.length == 64)) {
    const hash = hex_uint8(hash_hex);
    const workers = XRB.pow_initiate(threads, worker_path);
    XRB.pow_start(workers, hash);
    XRB.pow_callback(workers, hash, callback);
  } else	XRB.error('Invalid hash');
};
Rai.prototype.pow = function (hash_hex, threads, callback, worker_path) {
  return XRB.pow(hash_hex, threads, callback, worker_path);
};

// Boolean output
XRB.pow_validate = function (pow_hex, hash_hex) {
  const isValidHash = /^[0123456789ABCDEF]+$/.test(hash_hex);
  if (isValidHash && (hash_hex.length == 64)) {
    const hash = hex_uint8(hash_hex);
    const isValidPOW = /^[0123456789ABCDEFabcdef]+$/.test(pow_hex);
    if (isValidPOW && (pow_hex.length == 16)) {
      const pow = hex_uint8(pow_hex);
      const context = blake2bInit(8, null);
      blake2bUpdate(context, pow.reverse());
      blake2bUpdate(context, hash);
      const check = blake2bFinal(context).reverse();
      if (pow_threshold(check))	return true;
      return false;
    }

    XRB.error('Invalid work');
    return false;
  }

  XRB.error('Invalid hash');
  return false;
};
Rai.prototype.pow_validate = function (pow_hex, hash_hex) {
  return XRB.pow_validate(pow_hex, hash_hex);
};


// String output
XRB.seed_key = function (seed_hex, index = 0) {
  const isValidHash = /^[0123456789ABCDEF]+$/.test(seed_hex);
  if (isValidHash && (seed_hex.length == 64)) {
    const seed = hex_uint8(seed_hex);
    if (Number.isInteger(index)) {
      const uint8 = int_uint8(index, 4);
      const context = blake2bInit(32, null);
      blake2bUpdate(context, seed);
      blake2bUpdate(context, uint8.reverse());
      const key = uint8_hex(blake2bFinal(context));
      return key;
    }

    XRB.error('Invalid index');
    return false;
  }

  XRB.error('Invalid seed');
  return false;
};
Rai.prototype.seed_key = function (seed_hex, index) {
  return XRB.seed_key(seed_hex, index);
};

// Array output
XRB.seed_keys = function (seed_hex, count = 1) {
  const isValidHash = /^[0123456789ABCDEF]+$/.test(seed_hex);
  if (isValidHash && (seed_hex.length == 64)) {
    const seed = hex_uint8(seed_hex);
    if (Number.isInteger(count)) {
      const keys = [];
      for (let index = 0; index < count; index++) {
        const uint8 = int_uint8(index, 4);
        const context = blake2bInit(32, null);
        blake2bUpdate(context, seed);
        blake2bUpdate(context, uint8.reverse());
        keys.push(uint8_hex(blake2bFinal(context)));
      }
      return keys;
    }

    XRB.error('Invalid count');
    return false;
  }

  XRB.error('Invalid seed');
  return false;
};

XRB.publicFromPrivateKey = function (secretKey) {
  if (!/[0-9A-F]{64}/i.test(secretKey)) {
    XRB.error = 'Invalid secret key. Should be a 32 byte hex string.';
    return false;
  }

  return uint8_hex(nacl.sign.keyPair.fromSecretKey(hex_uint8(secretKey)).publicKey);
};
Rai.prototype.publicFromPrivateKey = function (secretKey) {
  return XRB.publicFromPrivateKey(secretKey);
};

XRB.key_account = function (private_key) {
  return XRB.account_get(XRB.publicFromPrivateKey(private_key));
};

XRB.signBlock = function (blockHash, secretKey) {
  if (!/[0-9A-F]{64}/i.test(secretKey)) {
    XRB.error = 'Invalid secret key. Should be a 32 byte hex string.';
    return false;
  }

  if (!/[0-9A-F]{64}/i.test(blockHash)) {
    XRB.error = 'Invalid block hash. Should be a 32 byte hex string.';
    return false;
  }

  return uint8_hex(nacl.sign.detached(hex_uint8(blockHash), hex_uint8(secretKey)));
};
Rai.prototype.signBlock = function (blockHash, secretKey) {
  return XRB.signBlock(blockHash, secretKey);
};

XRB.checkSignature = function (hexMessage, hexSignature, publicKeyOrXRBAccount) {
  if (!/[0-9A-F]{128}/i.test(signature)) {
    XRB.error = 'Invalid signature. Needs to be a 64 byte hex encoded ed25519 signature.';
    return false;
  }

  if (/[0-9A-F]{64}/i.test(publicKeyOrXRBAccount)) {
    // it's a 32 byte hex encoded key
    return nacl.sign.detached.verify(hex_uint8(hexMessage), hex_uint8(hexSignature), hex_uint8(publicKeyOrXRBAccount));
  }

  const pubKey = XRB.account_key(publicKeyOrXRBAccount);
  if (pubKey) {
    // it's a XRB account
    return nacl.sign.detached.verify(hex_uint8(hexMessage), hex_uint8(hexSignature), hex_uint8(pubKey));
  }
  XRB.error = 'Invalid public key or XRB account.';
  return false;
};
Rai.prototype.checkSignature = function (hexMessage, hexSignature, publicKeyOrXRBAccount) {
  return XRB.checkSignature(hexMessage, hexSignature, publicKeyOrXRBAccount);
};


/**
 * Computes the block hash given its type and the required parameters
 * Parameters should be hex encoded (block hashes, accounts (its public key) and balances)
 *
 * @param {string} blockType - send, receive, change and open
 * @param {object} parameters - {previous: "", destination: "", balance: ""}	 (send)
 *								{previous: "", source: ""}						 (receive)
 *								{previous: "", representative: "" } 			 (change)
 *								{source:   "", representative: "", account: "" } (open)
 * @returns {string} The block hash
 */
XRB.computeBlockHash = function (blockType, parameters) {
  if ((typeof parameters.destination !== 'undefined') && (parameters.destination.startsWith('xrb_')))	parameters.destination = XRB.account_key(parameters.destination);
  if ((typeof parameters.representative !== 'undefined') && (parameters.representative.startsWith('xrb_')))	parameters.representative = XRB.account_key(parameters.representative);
  if ((typeof parameters.account !== 'undefined') && (parameters.account.startsWith('xrb_')))	parameters.account = XRB.account_key(parameters.account);
  if ((typeof parameters.type !== 'undefined') && (blockType == null))	blockType = parameters.type;

  if (
    blockType == 'send' &&	(
      !/[0-9A-F]{64}/i.test(parameters.previous) ||
									!/[0-9A-F]{64}/i.test(parameters.destination) ||
									!/[0-9A-F]{32}/i.test(parameters.balance)
								  ) ||

		blockType == 'receive' && (
		  !/[0-9A-F]{64}/i.test(parameters.previous) ||
									!/[0-9A-F]{64}/i.test(parameters.source)
								  ) ||

		blockType == 'open' &&	(
		  !/[0-9A-F]{64}/i.test(parameters.source) ||
									!/[0-9A-F]{64}/i.test(parameters.representative) ||
									!/[0-9A-F]{64}/i.test(parameters.account)
								  ) ||

		blockType == 'change' && (
		  !/[0-9A-F]{64}/i.test(parameters.previous) ||
									!/[0-9A-F]{64}/i.test(parameters.representative)
								  )
  ) {
    XRB.error = 'Invalid parameters.';
    return false;
  }

  let hash;

  switch (blockType) {
    case 'send':
      var context = blake2bInit(32, null);
      blake2bUpdate(context, hex_uint8(parameters.previous));
      blake2bUpdate(context, hex_uint8(parameters.destination));
      blake2bUpdate(context, hex_uint8(parameters.balance));
      hash = uint8_hex(blake2bFinal(context));
      break;

    case 'receive':
      var context = blake2bInit(32, null);
      blake2bUpdate(context, hex_uint8(parameters.previous));
      blake2bUpdate(context, hex_uint8(parameters.source));
      hash = uint8_hex(blake2bFinal(context));
      break;

    case 'open':
      var context = blake2bInit(32, null);
      blake2bUpdate(context, hex_uint8(parameters.source));
      blake2bUpdate(context, hex_uint8(parameters.representative));
      blake2bUpdate(context, hex_uint8(parameters.account));
      hash = uint8_hex(blake2bFinal(context));
      break;

    case 'change':
      var context = blake2bInit(32, null);
      blake2bUpdate(context, hex_uint8(parameters.previous));
      blake2bUpdate(context, hex_uint8(parameters.representative));
      hash = uint8_hex(blake2bFinal(context));
      break;

    default:
      XRB.error = 'Invalid block type.';
      return false;
  }

  return hash;
};


XRB.open = function (private_key, work, source, representative = 'xrb_16k5pimotz9zehjk795wa4qcx54mtusk8hc5mdsjgy57gnhbj3hj6zaib4ic') {
  const block = {};
  block.type = 'open';
  block.source = source;
  block.representative = representative;
  block.account = XRB.key_account(private_key);
  const hash = XRB.computeBlockHash(null, block);
  block.account = XRB.key_account(private_key);
  block.work = work;
  block.signature = XRB.signBlock(hash, private_key);
  return (block);
};

XRB.receive = function (private_key, work, source, previous) {
  const block = {};
  block.type = 'receive';
  block.source = source;
  block.previous = previous;
  const hash = XRB.computeBlockHash(null, block);
  block.work = work;
  block.signature = XRB.signBlock(hash, private_key);
  return (block);
};

XRB.change = function (private_key, work, previous, representative = 'xrb_16k5pimotz9zehjk795wa4qcx54mtusk8hc5mdsjgy57gnhbj3hj6zaib4ic') {
  const block = {};
  block.type = 'change';
  block.previous = previous;
  block.representative = representative;
  const hash = XRB.computeBlockHash(null, block);
  block.representative = representative;
  block.work = work;
  block.signature = XRB.signBlock(hash, private_key);
  return (block);
};

// new_balance in RAW
XRB.send = function (private_key, work, previous, destination, old_balance, amount, unit = 'raw') {
  const block = {};
  block.type = 'send';
  block.previous = previous;
  block.destination = destination;
  const old_raw = XRB.unit(old_balance, unit, 'raw');
  const amount_raw = XRB.unit(amount, unit, 'raw');
  const balance = XRB.minus(old_raw, amount_raw);
  block.balance = XRB.raw_to_hex(balance);
  const hash = XRB.computeBlockHash(null, block);
  block.destination = destination;
  block.work = work;
  block.signature = XRB.signBlock(hash, private_key);
  return (block);
};
