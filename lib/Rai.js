/*
* RaiBlocks JavaScript RPC requests and basic functions
* https://github.com/SergiySW/RaiBlocksJS
*
* Released under the BSD 3-Clause License
*
*
* RPC commands full list
* https://github.com/clemahieu/raiblocks/wiki/RPC-protocol
*
*
* set 'request' as string. Samples
* {"action":"block_count})
* '{"action":"block_count"}'
*
* set 'hostUrl' as string. Mask protocol://host:port. Default value is http://localhost:7076. Samples
* http://localhost:7076
* https://raiwallet.info:7077
*
* set 'async' as boolean. Default value is false
* Note: Now only sync requests are available. Async for future developments
*
* Request sample
* var rai = new Rai();
* var block_count = rai.rpc({"action":"block_count"}), 'http://localhost:7076', fals);
*
*/

import fetch from 'node-fetch';
import getUnit from './utils/getUnit';

export default class Rai {
  constructor(hostUrl) {
    this.hostUrl = hostUrl || 'http://localhost:7076';
  }

  async rpc(body) {
    const response = await fetch(this.hostUrl, { method: 'POST', body });

    if (response.status !== 200) {
      console.error('XHR Failure');
    }

    return response.json();
  }

  // Object output
  account_balance(account) {
    const account_balance = this.rpc({ action: 'account_balance', account });
    return account_balance;
  };


  // String output
  account_block_count() {
    const account_block_count = this.rpc({ action: 'account_block_count', account });
    return account_block_count.block_count;
  };


  account_create(wallet, work = true) {
    const account_create = this.rpc({ action: 'account_create', wallet, work });
    return account_create.account;
  };


  account_info(account, unit = 'raw', representative = false, weight = false, pending = false) {
    const account_info = this.rpc({
      action: 'account_info', account, representative, weight, pending,
    });
    if (unit != 'raw') {
      account_info.balance = getUnit(account_info.balance, 'raw', unit);
      if (weight)		account_info.weight = getUnit(account_info.weight, 'raw', unit);
      if (pending)		account_info.pending = getUnit(account_info.pending, 'raw', unit);
    }
    return account_info;
  };


  account_history(account, count = '4096') {
    const account_history = this.rpc({ action: 'account_history', account, count });
    return account_history.history;
  };


  account_get(key) {
    const account_get = this.rpc({ action: 'account_get', key });
    return account_get.account;
  };


  account_key(account) {
    const account_key = this.rpc({ action: 'account_key', account });
    return account_key.key;
  };


  account_list(wallet) {
    const account_list = this.rpc({ action: 'account_list', wallet });
    return account_list.accounts;
  };


  // accounts is array
  account_move(wallet, source, accounts) {
    const account_move = this.rpc({
      action: 'account_move', wallet, source, accounts,
    });
    return account_move.moved;
  };


  account_remove(wallet, account) {
    const account_remove = this.rpc({ action: 'account_remove', wallet, account });
    return account_remove.removed;
  };


  account_representative(account) {
    const account_representative = this.rpc({ action: 'account_representative', account });
    return account_representative.representative;
  };


  account_representative_set(wallet, account, representative, work = '0000000000000000') {
    const account_representative_set = this.rpc({
      action: 'account_representative_set', wallet, account, representative, work,
    });
    return account_representative_set.block;
  };


  // String output
  account_weight(account, unit = 'raw') {
    const rpc_account_weight = this.rpc({ action: 'account_weight', account });
    const account_weight = getUnit(rpc_account_weight.weight, 'raw', unit);
    return account_weight;
  };


  // Array input
  accounts_balances(accounts) {
    const accounts_balances = this.rpc({ action: 'accounts_balances', accounts });
    return accounts_balances.balances;
  };


  accounts_create(wallet, count = 1, work = true) {
    const accounts_create = this.rpc({
      action: 'accounts_create', wallet, count, work,
    });
    return accounts_create.accounts;
  };


  // Array input
  accounts_frontiers(accounts) {
    const accounts_frontiers = this.rpc({ action: 'accounts_frontiers', accounts });
    return accounts_frontiers.frontiers;
  };


