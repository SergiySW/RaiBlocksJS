/*
* RaiBlocks RPC basic functions in JavaScript
* https://github.com/SergiySW/RaiBlocksJS
*
* Released under the BSD 3-Clause License
*
*
* RPC commands full list
* https://github.com/clemahieu/raiblocks/wiki/RPC-protocol
*
*/


// Extended function, bignumber.js is required
Rai.prototype.unit = function(input, input_unit, output_unit) {
	
	var value = new BigNumber(input);
	
	// Step 1: to RAW
	switch(input_unit) {
		case 'raw': value = value; break;
		case 'Prai': value = value.shift(39); break; // draft
		case 'Trai': value = value.shift(36); break; // draft
		case 'Grai': value = value.shift(33); break;
		case 'Mrai': value = value.shift(30); break;
		case 'krai': value = value.shift(27); break;
		case 'rai': value = value.shift(24); break;
		case 'mrai': value = value.shift(21); break;
		case 'urai': value = value.shift(18); break;
		case 'prai': value = value.shift(15); break; // draft
		default: value = value;
	}
	
	// Step 2: to output
	switch(output_unit) {
		case 'raw': value = value; break;
		case 'Prai': value = value.shift(-39); break; // draft
		case 'Trai': value = value.shift(-36); break; // draft
		case 'Grai': value = value.shift(-33); break;
		case 'Mrai': value = value.shift(-30); break;
		case 'krai': value = value.shift(-27); break;
		case 'rai': value = value.shift(-24); break;
		case 'mrai': value = value.shift(-21); break;
		case 'urai': value = value.shift(-18); break;
		case 'prai': value = value.shift(-15); break; // draft
		default: value = value;
	}
	
	value = value.toFixed(0);
	return value;
}


// String output
Rai.prototype.account_balance = function(account, unit) {
	if (typeof unit == 'undefined') { unit = 'raw'; }
	var rpc_balance = this.rpc(JSON.stringify({"action":"account_balance","account":account}));
	var balance = this.unit(rpc_balance.balance, 'raw', unit);
	return balance;
}


Rai.prototype.account_create = function(wallet) {
	var rpc_account_create = this.rpc(JSON.stringify({"action":"account_create","wallet":wallet}));
	var account_create = rpc_account_create.account;
	return account_create;
}


Rai.prototype.account_list = function(wallet) {
	var rpc_account_list = this.rpc(JSON.stringify({"action":"account_list","wallet":wallet}));
	var account_list = rpc_account_list.accounts;
	return account_list;
}


// accounts is array
Rai.prototype.account_move = function(wallet, source, accounts) {
	var rpc_account_move = this.rpc(JSON.stringify({"action":"account_move","wallet":wallet,"source":source,"accounts":accounts}));
	var account_move = rpc_account_move.moved;
	return account_move;
}


// String output
Rai.prototype.account_weight = function(account, unit) {
	if (typeof unit == 'undefined') { unit = 'raw'; }
	var rpc_account_weight = this.rpc(JSON.stringify({"action":"account_weight","account":account}));
	var account_weight = this.unit(rpc_account_weight.weight, 'raw', unit);
	return account_weight;
}


// String output
Rai.prototype.available_supply = function(unit) {
	if (typeof unit == 'undefined') { unit = 'raw'; }
	var rpc_available_supply = this.rpc(JSON.stringify({"action":"available_supply"}));
	var available_supply = this.unit(rpc_available_supply.available, 'raw', unit);
	return available_supply;
}


Rai.prototype.block = function(hash) {
	var rpc_block = this.rpc(JSON.stringify({"action":"block","hash":hash}));
	var block = JSON.parse(rpc_block.contents);
	return block;
}


Rai.prototype.block_account = function(hash) {
	var rpc_block_account = this.rpc(JSON.stringify({"action":"block_account","hash":hash}));
	var block_account = rpc_block_account.account;
	return block_account;
}


// String output
Rai.prototype.block_count = function() {
	var rpc_block_count = this.rpc(JSON.stringify({"action":"block_count"}));
	var block_count = rpc_block_count.count;
	return block_count;
}


Rai.prototype.chain = function(block, count) {
	if (typeof count == 'undefined') count = '4096';
	var rpc_chain = this.rpc(JSON.stringify({"action":"chain","block":block,"count":count}));
	var chain = rpc_chain.blocks;
	return chain;
}


