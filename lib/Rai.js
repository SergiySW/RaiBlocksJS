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
  accountBalance(account) {
    return this.rpc({ action: 'account_balance', account });
  }


  // String output
  accountBlockCount(account) {
    const { blockCount } = this.rpc({ action: 'account_block_count', account });
    return blockCount;
  }


  accountCreate(wallet, work = true) {
    const { account } = this.rpc({ action: 'account_create', wallet, work });
    return account;
  }


  accountInfo(account, unit = 'raw', representative = false, weight = false, pending = false) {
    const accountInfo = this.rpc({
      action: 'account_info', account, representative, weight, pending,
    });

    if (unit !== 'raw') {
      accountInfo.balance = getUnit(accountInfo.balance, 'raw', unit);
      if (weight) accountInfo.weight = getUnit(accountInfo.weight, 'raw', unit);
      if (pending) accountInfo.pending = getUnit(accountInfo.pending, 'raw', unit);
    }

    return accountInfo;
  }


  accountHistory(account, count = '4096') {
    const { history } = this.rpc({ action: 'account_history', account, count });
    return history;
  }


  accountGet(key) {
    const { account } = this.rpc({ action: 'account_get', key });
    return account;
  }


  accountKey(account) {
    const { key } = this.rpc({ action: 'account_key', account });
    return key;
  }


  accountList(wallet) {
    const { accounts } = this.rpc({ action: 'account_list', wallet });
    return accounts;
  }


  // accounts is array
  accountMove(wallet, source, accounts) {
    const { moved } = this.rpc({
      action: 'account_move', wallet, source, accounts,
    });
    return moved;
  }


  accountRemove(wallet, account) {
    const { removed } = this.rpc({ action: 'account_remove', wallet, account });
    return removed;
  }


  accountRepresentative(account) {
    const { representative } = this.rpc({ action: 'account_representative', account });
    return representative;
  }


  accountRepresentativeSet(wallet, account, representative, work = '0000000000000000') {
    const { block } = this.rpc({
      action: 'account_representative_set', wallet, account, representative, work,
    });
    return block;
  }


  // String output
  accountWeight(account, unit = 'raw') {
    const { weight } = this.rpc({ action: 'account_weight', account });
    return getUnit(weight, 'raw', unit);
  }


  // Array input
  accountsBalances(accounts) {
    const { balances } = this.rpc({ action: 'accounts_balances', accounts });
    return balances;
  }


  accountsCreate(wallet, count = 1, work = true) {
    const { accounts } = this.rpc({
      action: 'accounts_create', wallet, count, work,
    });
    return accounts;
  }


  // Array input
  accountsFrontiers(accounts) {
    const { frontiers } = this.rpc({ action: 'accounts_frontiers', accounts });
    return frontiers;
  }

  // Array input
  accountsPending(accounts, count = '4096', _threshold = 0, unit = 'raw', source = false) {
    let threshold = _threshold;
    if (threshold !== 0)	{
      threshold = getUnit(threshold, unit, 'raw');
    }
    const { blocks } = this.rpc({
      action: 'accounts_pending', accounts, count, threshold, source,
    });

    if (source) {
      for (const account in blocks) {
        for (const hash in blocks[account]) {
          blocks[account][hash].amount = getUnit(blocks[account][hash].amount, 'raw', unit);
        }
      }
    } else if (threshold != 0) {
      for (const account in blocks) {
        for (const hash in blocks[account]) {
          blocks[account][hash] = getUnit(blocks[account][hash], 'raw', unit);
        }
      }
    }
    return blocks;
  }


  // String output
  availableSupply(unit = 'raw') {
    const { available } = this.rpc({ action: 'available_supply' });
    return getUnit(available, 'raw', unit);
  }


  block(hash) {
    const { contents } = this.rpc({ action: 'block', hash });
    return JSON.parse(contents);
  }


  // Array input
  blocks(hashes) {
    const { blocks } = this.rpc({ action: 'blocks', hashes });
    for (const key in blocks) {
      blocks[key] = JSON.parse(blocks[key]);
    }
    return blocks;
  }


  // Array input
  blocksInfo(hashes, unit = 'raw', pending = false, source = false) {
    const { blocks } = this.rpc({
      action: 'blocks_info', hashes, pending, source,
    });
    for (const key in blocks) {
      blocks[key].contents = JSON.parse(blocks[key].contents);
      if (unit != 'raw')	blocks[key].amount = getUnit(blocks[key].amount, 'raw', unit);
    }
    return blocks;
  }


  blockAccount(hash) {
    const { account } = this.rpc({ action: 'block_account', hash });
    return account;
  }


  // Object output
  blockCount() {
    return this.rpc({ action: 'block_count' });
  }


  // Object output
  blockCountType() {
    return this.rpc({ action: 'block_count_type' });
  }


  // Object input, object output
  /*  Sample block creation:
      const blockData = {};
      blockData.type = "open";
      blockData.key = "0000000000000000000000000000000000000000000000000000000000000001",
      blockData.account = xrb_3kdbxitaj7f6mrir6miiwtw4muhcc58e6tn5st6rfaxsdnb7gr4roudwn951";
      blockData.representative = "xrb_1hza3f7wiiqa7ig3jczyxj5yo86yegcmqk3criaz838j91sxcckpfhbhhra1";
      blockData.source = "19D3D919475DEED4696B5D13018151D1AF88B2BD3BCFF048B45031C1F36D1858";
      const block = rpc.blockCreate(blockData);
  */
  blockCreate(_blockData) {
    const blockData = _blockData;
    blockData.action = 'block_create';
    const createdBlock = this.rpc(JSON.stringify(blockData));
    return JSON.parse(createdBlock.block);
  }


  // Empty output
  bootstrap(address = '::ffff:138.201.94.249', port = '7075') {
    const { success } = this.rpc({ action: 'bootstrap', address, port });
    return success;
  }


  // Empty output
  bootstrapAny() {
    const { success } = this.rpc({ action: 'bootstrap_any' });
    return success;
  }


  chain(block, count = '4096') {
    const { blocks } = this.rpc({ action: 'chain', block, count });
    return blocks;
  }


  delegators(account, unit = 'raw') {
    const { delegators } = this.rpc({ action: 'delegators', account });
    if (unit !== 'raw')	{
      for (const delegator in delegators)	{
        delegators[delegator] = getUnit(delegators[delegator], 'raw', unit);
      }
    }
    return delegators;
  }


  // String output
  delegatorsCount(account) {
    const { count } = this.rpc({ action: 'delegators_count', account });
    return count;
  }


  // Object output
  deterministicKey(seed, index = 0) {
    return this.rpc({ action: 'deterministic_key', seed, index });
  }


  frontiers(account = 'xrb_1111111111111111111111111111111111111111111111111117353trpda', count = '1048576') {
    const { frontiers } = this.rpc({ action: 'frontiers', account, count });
    return frontiers;
  }


  // String output
  frontierCount() {
    const { count } = this.rpc({ action: 'frontier_count' });
    return count;
  }


  history(hash, count = '4096') {
    const { history } = this.rpc({ action: 'history', hash, count });
    return history;
  }


  // Use getUnit instead of this function
  // String input and output
  mraiFromRaw(_amount) {
    const { amount } = this.rpc({ action: 'mraiFromRaw', _amount });
    return amount;
  }


  // Use getUnit instead of this function
  // String input and output
  mraiToRaw(_amount) {
    const { amount } = this.rpc({ action: 'mraiToRaw', _amount });
    return amount;
  }


  // Use getUnit instead of this function
  // String input and output
  kraiFromRaw(_amount) {
    const { amount } = this.rpc({ action: 'kraiFromRaw', _amount });
    return amount;
  }


  // Use getUnit instead of this function
  // String input and output
  kraiToRaw(_amount) {
    const { amount } = this.rpc({ action: 'kraiToRaw', _amount });
    return amount;
  }


  // Use getUnit instead of this function
  // String input and output
  raiFromRaw(_amount) {
    const { amount } = this.rpc({ action: 'raiFromRaw', _amount });
    return amount;
  }


  // Use getUnit instead of this function
  // String input and output
  raiToRaw(_amount) {
    const { amount } = this.rpc({ action: 'raiToRaw', _amount });
    return amount;
  }


  keepAlive(address = '::ffff:192.168.1.1', port = '7075') {
    return this.rpc({ action: 'keepalive', address, port });
  }


  // Object output
  keyCreate() {
    return this.rpc({ action: 'key_create' });
  }


  // Object output
  keyExpand(key) {
    return this.rpc({ action: 'key_expand', key });
  }

  ledger({
    account = 'xrb_1111111111111111111111111111111111111111111111111117353trpda',
    count = '1048576',
    representative = false,
    weight = false,
    pending = false,
    sorting = false,
  }) {
    const { accounts } = this.rpc({
      action: 'ledger', account, count, representative, weight, pending, sorting,
    });

    return accounts;
  }

  passwordChange(wallet, password) {
    const { changed } = this.rpc({ action: 'password_change', wallet, password });
    return changed;
  }


  passwordEnter(wallet, password) {
    const { valid } = this.rpc({ action: 'password_enter', wallet, password });
    return valid;
  }


  passwordValid(wallet) {
    const { valid } = this.rpc({ action: 'password_valid', wallet });
    return valid;
  }


  paymentVegin(wallet) {
    const { account } = this.rpc({ action: 'payment_begin', wallet });
    return account;
  }


  paymentUnit(wallet) {
    const { status } = this.rpc({ action: 'payment_init', wallet });
    return status;
  }


  paymentEnd(account, wallet) {
    return this.rpc({ action: 'payment_end', account, wallet });
  }

  // String input
  paymentWait(account, amount, timeout) {
    const { status } = this.rpc({
      action: 'payment_wait', account, amount, timeout,
    });

    return status;
  }


  // block as Object
  process(block) {
    const { hash } = this.rpc({ action: 'process', block });
    return hash;
  }


  peers() {
    const { peers } = this.rpc({ action: 'peers' });
    return peers;
  }


  pending(account, count = '4096', _threshold = 0, unit = 'raw', source = false) {
    let threshold = _threshold;
    if (threshold !== 0) {
      threshold = getUnit(threshold, unit, 'raw');
    }

    const { blocks } = this.rpc({
      action: 'pending', account, count, threshold, source,
    });

    if (source) {
      for (const hash in pending.blocks) {
        blocks[hash].amount = getUnit(blocks[hash].amount, 'raw', unit);
      }
    } else if (threshold != 0) {
      for (const hash in blocks) {
        blocks[hash] = getUnit(blocks[hash], 'raw', unit);
      }
    }
    return blocks;
  }


  pendingExists(hash) {
    const { exists } = this.rpc({ action: 'pending_exists', hash });
    return exists;
  }


  receive(wallet, account, block, work = '0000000000000000') {
    const receive = this.rpc({
      action: 'receive', wallet, account, block, work,
    });
    return receive.block;
  }


  receiveMinimum(unit = 'raw') {
    const { amount } = this.rpc({ action: 'receive_minimum' });
    return getUnit(amount, 'raw', unit);
  }


  receiveMinimumSet(amount, unit = 'raw') {
    const rawAmount = getUnit(amount, unit, 'raw');
    const { success } = this.rpc({ action: 'receive_minimum_set', amount: rawAmount });
    return success;
  }


  representatives(unit = 'raw', count = '1048576', sorting = false) {
    const { representatives } = this.rpc({ action: 'representatives', count, sorting });
    if (unit !== 'raw') {
      for (const represetative in representatives) {
        representatives[represetative] = getUnit(representatives[represetative], 'raw', unit);
      }
    }
    return representatives;
  }


  republish(hash, count = 1024, sources = 2) {
    const republish = this.rpc({
      action: 'republish', hash, count, sources,
    });
    return republish.blocks;
  }


  searchPending(wallet) {
    const  { started } = this.rpc({ action: 'search_pending', wallet });
    return started;
  }


  searchPendingAll() {
    const { success } = this.rpc({ action: 'search_pending_all' });
    return success;
  }


  send(wallet, source, destination, amount, unit = 'raw', work = '0000000000000000') {
    const rawAmount = getUnit(amount, unit, 'raw');
    const { block } = this.rpc({
      action: 'send', wallet, source, destination, amount: rawAmount, work,
    });
    return block;
  }


  stop() {
    const { success } = this.rpc({ action: 'stop' });
    return success;
  }


  successors(block, count = '4096') {
    const { blocks } = this.rpc({ action: 'successors', block, count });
    return blocks;
  }


  unchecked(count = '4096') {
    const { blocks } = this.rpc({ action: 'unchecked', count });
    for (const key in blocks) {
      blocks[key] = JSON.parse(blocks[key]);
    }
    return blocks;
  }


  // Empty output
  uncheckedClear() {
    const { success } = this.rpc({ action: 'unchecked_clear' });
    return success;
  }


  uncheckedGet(hash) {
    const { contents } = this.rpc({ action: 'unchecked_get', hash });
    return JSON.parse(contents);
  }


  uncheckedKeys(key = '0000000000000000000000000000000000000000000000000000000000000000', count = '4096') {
    const { unchecked } = this.rpc({ action: 'unchecked_keys', key, count });
    for (const key in unchecked) {
      unchecked[key].contents = JSON.parse(unchecked[key].contents);
    }
    return unchecked;
  }


  validateAccountNumber(account) {
    const { valid } = this.rpc({ action: 'validate_account_number', account });
    return valid;
  }


  version() {
    const version = this.rpc({ action: 'version' });
    return version;
  }


  walletAdd(wallet, key, work = true) {
    const { account } = this.rpc({
      action: 'wallet_add', wallet, key, work,
    });
    return account;
  }


  // Object output
  walletBalanceTotal(wallet, unit = 'raw') {
    const { balance, pending } = this.rpc({ action: 'wallet_balance_total', wallet });
    return {
      balance: getUnit(balance, 'raw', unit),
      pending: getUnit(pending, 'raw', unit),
    };
  }


  walletBalances(wallet, unit = 'raw', _threshold = 0) {
    let threshold = _threshold;
    if (threshold !== 0)	{
      threshold = getUnit(threshold, unit, 'raw');
    }

    const { balances } = this.rpc({ action: 'wallet_balances', wallet, threshold });

    for (const account in balances) {
      balances[account].balance = getUnit(balances[account].balance, 'raw', unit);
      balances[account].pending = getUnit(balances[account].pending, 'raw', unit);
    }
    return balances;
  }


  // Empty output
  walletChangeSeed(wallet, seed) {
    const { success } = this.rpc({ action: 'wallet_change_seed', wallet, seed });
    return success;
  }


  walletContains(wallet, account) {
    const { exists } = this.rpc({ action: 'wallet_contains', wallet, account });
    return exists;
  }


  walletCreate() {
    const { wallet } = this.rpc({ action: 'wallet_create' });
    return wallet;
  }


  walletDestroy(wallet) {
    return this.rpc({ action: 'wallet_destroy', wallet });
  }


  // Return as array or as JSON/Object?
  walletExport(wallet) {
    const { json } = this.rpc({ action: 'wallet_export', wallet });
    return json;
  }


  walletFrontiers(wallet) {
    const { frontiers } = this.rpc({ action: 'wallet_frontiers', wallet });
    return frontiers;
  }


  walletLocked(wallet) {
    const { locked } = this.rpc({ action: 'wallet_locked', wallet });
    return locked;
  }


  walletPending(wallet, count = '4096', _threshold = 0, unit = 'raw', source = false) {
    let threshold = _threshold;
    if (threshold !== 0) {
      threshold = getUnit(threshold, unit, 'raw');
    }
    const { blocks } = this.rpc({
      action: 'wallet_pending', wallet, count, threshold, source,
    });

    if (source) {
      for (const account in blocks) {
        for (const hash in blocks[account]) {
          blocks[account][hash].amount = getUnit(blocks[account][hash].amount, 'raw', unit);
        }
      }
    } else if (threshold != 0) {
      for (const account in blocks) {
        for (const hash in blocks[account]) {
          blocks[account][hash] = getUnit(blocks[account][hash], 'raw', unit);
        }
      }
    }
    return blocks;
  }


  walletRepresentative(wallet) {
    const { representative } = this.rpc({ action: 'wallet_representative', wallet });
    return representative;
  }


  walletRepresentativeSet(wallet, representative) {
    const { set } = this.rpc({ action: 'wallet_representative_set', wallet, representative });
    return set;
  }


  walletRepublish(wallet, count = 2) {
    const { blocks } = this.rpc({ action: 'wallet_republish', wallet, count });
    return blocks;
  }


  walletUnlock(wallet, password) {
    return this.password_enter(wallet, password);
  }


  walletWorkGet(wallet) {
    const { works } = this.rpc({ action: 'wallet_work_get', wallet });
    return works;
  }


  workCancel(hash) {
    return this.rpc({ action: 'work_cancel', hash });
  }


  workGenerate(hash) {
    const { work } = this.rpc({ action: 'work_generate', hash });
    return work;
  }


  workGet(wallet, account) {
    const { work } = this.rpc({ action: 'work_get', wallet, account });
    return work;
  }


  workSet(wallet, account, work) {
    const { success } = this.rpc({
      action: 'work_set', wallet, account, work,
    });
    return success;
  }


  workValidate(work, hash) {
    const { valid } = this.rpc({ action: 'work_validate', work, hash });
    return valid;
  }


  // Empty output
  workPeerAdd(address = '::1', port = '7076') {
    const { success } = this.rpc({ action: 'work_peer_add', address, port });
    return success;
  }


  workPeers() {
    const { work_peers: workPeers } = this.rpc({ action: 'work_peers' });
    return workPeers;
  }


  // Empty output
  workPeersClear() {
    const { success } = this.rpc({ action: 'work_peers_clear' });
    return success;
  }
}