  // Array input
  accounts_pending(accounts, count = '4096', threshold = 0, unit = 'raw', source = false) {
    if (threshold != 0)	threshold = getUnit(threshold, unit, 'raw');
    const accounts_pending = this.rpc({
      action: 'accounts_pending', accounts, count, threshold, source,
    });
    if (source) {
      for (const account in accounts_pending.blocks) {
        for (const hash in accounts_pending.blocks[account]) {
          accounts_pending.blocks[account][hash].amount = getUnit(accounts_pending.blocks[account][hash].amount, 'raw', unit);
        }
      }
    } else if (threshold != 0) {
      for (const account in accounts_pending.blocks) {
        for (const hash in accounts_pending.blocks[account]) {
          accounts_pending.blocks[account][hash] = getUnit(accounts_pending.blocks[account][hash], 'raw', unit);
        }
      }
    }
    return accounts_pending.blocks;
  };


  // String output
  available_supply(unit = 'raw') {
    const rpc_available_supply = this.rpc({ action: 'available_supply' });
    const available_supply = getUnit(rpc_available_supply.available, 'raw', unit);
    return available_supply;
  };


  block(hash) {
    const rpc_block = this.rpc({ action: 'block', hash });
    const block = JSON.parse(rpc_block.contents);
    return block;
  };


  // Array input
  blocks(hashes) {
    const rpc_blocks = this.rpc({ action: 'blocks', hashes });
    const blocks = rpc_blocks.blocks;
    for (const key in blocks) {
      blocks[key] = JSON.parse(blocks[key]);
    }
    return blocks;
  };


  // Array input
  blocks_info(hashes, unit = 'raw', pending = false, source = false) {
    const rpc_blocks_info = this.rpc({
      action: 'blocks_info', hashes, pending, source,
    });
    const blocks = rpc_blocks_info.blocks;
    for (const key in blocks) {
      blocks[key].contents = JSON.parse(blocks[key].contents);
      if (unit != 'raw')	blocks[key].amount = getUnit(blocks[key].amount, 'raw', unit);
    }
    return blocks;
  };


  block_account(hash) {
    const block_account = this.rpc({ action: 'block_account', hash });
    return block_account.account;
  };


  // Object output
  block_count() {
    const block_count = this.rpc({ action: 'block_count' });
    return block_count;
  };


  // Object output
  block_count_type() {
    const block_count_type = this.rpc({ action: 'block_count_type' });
    return block_count_type;
  };


  // Object input, object output
  /*	Sample block creation:
  var block_data = {};
  block_data.type = "open";
  block_data.key = "0000000000000000000000000000000000000000000000000000000000000001",
  block_data.account = xrb_3kdbxitaj7f6mrir6miiwtw4muhcc58e6tn5st6rfaxsdnb7gr4roudwn951";
  block_data.representative = "xrb_1hza3f7wiiqa7ig3jczyxj5yo86yegcmqk3criaz838j91sxcckpfhbhhra1";
  block_data.source = "19D3D919475DEED4696B5D13018151D1AF88B2BD3BCFF048B45031C1F36D1858";
  var block = rpc.block_create(block_data);		*/
  block_create(block_data) {
    block_data.action = 'block_create';
    const block_create = this.rpc(JSON.stringify(block_data));
    const block = JSON.parse(block_create.block);
    return block;
  };


  // Empty output
  bootstrap(address = '::ffff:138.201.94.249', port = '7075') {
    const bootstrap = this.rpc({ action: 'bootstrap', address, port });
    return bootstrap.success;
  };


  // Empty output
  bootstrap_any() {
    const bootstrap_any = this.rpc({ action: 'bootstrap_any' });
    return bootstrap_any.success;
  };


  chain(block, count = '4096') {
    const chain = this.rpc({ action: 'chain', block, count });
    return chain.blocks;
  };


  delegators(account, unit = 'raw') {
    const rpc_delegators = this.rpc({ action: 'delegators', account });
    const delegators = rpc_delegators.delegators;
    if (unit != 'raw')	for (const delegator in delegators)	delegators[delegator] = getUnit(delegators[delegator], 'raw', unit);
    return delegators;
  };


  // String output
  delegators_count(account) {
    const delegators_count = this.rpc({ action: 'delegators_count', account });
    return delegators_count.count;
  };


  // Object output
  deterministic_key(seed, index = 0) {
    const deterministic_key = this.rpc({ action: 'deterministic_key', seed, index });
    return deterministic_key;
  };