Rai.prototype.frontiers = function(account, count) {
	if (typeof account == 'undefined') account = 'xrb_1111111111111111111111111111111111111111111111111117353trpda'; // This must match all accounts existing
	if (typeof count == 'undefined') count = '1048576';
	var rpc_frontiers = this.rpc(JSON.stringify({"action":"frontiers","account":account,"count":count}));
	var frontiers = rpc_frontiers.frontiers;
	return frontiers;
}


// String output
Rai.prototype.frontier_count = function() {
	var rpc_frontier_count = this.rpc(JSON.stringify({"action":"frontier_count"}));
	var frontier_count = rpc_frontier_count.count;
	return frontier_count;
}


Rai.prototype.history = function(hash, count) {
	if (typeof count == 'undefined') count = '4096';
	var rpc_history = this.rpc(JSON.stringify({"action":"history","hash":hash,"count":count}));
	var history = rpc_history.history;
	return history;
}


// Use Rai.prototype.unit instead of this function
// String input and output
Rai.prototype.mrai_from_raw = function(amount) {
	var rpc_mrai_from_raw = this.rpc(JSON.stringify({"action":"mrai_from_raw","amount":amount}));
	var mrai_from_raw = rpc_mrai_from_raw.amount;
	return mrai_from_raw;
}


// Use Rai.prototype.unit instead of this function
// String input and output
Rai.prototype.mrai_to_raw = function(amount) {
	var rpc_mrai_to_raw = this.rpc(JSON.stringify({"action":"mrai_to_raw","amount":amount}));
	var mrai_to_raw = rpc_mrai_to_raw.amount;
	return mrai_to_raw;
}


// Use Rai.prototype.unit instead of this function
// String input and output
Rai.prototype.krai_from_raw = function(amount) {
	var rpc_krai_from_raw = this.rpc(JSON.stringify({"action":"krai_from_raw","amount":amount}));
	var krai_from_raw = rpc_krai_from_raw.amount;
	return krai_from_raw;
}


// Use Rai.prototype.unit instead of this function
// String input and output
Rai.prototype.krai_to_raw = function(amount) {
	var rpc_krai_to_raw = this.rpc(JSON.stringify({"action":"krai_to_raw","amount":amount}));
	var krai_to_raw = rpc_krai_to_raw.amount;
	return krai_to_raw;
}


// Use Rai.prototype.unit instead of this function
// String input and output
Rai.prototype.rai_from_raw = function(amount) {
	var rpc_rai_from_raw = this.rpc(JSON.stringify({"action":"rai_from_raw","amount":amount}));
	var rai_from_raw = rpc_rai_from_raw.amount;
	return rai_from_raw;
}


// Use Rai.prototype.unit instead of this function
// String input and output
Rai.prototype.rai_to_raw = function(amount) {
	var rpc_rai_to_raw = this.rpc(JSON.stringify({"action":"rai_to_raw","amount":amount}));
	var rai_to_raw = rpc_rai_to_raw.amount;
	return rai_to_raw;
}


Rai.prototype.keepalive = function(address, port) {
	if (typeof address == 'undefined') address = '::ffff:192.168.1.1';
	if (typeof port == 'undefined') port = '7075';
	var keepalive = this.rpc(JSON.stringify({"action":"keepalive","address":address,"port":port}));
	return keepalive;
}


Rai.prototype.password_change = function(wallet, password) {
	var rpc_password_change = this.rpc(JSON.stringify({"action":"password_change","wallet":wallet,"password":password}));
	var password_change = rpc_password_change.changed;
	return password_change;
}


Rai.prototype.password_enter = function(wallet, password) {
	var rpc_password_enter;
	if (typeof password == 'undefined') rpc_password_enter = this.rpc(JSON.stringify({"action":"password_enter","wallet":wallet,"password":""}));
	else rpc_password_enter = this.rpc(JSON.stringify({"action":"password_enter","wallet":wallet,"password":password}));
	var password_enter = rpc_password_enter.valid;
	return password_enter;
}


Rai.prototype.password_valid = function(wallet) {
	var rpc_password_valid = this.rpc(JSON.stringify({"action":"password_valid","wallet":wallet}));
	var password_valid = rpc_password_valid.valid;
	return password_valid;
}


Rai.prototype.payment_begin = function(wallet) {
	var rpc_payment_begin = this.rpc(JSON.stringify({"action":"payment_begin","wallet":wallet}));
	var payment_begin = rpc_payment_begin.account;
	return payment_begin;
}


Rai.prototype.payment_init = function(wallet) {
	var rpc_payment_init = this.rpc(JSON.stringify({"action":"payment_init","wallet":wallet}));
	var payment_init = rpc_payment_init.status;
	return payment_init;
}


