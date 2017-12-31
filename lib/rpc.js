import getUnit from './utils/getUnit';

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
*	JSON.stringify({"action":"block_count"})
*	'{"action":"block_count"}'
*
* set 'url_base' as string. Mask protocol://host:port. Default value is http://localhost:7076. Samples
*	http://localhost:7076
*	https://raiwallet.info:7077
*
* set 'async' as boolean. Default value is false
* Note: Now only sync requests are available. Async for future developments
*
* Request sample
*	var rai = new Rai();
*	var block_count = rai.rpc(JSON.stringify({"action":"block_count"}), 'http://localhost:7076', false);
*
*/

function Rai(url_base) {
  this.error = function (error) {
    throw new Error(error);
  };


  this.rpc = function (request, async_callback) {
    try {
      var url = document.createElement('a');
      if (typeof url_base === 'undefined') { url.href = 'http://localhost'; } // if url is not set, use default to localhost
      else if (!url_base.startsWith('http')) { url.href = `http://${url_base.split('/').reverse()[0]}`; } // local files are not supported; default protocol = HTTP
      else { url.href = url_base; }

      if (url.port == '') { url.port = '7076'; } // default port 7076
    } catch (e) {
      if (e instanceof ReferenceError) {
        if (typeof url_base === 'undefined') { var url = 'http://localhost:7076'; } else { var url = url_base; }
      } else { console.error(e); }
    }

    try {
      // Asynchronous
      if (typeof async_callback === 'function') {
        let xhr;
        xhr = new XMLHttpRequest();
        xhr.onload = function (e) {
          if (xhr.readyState === 4 && xhr.status === 200) {
            const json = JSON.parse(xhr.responseText);
            // Errors as JSON
            const error = json.error;
            if (typeof error !== 'undefined') {
              this.error(error);
            }
            async_callback(json);
          } else {
            console.error('XHR Failure');
          }
        };

        xhr.onerror = function (e) {
          console.error(xhr.statusText);
        };

        xhr.open('POST', url, true);
        xhr.send(request);
      }

      // Synchronous
      else {
        let xhr;
        xhr = new XMLHttpRequest();
        xhr.open('POST', url, false);
        xhr.send(request);

        if (xhr.readyState == 4 && xhr.status == 200) {
          const json = JSON.parse(xhr.responseText);
          // Errors as JSON
          const error = json.error;
          if (typeof error !== 'undefined') {
            this.error(error);
            return false;
          }
          return json;
        }

        console.error('XHR Failure');
      }
    } catch (ex) {
      this.error(ex.message);
    }
  };


  this.unit = function (input, inputUnit, outputUnit) {
    return getUnit(input, inputUnit, outputUnit);
  };


  // Object output
  this.account_balance = function (account) {
    const account_balance = this.rpc(JSON.stringify({ action: 'account_balance', account }));
    return account_balance;
  };


  // String output
  this.account_block_count = function () {
    const account_block_count = this.rpc(JSON.stringify({ action: 'account_block_count', account }));
    return account_block_count.block_count;
  };


  this.account_create = function (wallet, work = true) {
    const account_create = this.rpc(JSON.stringify({ action: 'account_create', wallet, work }));
    return account_create.account;
  };


  this.account_info = function (account, unit = 'raw', representative = false, weight = false, pending = false) {
    const account_info = this.rpc(JSON.stringify({
      action: 'account_info', account, representative, weight, pending,
    }));
    if (unit != 'raw') {
      account_info.balance = this.unit(account_info.balance, 'raw', unit);
      if (weight)		account_info.weight = this.unit(account_info.weight, 'raw', unit);
      if (pending)		account_info.pending = this.unit(account_info.pending, 'raw', unit);
    }
    return account_info;
  };


  this.account_history = function (account, count = '4096') {
    const account_history = this.rpc(JSON.stringify({ action: 'account_history', account, count }));
    return account_history.history;
  };


  this.account_get = function (key) {
    const account_get = this.rpc(JSON.stringify({ action: 'account_get', key }));
    return account_get.account;
  };


  this.account_key = function (account) {
    const account_key = this.rpc(JSON.stringify({ action: 'account_key', account }));
    return account_key.key;
  };


  this.account_list = function (wallet) {
    const account_list = this.rpc(JSON.stringify({ action: 'account_list', wallet }));
    return account_list.accounts;
  };


  // accounts is array
  this.account_move = function (wallet, source, accounts) {
    const account_move = this.rpc(JSON.stringify({
      action: 'account_move', wallet, source, accounts,
    }));
    return account_move.moved;
  };


  this.account_remove = function (wallet, account) {
    const account_remove = this.rpc(JSON.stringify({ action: 'account_remove', wallet, account }));
    return account_remove.removed;
  };


  this.account_representative = function (account) {
    const account_representative = this.rpc(JSON.stringify({ action: 'account_representative', account }));
    return account_representative.representative;
  };


  this.account_representative_set = function (wallet, account, representative, work = '0000000000000000') {
    const account_representative_set = this.rpc(JSON.stringify({
      action: 'account_representative_set', wallet, account, representative, work,
    }));
    return account_representative_set.block;
  };


  // String output
  this.account_weight = function (account, unit = 'raw') {
    const rpc_account_weight = this.rpc(JSON.stringify({ action: 'account_weight', account }));
    const account_weight = this.unit(rpc_account_weight.weight, 'raw', unit);
    return account_weight;
  };


  // Array input
  this.accounts_balances = function (accounts) {
    const accounts_balances = this.rpc(JSON.stringify({ action: 'accounts_balances', accounts }));
    return accounts_balances.balances;
  };


  this.accounts_create = function (wallet, count = 1, work = true) {
    const accounts_create = this.rpc(JSON.stringify({
      action: 'accounts_create', wallet, count, work,
    }));
    return accounts_create.accounts;
  };


  // Array input
  this.accounts_frontiers = function (accounts) {
    const accounts_frontiers = this.rpc(JSON.stringify({ action: 'accounts_frontiers', accounts }));
    return accounts_frontiers.frontiers;
  };


  // Array input
  this.accounts_pending = function (accounts, count = '4096', threshold = 0, unit = 'raw', source = false) {
    if (threshold != 0)	threshold = this.unit(threshold, unit, 'raw');
    const accounts_pending = this.rpc(JSON.stringify({
      action: 'accounts_pending', accounts, count, threshold, source,
    }));
    if (source) {
      for (const account in accounts_pending.blocks) {
        for (const hash in accounts_pending.blocks[account]) {
          accounts_pending.blocks[account][hash].amount = this.unit(accounts_pending.blocks[account][hash].amount, 'raw', unit);
        }
      }
    } else if (threshold != 0) {
      for (const account in accounts_pending.blocks) {
        for (const hash in accounts_pending.blocks[account]) {
          accounts_pending.blocks[account][hash] = this.unit(accounts_pending.blocks[account][hash], 'raw', unit);
        }
      }
    }
    return accounts_pending.blocks;
  };


  // String output
  this.available_supply = function (unit = 'raw') {
    const rpc_available_supply = this.rpc(JSON.stringify({ action: 'available_supply' }));
    const available_supply = this.unit(rpc_available_supply.available, 'raw', unit);
    return available_supply;
  };


  this.block = function (hash) {
    const rpc_block = this.rpc(JSON.stringify({ action: 'block', hash }));
    const block = JSON.parse(rpc_block.contents);
    return block;
  };


  // Array input
  this.blocks = function (hashes) {
    const rpc_blocks = this.rpc(JSON.stringify({ action: 'blocks', hashes }));
    const blocks = rpc_blocks.blocks;
    for (const key in blocks) {
      blocks[key] = JSON.parse(blocks[key]);
    }
    return blocks;
  };


  // Array input
  this.blocks_info = function (hashes, unit = 'raw', pending = false, source = false) {
    const rpc_blocks_info = this.rpc(JSON.stringify({
      action: 'blocks_info', hashes, pending, source,
    }));
    const blocks = rpc_blocks_info.blocks;
    for (const key in blocks) {
      blocks[key].contents = JSON.parse(blocks[key].contents);
      if (unit != 'raw')	blocks[key].amount = this.unit(blocks[key].amount, 'raw', unit);
    }
    return blocks;
  };


  this.block_account = function (hash) {
    const block_account = this.rpc(JSON.stringify({ action: 'block_account', hash }));
    return block_account.account;
  };


  // Object output
  this.block_count = function () {
    const block_count = this.rpc(JSON.stringify({ action: 'block_count' }));
    return block_count;
  };


  // Object output
  this.block_count_type = function () {
    const block_count_type = this.rpc(JSON.stringify({ action: 'block_count_type' }));
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
  this.block_create = function (block_data) {
    block_data.action = 'block_create';
    const block_create = this.rpc(JSON.stringify(block_data));
    const block = JSON.parse(block_create.block);
    return block;
  };


  // Empty output
  this.bootstrap = function (address = '::ffff:138.201.94.249', port = '7075') {
    const bootstrap = this.rpc(JSON.stringify({ action: 'bootstrap', address, port }));
    return bootstrap.success;
  };


  // Empty output
  this.bootstrap_any = function () {
    const bootstrap_any = this.rpc(JSON.stringify({ action: 'bootstrap_any' }));
    return bootstrap_any.success;
  };


  this.chain = function (block, count = '4096') {
    const chain = this.rpc(JSON.stringify({ action: 'chain', block, count }));
    return chain.blocks;
  };


  this.delegators = function (account, unit = 'raw') {
    const rpc_delegators = this.rpc(JSON.stringify({ action: 'delegators', account }));
    const delegators = rpc_delegators.delegators;
    if (unit != 'raw')	for (const delegator in delegators)	delegators[delegator] = this.unit(delegators[delegator], 'raw', unit);
    return delegators;
  };


  // String output
  this.delegators_count = function (account) {
    const delegators_count = this.rpc(JSON.stringify({ action: 'delegators_count', account }));
    return delegators_count.count;
  };


  // Object output
  this.deterministic_key = function (seed, index = 0) {
    const deterministic_key = this.rpc(JSON.stringify({ action: 'deterministic_key', seed, index }));
    return deterministic_key;
  };


  this.frontiers = function (account = 'xrb_1111111111111111111111111111111111111111111111111117353trpda', count = '1048576') {
    const rpc_frontiers = this.rpc(JSON.stringify({ action: 'frontiers', account, count }));
    return rpc_frontiers.frontiers;
  };


  // String output
  this.frontier_count = function () {
    const frontier_count = this.rpc(JSON.stringify({ action: 'frontier_count' }));
    return frontier_count.count;
  };


  this.history = function (hash, count = '4096') {
    const rpc_history = this.rpc(JSON.stringify({ action: 'history', hash, count }));
    return rpc_history.history;
  };


  // Use this.unit instead of this function
  // String input and output
  this.mrai_from_raw = function (amount) {
    const mrai_from_raw = this.rpc(JSON.stringify({ action: 'mrai_from_raw', amount }));
    return mrai_from_raw.amount;
  };


  // Use this.unit instead of this function
  // String input and output
  this.mrai_to_raw = function (amount) {
    const mrai_to_raw = this.rpc(JSON.stringify({ action: 'mrai_to_raw', amount }));
    return mrai_to_raw.amount;
  };


  // Use this.unit instead of this function
  // String input and output
  this.krai_from_raw = function (amount) {
    const krai_from_raw = this.rpc(JSON.stringify({ action: 'krai_from_raw', amount }));
    return krai_from_raw.amount;
  };


  // Use this.unit instead of this function
  // String input and output
  this.krai_to_raw = function (amount) {
    const krai_to_raw = this.rpc(JSON.stringify({ action: 'krai_to_raw', amount }));
    return krai_to_raw.amount;
  };


  // Use this.unit instead of this function
  // String input and output
  this.rai_from_raw = function (amount) {
    const rai_from_raw = this.rpc(JSON.stringify({ action: 'rai_from_raw', amount }));
    return rai_from_raw.amount;
  };


  // Use this.unit instead of this function
  // String input and output
  this.rai_to_raw = function (amount) {
    const rai_to_raw = this.rpc(JSON.stringify({ action: 'rai_to_raw', amount }));
    return rai_to_raw.amount;
  };


  this.keepalive = function (address = '::ffff:192.168.1.1', port = '7075') {
    const keepalive = this.rpc(JSON.stringify({ action: 'keepalive', address, port }));
    return keepalive;
  };


  // Object output
  this.key_create = function () {
    const key_create = this.rpc(JSON.stringify({ action: 'key_create' }));
    return key_create;
  };


  // Object output
  this.key_expand = function (key) {
    const key_expand = this.rpc(JSON.stringify({ action: 'key_expand', key }));
    return key_expand;
  };

  this.ledger = function (account = 'xrb_1111111111111111111111111111111111111111111111111117353trpda', count = '1048576', representative = false, weight = false, pending = false, sorting = false) {
    const ledger = this.rpc(JSON.stringify({
      action: 'ledger', account, count, representative, weight, pending, sorting,
    }));
    return ledger.accounts;
  };

  this.password_change = function (wallet, password) {
    const password_change = this.rpc(JSON.stringify({ action: 'password_change', wallet, password }));
    return password_change.changed;
  };


  this.password_enter = function (wallet, password) {
    let rpc_password_enter;
    if (typeof password === 'undefined') rpc_password_enter = this.rpc(JSON.stringify({ action: 'password_enter', wallet, password: '' }));
    else password_enter = this.rpc(JSON.stringify({ action: 'password_enter', wallet, password }));
    return password_enter.valid;
  };


  this.password_valid = function (wallet) {
    const password_valid = this.rpc(JSON.stringify({ action: 'password_valid', wallet }));
    return password_valid.valid;
  };


  this.payment_begin = function (wallet) {
    const payment_begin = this.rpc(JSON.stringify({ action: 'payment_begin', wallet }));
    return payment_begin.account;
  };


  this.payment_init = function (wallet) {
    const payment_init = this.rpc(JSON.stringify({ action: 'payment_init', wallet }));
    return payment_init.status;
  };


  this.payment_end = function (account, wallet) {
    const payment_end = this.rpc(JSON.stringify({ action: 'payment_end', account, wallet }));
    return payment_end;
  };


  // String input
  this.payment_wait = function (account, amount, timeout) {
    const payment_wait = this.rpc(JSON.stringify({
      action: 'payment_wait', account, amount, timeout,
    }));
    return payment_wait.status;
  };


  // block as Object
  this.process = function (block) {
    const process = this.rpc(JSON.stringify({ action: 'process', block }));
    return process.hash;
  };


  this.peers = function () {
    const rpc_peers = this.rpc(JSON.stringify({ action: 'peers' }));
    return rpc_peers.peers;
  };


  this.pending = function (account, count = '4096', threshold = 0, unit = 'raw', source = false) {
    if (threshold != 0)	threshold = this.unit(threshold, unit, 'raw');
    const pending = this.rpc(JSON.stringify({
      action: 'pending', account, count, threshold, source,
    }));
    if (source) {
      for (const hash in pending.blocks) {
        pending.blocks[hash].amount = this.unit(pending.blocks[hash].amount, 'raw', unit);
      }
    } else if (threshold != 0) {
      for (const hash in pending.blocks) {
        pending.blocks[hash] = this.unit(pending.blocks[hash], 'raw', unit);
      }
    }
    return pending.blocks;
  };


  this.pending_exists = function (hash) {
    const pending_exists = this.rpc(JSON.stringify({ action: 'pending_exists', hash }));
    return pending_exists.exists;
  };


  this.receive = function (wallet, account, block, work = '0000000000000000') {
    const receive = this.rpc(JSON.stringify({
      action: 'receive', wallet, account, block, work,
    }));
    return receive.block;
  };


  this.receive_minimum = function (unit = 'raw') {
    const receive_minimum = this.rpc(JSON.stringify({ action: 'receive_minimum' }));
    const amount = this.unit(receive_minimum.amount, 'raw', unit);
    return amount;
  };


  this.receive_minimum_set = function (amount, unit = 'raw') {
    const raw_amount = this.unit(amount, unit, 'raw');
    const receive_minimum_set = this.rpc(JSON.stringify({ action: 'receive_minimum_set', amount: raw_amount }));
    return receive_minimum_set.success;
  };


  this.representatives = function (unit = 'raw', count = '1048576', sorting = false) {
    const rpc_representatives = this.rpc(JSON.stringify({ action: 'representatives', count, sorting }));
    const representatives = rpc_representatives.representatives;
    if (unit != 'raw') {
      for (const represetative in representatives)	representatives[represetative] = this.unit(representatives[represetative], 'raw', unit);
    }
    return representatives;
  };


  this.republish = function (hash, count = 1024, sources = 2) {
    const republish = this.rpc(JSON.stringify({
      action: 'republish', hash, count, sources,
    }));
    return republish.blocks;
  };


  this.search_pending = function (wallet) {
    const search_pending = this.rpc(JSON.stringify({ action: 'search_pending', wallet }));
    return search_pending.started;
  };


  this.search_pending_all = function () {
    const search_pending_all = this.rpc(JSON.stringify({ action: 'search_pending_all' }));
    return search_pending_all.success;
  };


  this.send = function (wallet, source, destination, amount, unit = 'raw', work = '0000000000000000') {
    const raw_amount = this.unit(amount, unit, 'raw');
    const send = this.rpc(JSON.stringify({
      action: 'send', wallet, source, destination, amount: raw_amount, work,
    }));
    return send.block;
  };


  this.stop = function () {
    const stop = this.rpc(JSON.stringify({ action: 'stop' }));
    return stop.success;
  };


  this.successors = function (block, count = '4096') {
    const successors = this.rpc(JSON.stringify({ action: 'successors', block, count }));
    return successors.blocks;
  };


  this.unchecked = function (count = '4096') {
    const unchecked = this.rpc(JSON.stringify({ action: 'unchecked', count }));
    const blocks = unchecked.blocks;
    for (const key in blocks) {
      blocks[key] = JSON.parse(blocks[key]);
    }
    return blocks;
  };


  // Empty output
  this.unchecked_clear = function () {
    const unchecked_clear = this.rpc(JSON.stringify({ action: 'unchecked_clear' }));
    return unchecked_clear.success;
  };


  this.unchecked_get = function (hash) {
    const unchecked_get = this.rpc(JSON.stringify({ action: 'unchecked_get', hash }));
    const block = JSON.parse(unchecked_get.contents);
    return block;
  };


  this.unchecked_keys = function (key = '0000000000000000000000000000000000000000000000000000000000000000', count = '4096') {
    const unchecked_keys = this.rpc(JSON.stringify({ action: 'unchecked_keys', key, count }));
    const unchecked = unchecked_keys.unchecked;
    for (const key in unchecked) {
      unchecked[key].contents = JSON.parse(unchecked[key].contents);
    }
    return unchecked;
  };


  this.validate_account_number = function (account) {
    const validate_account_number = this.rpc(JSON.stringify({ action: 'validate_account_number', account }));
    return validate_account_number.valid;
  };


  this.version = function () {
    const version = this.rpc(JSON.stringify({ action: 'version' }));
    return version;
  };


  this.wallet_add = function (wallet, key, work = true) {
    const wallet_add = this.rpc(JSON.stringify({
      action: 'wallet_add', wallet, key, work,
    }));
    return wallet_add.account;
  };


  // Object output
  this.wallet_balance_total = function (wallet, unit = 'raw') {
    const rpc_wallet_balance = this.rpc(JSON.stringify({ action: 'wallet_balance_total', wallet }));
    const wallet_balance_total = { balance: this.unit(rpc_wallet_balance.balance, 'raw', unit), pending: this.unit(rpc_wallet_balance.pending, 'raw', unit) };
    return wallet_balance_total;
  };


  this.wallet_balances = function (wallet, unit = 'raw', threshold = 0) {
    if (threshold != 0)	threshold = this.unit(threshold, unit, 'raw');
    const wallet_balances = this.rpc(JSON.stringify({ action: 'wallet_balances', wallet, threshold }));
    for (const account in wallet_balances.balances) {
      wallet_balances.balances[account].balance = this.unit(wallet_balances.balances[account].balance, 'raw', unit);
      wallet_balances.balances[account].pending = this.unit(wallet_balances.balances[account].pending, 'raw', unit);
    }
    return wallet_balances.balances;
  };


  // Empty output
  this.wallet_change_seed = function (wallet, seed) {
    const wallet_change_seed = this.rpc(JSON.stringify({ action: 'wallet_change_seed', wallet, seed }));
    return wallet_change_seed.success;
  };


  this.wallet_contains = function (wallet, account) {
    const wallet_contains = this.rpc(JSON.stringify({ action: 'wallet_contains', wallet, account }));
    return wallet_contains.exists;
  };


  this.wallet_create = function () {
    const wallet_create = this.rpc(JSON.stringify({ action: 'wallet_create' }));
    return wallet_create.wallet;
  };


  this.wallet_destroy = function (wallet) {
    const wallet_destroy = this.rpc(JSON.stringify({ action: 'wallet_destroy', wallet }));
    return wallet_destroy;
  };


  // Return as array or as JSON/Object?
  this.wallet_export = function (wallet) {
    const wallet_export = this.rpc(JSON.stringify({ action: 'wallet_export', wallet }));
    return wallet_export.json;
  };


  this.wallet_frontiers = function (wallet) {
    const wallet_frontiers = this.rpc(JSON.stringify({ action: 'wallet_frontiers', wallet }));
    return wallet_frontiers.frontiers;
  };


  this.wallet_locked = function (wallet) {
    const wallet_locked = this.rpc(JSON.stringify({ action: 'wallet_locked', wallet }));
    return wallet_locked.locked;
  };


  this.wallet_pending = function (wallet, count = '4096', threshold = 0, unit = 'raw', source = false) {
    if (threshold != 0)	threshold = this.unit(threshold, unit, 'raw');
    const wallet_pending = this.rpc(JSON.stringify({
      action: 'wallet_pending', wallet, count, threshold, source,
    }));
    if (source) {
      for (const account in wallet_pending.blocks) {
        for (const hash in wallet_pending.blocks[account]) {
          wallet_pending.blocks[account][hash].amount = this.unit(wallet_pending.blocks[account][hash].amount, 'raw', unit);
        }
      }
    } else if (threshold != 0) {
      for (const account in wallet_pending.blocks) {
        for (const hash in wallet_pending.blocks[account]) {
          wallet_pending.blocks[account][hash] = this.unit(wallet_pending.blocks[account][hash], 'raw', unit);
        }
      }
    }
    return wallet_pending.blocks;
  };


  this.wallet_representative = function (wallet) {
    const wallet_representative = this.rpc(JSON.stringify({ action: 'wallet_representative', wallet }));
    return wallet_representative.representative;
  };


  this.wallet_representative_set = function (wallet, representative) {
    const wallet_representative_set = this.rpc(JSON.stringify({ action: 'wallet_representative_set', wallet, representative }));
    return wallet_representative_set.set;
  };


  this.wallet_republish = function (wallet, count = 2) {
    const wallet_republish = this.rpc(JSON.stringify({ action: 'wallet_republish', wallet, count }));
    return wallet_republish.blocks;
  };


  this.wallet_unlock = function (wallet, password) {
    const wallet_unlock = this.password_enter(wallet, password);
    return wallet_unlock;
  };


  this.wallet_work_get = function (wallet) {
    const wallet_work = this.rpc(JSON.stringify({ action: 'wallet_work_get', wallet }));
    return wallet_work.works;
  };


  this.work_cancel = function (hash) {
    const work_cancel = this.rpc(JSON.stringify({ action: 'work_cancel', hash }));
    return work_cancel;
  };


  this.work_generate = function (hash) {
    const work_generate = this.rpc(JSON.stringify({ action: 'work_generate', hash }));
    return work_generate.work;
  };


  this.work_get = function (wallet, account) {
    const work_get = this.rpc(JSON.stringify({ action: 'work_get', wallet, account }));
    return work_get.work;
  };


  this.work_set = function (wallet, account, work) {
    const work_set = this.rpc(JSON.stringify({
      action: 'work_set', wallet, account, work,
    }));
    return work_set.success;
  };


  this.work_validate = function (work, hash) {
    const work_validate = this.rpc(JSON.stringify({ action: 'work_validate', work, hash }));
    return work_validate.valid;
  };


  // Empty output
  this.work_peer_add = function (address = '::1', port = '7076') {
    const work_peer_add = this.rpc(JSON.stringify({ action: 'work_peer_add', address, port }));
    return work_peer_add.success;
  };


  this.work_peers = function () {
    const rpc_work_peers = this.rpc(JSON.stringify({ action: 'work_peers' }));
    return rpc_work_peers.work_peers;
  };


  // Empty output
  this.work_peers_clear = function () {
    const work_peers_clear = this.rpc(JSON.stringify({ action: 'work_peers_clear' }));
    return work_peers_clear.success;
  };
}