  frontiers(account = 'xrb_1111111111111111111111111111111111111111111111111117353trpda', count = '1048576') {
    const rpc_frontiers = this.rpc({ action: 'frontiers', account, count });
    return rpc_frontiers.frontiers;
  };


  // String output
  frontier_count() {
    const frontier_count = this.rpc({ action: 'frontier_count' });
    return frontier_count.count;
  };


  history(hash, count = '4096') {
    const rpc_history = this.rpc({ action: 'history', hash, count });
    return rpc_history.history;
  };


  // Use getUnit instead of this function
  // String input and output
  mrai_from_raw(amount) {
    const mrai_from_raw = this.rpc({ action: 'mrai_from_raw', amount });
    return mrai_from_raw.amount;
  };


  // Use getUnit instead of this function
  // String input and output
  mrai_to_raw(amount) {
    const mrai_to_raw = this.rpc({ action: 'mrai_to_raw', amount });
    return mrai_to_raw.amount;
  };


  // Use getUnit instead of this function
  // String input and output
  krai_from_raw(amount) {
    const krai_from_raw = this.rpc({ action: 'krai_from_raw', amount });
    return krai_from_raw.amount;
  };


  // Use getUnit instead of this function
  // String input and output
  krai_to_raw(amount) {
    const krai_to_raw = this.rpc({ action: 'krai_to_raw', amount });
    return krai_to_raw.amount;
  };


  // Use getUnit instead of this function
  // String input and output
  rai_from_raw(amount) {
    const rai_from_raw = this.rpc({ action: 'rai_from_raw', amount });
    return rai_from_raw.amount;
  };


  // Use getUnit instead of this function
  // String input and output
  rai_to_raw(amount) {
    const rai_to_raw = this.rpc({ action: 'rai_to_raw', amount });
    return rai_to_raw.amount;
  };


  keepalive(address = '::ffff:192.168.1.1', port = '7075') {
    const keepalive = this.rpc({ action: 'keepalive', address, port });
    return keepalive;
  };


  // Object output
  key_create() {
    const key_create = this.rpc({ action: 'key_create' });
    return key_create;
  };


  // Object output
  key_expand(key) {
    const key_expand = this.rpc({ action: 'key_expand', key });
    return key_expand;
  };

  ledger(account = 'xrb_1111111111111111111111111111111111111111111111111117353trpda', count = '1048576', representative = false, weight = false, pending = false, sorting = false) {
    const ledger = this.rpc({
      action: 'ledger', account, count, representative, weight, pending, sorting,
    });
    return ledger.accounts;
  };

  password_change(wallet, password) {
    const password_change = this.rpc({ action: 'password_change', wallet, password });
    return password_change.changed;
  };


  password_enter(wallet, password) {
    let rpc_password_enter;
    if (typeof password === 'undefined') rpc_password_enter = this.rpc({ action: 'password_enter', wallet, password: '' });
    else password_enter = this.rpc({ action: 'password_enter', wallet, password });
    return password_enter.valid;
  };


  password_valid(wallet) {
    const password_valid = this.rpc({ action: 'password_valid', wallet });
    return password_valid.valid;
  };


  payment_begin(wallet) {
    const payment_begin = this.rpc({ action: 'payment_begin', wallet });
    return payment_begin.account;
  };


  payment_init(wallet) {
    const payment_init = this.rpc({ action: 'payment_init', wallet });
    return payment_init.status;
  };


  payment_end(account, wallet) {
    const payment_end = this.rpc({ action: 'payment_end', account, wallet });
    return payment_end;
  };


  // String input
  payment_wait(account, amount, timeout) {
    const payment_wait = this.rpc({
      action: 'payment_wait', account, amount, timeout,
    });
    return payment_wait.status;
  };


  // block as Object
  process(block) {
    const process = this.rpc({ action: 'process', block });
    return process.hash;
  };


  peers() {
    const rpc_peers = this.rpc({ action: 'peers' });
    return rpc_peers.peers;
  };


  pending(account, count = '4096', threshold = 0, unit = 'raw', source = false) {
    if (threshold != 0)	threshold = getUnit(threshold, unit, 'raw');
    const pending = this.rpc({
      action: 'pending', account, count, threshold, source,
    });
    if (source) {
      for (const hash in pending.blocks) {
        pending.blocks[hash].amount = getUnit(pending.blocks[hash].amount, 'raw', unit);
      }
    } else if (threshold != 0) {
      for (const hash in pending.blocks) {
        pending.blocks[hash] = getUnit(pending.blocks[hash], 'raw', unit);
      }
    }
    return pending.blocks;
  };


