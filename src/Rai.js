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
* set 'hostUrl' as string. Mask protocol://host:port. Default value is http://localhost:7076. Samples
* http://localhost:7076
* https://raiwallet.info:7077
*
* Request sample
* ---------------------------
* const rai = new Rai();
* const blockCount = rai.rpc('block_count'); // raw rpc action
* const blockCount = rai.blocks.count(); // convenience rpc method
*
*/

import axios from 'axios';
import getConversion from './utils/getConversion';
import methods from './lib';

export default class Rai {
  constructor(hostUrl) {
    this.hostUrl = hostUrl || 'http://localhost:7076';

    Object.keys(methods).forEach((method) => {
      this[method] = methods[method].call(this, this.rpc);
    });
  }

  rpc = async (action, data = {}) => {
    const body = Object.assign({}, { action }, data);
    const response = await axios.post(this.hostUrl, JSON.stringify(body));
    return response.data;
  };

  // String output
  availableSupply(unit = 'raw') {
    const { available } = this.rpc({ action: 'available_supply' });
    return getConversion(available, 'raw', unit);
  }


  keepAlive(address = '::ffff:192.168.1.1', port = '7075') {
    return this.rpc({ action: 'keepalive', address, port });
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


  peers() {
    const { peers } = this.rpc({ action: 'peers' });
    return peers;
  }


  pending(account, count = '4096', _threshold = 0, unit = 'raw', source = false) {
    let threshold = _threshold;
    if (threshold !== 0) {
      threshold = getConversion(threshold, unit, 'raw');
    }

    const { blocks } = this.rpc({
      action: 'pending', account, count, threshold, source,
    });

    if (source) {
      for (const hash in pending.blocks) {
        blocks[hash].amount = getConversion(blocks[hash].amount, 'raw', unit);
      }
    } else if (threshold != 0) {
      for (const hash in blocks) {
        blocks[hash] = getConversion(blocks[hash], 'raw', unit);
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
    return getConversion(amount, 'raw', unit);
  }


  receiveMinimumSet(amount, unit = 'raw') {
    const rawAmount = getConversion(amount, unit, 'raw');
    const { success } = this.rpc({ action: 'receive_minimum_set', amount: rawAmount });
    return success;
  }


  representatives(unit = 'raw', count = '1048576', sorting = false) {
    const { representatives } = this.rpc({ action: 'representatives', count, sorting });
    if (unit !== 'raw') {
      for (const represetative in representatives) {
        representatives[represetative] = getConversion(representatives[represetative], 'raw', unit);
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
    const rawAmount = getConversion(amount, unit, 'raw');
    const { block } = this.rpc({
      action: 'send', wallet, source, destination, amount: rawAmount, work,
    });
    return block;
  }


  stop() {
    const { success } = this.rpc({ action: 'stop' });
    return success;
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