Rai.prototype.payment_end = function(account, wallet) {
	var payment_end = this.rpc(JSON.stringify({"action":"payment_end","account":account,"wallet":wallet}));
	return payment_end;
}


// String input
Rai.prototype.payment_wait = function(account, amount, timeout) {
	var rpc_payment_wait = this.rpc(JSON.stringify({"action":"payment_wait","account":account,"amount":amount,"timeout":timeout}));
	var payment_wait = rpc_payment_wait.status;
	return payment_wait;
}


// block as Object
Rai.prototype.process = function(block) {
	var process = this.rpc(JSON.stringify({"action":"process","block":block}));
	return process;
}


Rai.prototype.peers = function() {
	var rpc_peers = this.rpc(JSON.stringify({"action":"peers"}));
	var peers = rpc_peers.peers;
	return peers;
}


// draft, returns amount?
Rai.prototype.representation = function(account) {
	var rpc_representation = this.rpc(JSON.stringify({"action":"representation","account":account}));
	var representation = rpc_representation.representation;
	return representation;
}


Rai.prototype.representative = function(account) {
	var rpc_representative = this.rpc(JSON.stringify({"action":"representative","account":account}));
	var representative = rpc_representative.representative;
	return representative;
}


Rai.prototype.search_pending = function(wallet) {
	var rpc_search_pending = this.rpc(JSON.stringify({"action":"search_pending","wallet":wallet}));
	var search_pending = rpc_search_pending.started;
	return search_pending;
}


Rai.prototype.send = function(wallet, source, destination, amount, unit) {
	if (typeof unit == 'undefined') { unit = 'raw'; }
	var raw_amount = this.unit(amount, unit, 'raw');
	var rpc_send = this.rpc(JSON.stringify({"action":"send","wallet":wallet,"source":source,"destination":destination,"amount":raw_amount}));
	var send = rpc_send.block;
	return send;
}


Rai.prototype.stop = function() {
	var stop = this.rpc(JSON.stringify({"action":"stop"}));
	return stop;
}

Rai.prototype.validate_account_number = function(account) {
	var rpc_validate_account_number = this.rpc(JSON.stringify({"action":"validate_account_number","account":account}));
	var validate_account_number = rpc_validate_account_number.valid;
	return validate_account_number;
}


Rai.prototype.version = function() {
	var version = this.rpc(JSON.stringify({"action":"version"}));
	return version;
}


Rai.prototype.wallet_add = function(wallet, key) {
	var rpc_wallet_add = this.rpc(JSON.stringify({"action":"wallet_add","wallet":wallet,"key":key}));
	var wallet_add = rpc_wallet_add.account;
	return wallet_add;
}


Rai.prototype.wallet_contains = function(wallet, account) {
	var rpc_wallet_contains = this.rpc(JSON.stringify({"action":"wallet_contains","wallet":wallet,"account":account}));
	var wallet_contains = rpc_wallet_contains.exists;
	return wallet_contains;
}


Rai.prototype.wallet_create = function() {
	var rpc_wallet_create = this.rpc(JSON.stringify({"action":"wallet_create"}));
	var wallet_create = rpc_wallet_create.wallet;
	return wallet_create;
}


Rai.prototype.wallet_destroy = function(wallet) {
	var wallet_destroy = this.rpc(JSON.stringify({"action":"wallet_destroy","wallet":wallet}));
	return wallet_destroy;
}


// Return as array or as JSON/Object?
Rai.prototype.wallet_export = function(wallet) {
	var rpc_wallet_export = this.rpc(JSON.stringify({"action":"wallet_export","wallet":wallet}));
	var wallet_export = rpc_wallet_export.json;
	return wallet_export;
}


Rai.prototype.wallet_representative = function(wallet) {
	var rpc_wallet_representative = this.rpc(JSON.stringify({"action":"wallet_representative","wallet":wallet}));
	var wallet_representative = rpc_wallet_representative.representative;
	return wallet_representative;
}


Rai.prototype.wallet_representative_set = function(wallet, representative) {
	var wallet_representative_set = this.rpc(JSON.stringify({"action":"wallet_representative_set","wallet":wallet,"representative":representative}));
	return wallet_representative_set;
}


Rai.prototype.work_cancel = function(hash) {
	var work_cancel = this.rpc(JSON.stringify({"action":"work_cancel","hash":hash}));
	return work_cancel;
}


Rai.prototype.work_generate = function(hash) {
	var rpc_work_generate = this.rpc(JSON.stringify({"action":"work_generate","hash":hash}));
	var work_generate = rpc_work_generate.work;
	return work_generate;
}