  pending_exists(hash) {
    const pending_exists = this.rpc({ action: 'pending_exists', hash });
    return pending_exists.exists;
  };


  receive(wallet, account, block, work = '0000000000000000') {
    const receive = this.rpc({
      action: 'receive', wallet, account, block, work,
    });
    return receive.block;
  };


  receive_minimum(unit = 'raw') {
    const receive_minimum = this.rpc({ action: 'receive_minimum' });
    const amount = getUnit(receive_minimum.amount, 'raw', unit);
    return amount;
  };


  receive_minimum_set(amount, unit = 'raw') {
    const raw_amount = getUnit(amount, unit, 'raw');
    const receive_minimum_set = this.rpc({ action: 'receive_minimum_set', amount: raw_amount });
    return receive_minimum_set.success;
  };


  representatives(unit = 'raw', count = '1048576', sorting = false) {
    const rpc_representatives = this.rpc({ action: 'representatives', count, sorting });
    const representatives = rpc_representatives.representatives;
    if (unit != 'raw') {
      for (const represetative in representatives)	representatives[represetative] = getUnit(representatives[represetative], 'raw', unit);
    }
    return representatives;
  };


  republish(hash, count = 1024, sources = 2) {
    const republish = this.rpc({
      action: 'republish', hash, count, sources,
    });
    return republish.blocks;
  };


  search_pending(wallet) {
    const search_pending = this.rpc({ action: 'search_pending', wallet });
    return search_pending.started;
  };


  search_pending_all() {
    const search_pending_all = this.rpc({ action: 'search_pending_all' });
    return search_pending_all.success;
  };


  send(wallet, source, destination, amount, unit = 'raw', work = '0000000000000000') {
    const raw_amount = getUnit(amount, unit, 'raw');
    const send = this.rpc({
      action: 'send', wallet, source, destination, amount: raw_amount, work,
    });
    return send.block;
  };


  stop() {
    const stop = this.rpc({ action: 'stop' });
    return stop.success;
  };


  successors(block, count = '4096') {
    const successors = this.rpc({ action: 'successors', block, count });
    return successors.blocks;
  };


  unchecked(count = '4096') {
    const unchecked = this.rpc({ action: 'unchecked', count });
    const blocks = unchecked.blocks;
    for (const key in blocks) {
      blocks[key] = JSON.parse(blocks[key]);
    }
    return blocks;
  };


  // Empty output
  unchecked_clear() {
    const unchecked_clear = this.rpc({ action: 'unchecked_clear' });
    return unchecked_clear.success;
  };


  unchecked_get(hash) {
    const unchecked_get = this.rpc({ action: 'unchecked_get', hash });
    const block = JSON.parse(unchecked_get.contents);
    return block;
  };


  unchecked_keys(key = '0000000000000000000000000000000000000000000000000000000000000000', count = '4096') {
    const unchecked_keys = this.rpc({ action: 'unchecked_keys', key, count });
    const unchecked = unchecked_keys.unchecked;
    for (const key in unchecked) {
      unchecked[key].contents = JSON.parse(unchecked[key].contents);
    }
    return unchecked;
  };


  validate_account_number(account) {
    const validate_account_number = this.rpc({ action: 'validate_account_number', account });
    return validate_account_number.valid;
  };


  version() {
    const version = this.rpc({ action: 'version' });
    return version;
  };


  wallet_add(wallet, key, work = true) {
    const wallet_add = this.rpc({
      action: 'wallet_add', wallet, key, work,
    });
    return wallet_add.account;
  };


  // Object output
  wallet_balance_total(wallet, unit = 'raw') {
    const rpc_wallet_balance = this.rpc({ action: 'wallet_balance_total', wallet });
    const wallet_balance_total = { balance: getUnit(rpc_wallet_balance.balance, 'raw', unit), pending: getUnit(rpc_wallet_balance.pending, 'raw', unit) };
    return wallet_balance_total;
  };


  wallet_balances(wallet, unit = 'raw', threshold = 0) {
    if (threshold != 0)	threshold = getUnit(threshold, unit, 'raw');
    const wallet_balances = this.rpc({ action: 'wallet_balances', wallet, threshold });
    for (const account in wallet_balances.balances) {
      wallet_balances.balances[account].balance = getUnit(wallet_balances.balances[account].balance, 'raw', unit);
      wallet_balances.balances[account].pending = getUnit(wallet_balances.balances[account].pending, 'raw', unit);
    }
    return wallet_balances.balances;
  };


