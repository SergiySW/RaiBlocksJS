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

Rai.prototype.ext_account_get = function (key) {
  return XRB.account_get(key);
};


// String output

Rai.prototype.ext_account_key = function (account) {
  return XRB.account_key(account);
};


// Boolean output

Rai.prototype.account_validate = function (account) {
  return XRB.account_validate(account);
};


Rai.prototype.pow_initiate = function (threads, worker_path = '') {
  return XRB.pow_initiate(threads, worker_path);
};


// hash input as Uint8Array

Rai.prototype.pow_start = function (workers, hash) {
  return XRB.pow_start(workers, hash);
};


Rai.prototype.pow_terminate = function (workersh) {
  return XRB.pow_terminate(workers);
};


// hash input as Uint8Array, callback as function

Rai.prototype.pow_callback = function (workers, hash, callback) {
  return XRB.pow_callback(workers, hash, callback);
};


// hash_hex input as text, callback as function

Rai.prototype.pow = function (hash_hex, threads, callback, worker_path) {
  return XRB.pow(hash_hex, threads, callback, worker_path);
};

// Boolean output

Rai.prototype.pow_validate = function (pow_hex, hash_hex) {
  return XRB.pow_validate(pow_hex, hash_hex);
};


// String output

Rai.prototype.seed_key = function (seed_hex, index) {
  return XRB.seed_key(seed_hex, index);
};

// Array output



Rai.prototype.publicFromPrivateKey = function (secretKey) {
  return XRB.publicFromPrivateKey(secretKey);
};


Rai.prototype.signBlock = function (blockHash, secretKey) {
  return XRB.signBlock(blockHash, secretKey);
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