  // Empty output
  wallet_change_seed(wallet, seed) {
    const wallet_change_seed = this.rpc({ action: 'wallet_change_seed', wallet, seed });
    return wallet_change_seed.success;
  };


  wallet_contains(wallet, account) {
    const wallet_contains = this.rpc({ action: 'wallet_contains', wallet, account });
    return wallet_contains.exists;
  };


  wallet_create() {
    const wallet_create = this.rpc({ action: 'wallet_create' });
    return wallet_create.wallet;
  };


  wallet_destroy(wallet) {
    const wallet_destroy = this.rpc({ action: 'wallet_destroy', wallet });
    return wallet_destroy;
  };


  // Return as array or as JSON/Object?
  wallet_export(wallet) {
    const wallet_export = this.rpc({ action: 'wallet_export', wallet });
    return wallet_export.json;
  };


  wallet_frontiers(wallet) {
    const wallet_frontiers = this.rpc({ action: 'wallet_frontiers', wallet });
    return wallet_frontiers.frontiers;
  };


  wallet_locked(wallet) {
    const wallet_locked = this.rpc({ action: 'wallet_locked', wallet });
    return wallet_locked.locked;
  };


  wallet_pending(wallet, count = '4096', threshold = 0, unit = 'raw', source = false) {
    if (threshold != 0)	threshold = getUnit(threshold, unit, 'raw');
    const wallet_pending = this.rpc({
      action: 'wallet_pending', wallet, count, threshold, source,
    });
    if (source) {
      for (const account in wallet_pending.blocks) {
        for (const hash in wallet_pending.blocks[account]) {
          wallet_pending.blocks[account][hash].amount = getUnit(wallet_pending.blocks[account][hash].amount, 'raw', unit);
        }
      }
    } else if (threshold != 0) {
      for (const account in wallet_pending.blocks) {
        for (const hash in wallet_pending.blocks[account]) {
          wallet_pending.blocks[account][hash] = getUnit(wallet_pending.blocks[account][hash], 'raw', unit);
        }
      }
    }
    return wallet_pending.blocks;
  };


  wallet_representative(wallet) {
    const wallet_representative = this.rpc({ action: 'wallet_representative', wallet });
    return wallet_representative.representative;
  };


  wallet_representative_set(wallet, representative) {
    const wallet_representative_set = this.rpc({ action: 'wallet_representative_set', wallet, representative });
    return wallet_representative_set.set;
  };


  wallet_republish(wallet, count = 2) {
    const wallet_republish = this.rpc({ action: 'wallet_republish', wallet, count });
    return wallet_republish.blocks;
  };


  wallet_unlock(wallet, password) {
    const wallet_unlock = this.password_enter(wallet, password);
    return wallet_unlock;
  };


  wallet_work_get(wallet) {
    const wallet_work = this.rpc({ action: 'wallet_work_get', wallet });
    return wallet_work.works;
  };


  work_cancel(hash) {
    const work_cancel = this.rpc({ action: 'work_cancel', hash });
    return work_cancel;
  };


  work_generate(hash) {
    const work_generate = this.rpc({ action: 'work_generate', hash });
    return work_generate.work;
  };


  work_get(wallet, account) {
    const work_get = this.rpc({ action: 'work_get', wallet, account });
    return work_get.work;
  };


  work_set(wallet, account, work) {
    const work_set = this.rpc({
      action: 'work_set', wallet, account, work,
    });
    return work_set.success;
  };


  work_validate(work, hash) {
    const work_validate = this.rpc({ action: 'work_validate', work, hash });
    return work_validate.valid;
  };


  // Empty output
  work_peer_add(address = '::1', port = '7076') {
    const work_peer_add = this.rpc({ action: 'work_peer_add', address, port });
    return work_peer_add.success;
  };


  work_peers() {
    const rpc_work_peers = this.rpc({ action: 'work_peers' });
    return rpc_work_peers.work_peers;
  };


  // Empty output
  work_peers_clear() {
    const work_peers_clear = this.rpc({ action: 'work_peers_clear' });
    return work_peers_clear.success;
  };
}
