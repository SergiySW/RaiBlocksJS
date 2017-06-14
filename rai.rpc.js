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
*	https://skyhold.asuscomm.com:7077
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

this.error = function(error) {
	try { alert(error); }
	catch (e) { }
	console.error(error);
}


this.rpc = function(request, async_callback) {
	try {
		var url = document.createElement('a');
		if (typeof url_base == 'undefined') { url.href = 'http://localhost'; } // if url is not set, use default to localhost
		else if (!url_base.startsWith('http')) { url.href = 'http://' + url_base.split('/').reverse()[0]; } // local files are not supported; default protocol = HTTP
		else { url.href = url_base; }
			
		if (url.port== "") { url.port = '7076'; } // default port 7076
	} catch (e) {
		if (e instanceof ReferenceError) {
			if (typeof url_base == 'undefined') { var url = 'http://localhost:7076'; }
			else { var url = url_base; }
		}
		else { console.error(e); }
	}
	
	try {
		// Asynchronous
		if (typeof async_callback == 'function') {
			let xhr;
			xhr = new XMLHttpRequest();
			xhr.onload = function (e) {
				if (xhr.readyState === 4 && xhr.status === 200) {
					let json = JSON.parse(xhr.responseText);
					// Errors as JSON
					let error = json.error;
					if (typeof error != 'undefined') {
						this.error(error);
					}
					async_callback(json);
				}
				else {
					console.error('XHR Failure');
				}
			};
			
			xhr.onerror = function (e) {
				console.error(xhr.statusText);
			};
			
			xhr.open("POST", url, true);
			xhr.send(request);
		}
		
		// Synchronous
		else {
			let xhr;
			xhr = new XMLHttpRequest();
			xhr.open("POST", url, false);
			xhr.send(request);
			
			if (xhr.readyState == 4 && xhr.status == 200) {
				let json = JSON.parse(xhr.responseText);
				// Errors as JSON
				let error = json.error;
				if (typeof error != 'undefined') {
					this.error(error);
					return false;
				}
				return json;
			}
			else {
				console.error('XHR Failure');
			}
		}
	}
	catch (ex) {
		this.error(ex.message);
	}
}


// Extended function, bignumber.js is required
this.unit = function(input, input_unit, output_unit) {
	
	var value = new BigNumber(input.toString());
	
	// Step 1: to RAW
	switch(input_unit) {
		case 'raw': value = value; break;
		case 'Txrb': value = value.shift(36); break; // draft
		case 'Gxrb': value = value.shift(33); break;
		case 'Mxrb': value = value.shift(30); break;
		case 'kxrb': value = value.shift(27); break;
		case 'xrb': value = value.shift(24); break;
		case 'mxrb': value = value.shift(21); break;
		case 'uxrb': value = value.shift(18); break;
		case 'pxrb': value = value.shift(15); break; // draft
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
		case 'Txrb': value = value.shift(-36); break; // draft
		case 'Gxrb': value = value.shift(-33); break;
		case 'Mxrb': value = value.shift(-30); break;
		case 'kxrb': value = value.shift(-27); break;
		case 'xrb': value = value.shift(-24); break;
		case 'mxrb': value = value.shift(-21); break;
		case 'uxrb': value = value.shift(-18); break;
		case 'pxrb': value = value.shift(-15); break; // draft
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


// Object output
this.account_balance = function(account) {
	var account_balance = this.rpc(JSON.stringify({"action":"account_balance","account":account}));
	return account_balance;
}


// String output
this.account_block_count = function() {
	var rpc_account_block_count = this.rpc(JSON.stringify({"action":"account_block_count","account":account}));
	var account_block_count = rpc_account_block_count.block_count;
	return account_block_count;
}


this.account_create = function(wallet) {
	var rpc_account_create = this.rpc(JSON.stringify({"action":"account_create","wallet":wallet}));
	var account_create = rpc_account_create.account;
	return account_create;
}


this.account_get = function(key) {
	var rpc_account_get = this.rpc(JSON.stringify({"action":"account_get","key":key}));
	var account_get = rpc_account_get.account;
	return account_get;
}


this.account_key = function(account) {
	var rpc_account_key = this.rpc(JSON.stringify({"action":"account_key","account":account}));
	var account_key = rpc_account_key.key;
	return account_key;
}


this.account_list = function(wallet) {
	var rpc_account_list = this.rpc(JSON.stringify({"action":"account_list","wallet":wallet}));
	var account_list = rpc_account_list.accounts;
	return account_list;
}


// accounts is array
this.account_move = function(wallet, source, accounts) {
	var rpc_account_move = this.rpc(JSON.stringify({"action":"account_move","wallet":wallet,"source":source,"accounts":accounts}));
	var account_move = rpc_account_move.moved;
	return account_move;
}


this.account_remove = function(wallet, account) {
	var rpc_account_remove = this.rpc(JSON.stringify({"action":"account_remove","wallet":wallet,"account":account}));
	var account_remove = rpc_account_remove.removed;
	return account_remove;
}


this.account_representative = function(account) {
	var rpc_account_representative = this.rpc(JSON.stringify({"action":"account_representative","account":account}));
	var account_representative = rpc_account_representative.representative;
	return account_representative;
}


this.account_representative_set = function(wallet, account, representative) {
	var rpc_account_representative_set = this.rpc(JSON.stringify({"action":"account_representative_set","wallet":wallet,"account":account,"representative":representative}));
	var account_representative_set = rpc_account_representative_set.block;
	return account_representative_set;
}


// String output
this.account_weight = function(account, unit = 'raw') {
	var rpc_account_weight = this.rpc(JSON.stringify({"action":"account_weight","account":account}));
	var account_weight = this.unit(rpc_account_weight.weight, 'raw', unit);
	return account_weight;
}


// String output
this.available_supply = function(unit = 'raw') {
	var rpc_available_supply = this.rpc(JSON.stringify({"action":"available_supply"}));
	var available_supply = this.unit(rpc_available_supply.available, 'raw', unit);
	return available_supply;
}


this.block = function(hash) {
	var rpc_block = this.rpc(JSON.stringify({"action":"block","hash":hash}));
	var block = JSON.parse(rpc_block.contents);
	return block;
}


this.block_account = function(hash) {
	var rpc_block_account = this.rpc(JSON.stringify({"action":"block_account","hash":hash}));
	var block_account = rpc_block_account.account;
	return block_account;
}


// Object output
this.block_count = function() {
	var block_count = this.rpc(JSON.stringify({"action":"block_count"}));
	return block_count;
}


// Empty output
this.bootstrap = function(address = '::ffff:138.201.94.249', port = '7075') {
	var rpc_bootstrap = this.rpc(JSON.stringify({"action":"bootstrap", "address":address, "port":port}));
	var bootstrap = rpc_bootstrap.success;
	return bootstrap;
}


// Empty output
this.bootstrap_any = function() {
	var rpc_bootstrap_any = this.rpc(JSON.stringify({"action":"bootstrap_any"}));
	var bootstrap_any = rpc_bootstrap_any.success;
	return bootstrap_any;
}


this.chain = function(block, count = '4096') {
	var rpc_chain = this.rpc(JSON.stringify({"action":"chain","block":block,"count":count}));
	var chain = rpc_chain.blocks;
	return chain;
}


// Object output
this.deterministic_key = function(seed, index = 0) {
	var deterministic_key = this.rpc(JSON.stringify({"action":"deterministic_key","seed":seed, "index":index}));
	return deterministic_key;
}


this.frontiers = function(account = 'xrb_1111111111111111111111111111111111111111111111111117353trpda', count = '1048576') {
	var rpc_frontiers = this.rpc(JSON.stringify({"action":"frontiers","account":account,"count":count}));
	var frontiers = rpc_frontiers.frontiers;
	return frontiers;
}


// String output
this.frontier_count = function() {
	var rpc_frontier_count = this.rpc(JSON.stringify({"action":"frontier_count"}));
	var frontier_count = rpc_frontier_count.count;
	return frontier_count;
}


this.history = function(hash, count = '4096') {
	var rpc_history = this.rpc(JSON.stringify({"action":"history","hash":hash,"count":count}));
	var history = rpc_history.history;
	return history;
}


// Use this.unit instead of this function
// String input and output
this.mrai_from_raw = function(amount) {
	var rpc_mrai_from_raw = this.rpc(JSON.stringify({"action":"mrai_from_raw","amount":amount}));
	var mrai_from_raw = rpc_mrai_from_raw.amount;
	return mrai_from_raw;
}


// Use this.unit instead of this function
// String input and output
this.mrai_to_raw = function(amount) {
	var rpc_mrai_to_raw = this.rpc(JSON.stringify({"action":"mrai_to_raw","amount":amount}));
	var mrai_to_raw = rpc_mrai_to_raw.amount;
	return mrai_to_raw;
}


// Use this.unit instead of this function
// String input and output
this.krai_from_raw = function(amount) {
	var rpc_krai_from_raw = this.rpc(JSON.stringify({"action":"krai_from_raw","amount":amount}));
	var krai_from_raw = rpc_krai_from_raw.amount;
	return krai_from_raw;
}


// Use this.unit instead of this function
// String input and output
this.krai_to_raw = function(amount) {
	var rpc_krai_to_raw = this.rpc(JSON.stringify({"action":"krai_to_raw","amount":amount}));
	var krai_to_raw = rpc_krai_to_raw.amount;
	return krai_to_raw;
}


// Use this.unit instead of this function
// String input and output
this.rai_from_raw = function(amount) {
	var rpc_rai_from_raw = this.rpc(JSON.stringify({"action":"rai_from_raw","amount":amount}));
	var rai_from_raw = rpc_rai_from_raw.amount;
	return rai_from_raw;
}


// Use this.unit instead of this function
// String input and output
this.rai_to_raw = function(amount) {
	var rpc_rai_to_raw = this.rpc(JSON.stringify({"action":"rai_to_raw","amount":amount}));
	var rai_to_raw = rpc_rai_to_raw.amount;
	return rai_to_raw;
}


this.keepalive = function(address = '::ffff:192.168.1.1', port = '7075') {
	var keepalive = this.rpc(JSON.stringify({"action":"keepalive","address":address,"port":port}));
	return keepalive;
}


// Object output
this.key_create = function() {
	var key_create = this.rpc(JSON.stringify({"action":"key_create"}));
	return key_create;
}


// Object output
this.key_expand = function(key) {
	var key_expand = this.rpc(JSON.stringify({"action":"key_expand","key":key}));
	return key_expand;
}


this.password_change = function(wallet, password) {
	var rpc_password_change = this.rpc(JSON.stringify({"action":"password_change","wallet":wallet,"password":password}));
	var password_change = rpc_password_change.changed;
	return password_change;
}


this.password_enter = function(wallet, password) {
	var rpc_password_enter;
	if (typeof password == 'undefined') rpc_password_enter = this.rpc(JSON.stringify({"action":"password_enter","wallet":wallet,"password":""}));
	else rpc_password_enter = this.rpc(JSON.stringify({"action":"password_enter","wallet":wallet,"password":password}));
	var password_enter = rpc_password_enter.valid;
	return password_enter;
}


this.password_valid = function(wallet) {
	var rpc_password_valid = this.rpc(JSON.stringify({"action":"password_valid","wallet":wallet}));
	var password_valid = rpc_password_valid.valid;
	return password_valid;
}


this.payment_begin = function(wallet) {
	var rpc_payment_begin = this.rpc(JSON.stringify({"action":"payment_begin","wallet":wallet}));
	var payment_begin = rpc_payment_begin.account;
	return payment_begin;
}


this.payment_init = function(wallet) {
	var rpc_payment_init = this.rpc(JSON.stringify({"action":"payment_init","wallet":wallet}));
	var payment_init = rpc_payment_init.status;
	return payment_init;
}


this.payment_end = function(account, wallet) {
	var payment_end = this.rpc(JSON.stringify({"action":"payment_end","account":account,"wallet":wallet}));
	return payment_end;
}


// String input
this.payment_wait = function(account, amount, timeout) {
	var rpc_payment_wait = this.rpc(JSON.stringify({"action":"payment_wait","account":account,"amount":amount,"timeout":timeout}));
	var payment_wait = rpc_payment_wait.status;
	return payment_wait;
}


// block as Object
this.process = function(block) {
	var process = this.rpc(JSON.stringify({"action":"process","block":block}));
	return process;
}


this.peers = function() {
	var rpc_peers = this.rpc(JSON.stringify({"action":"peers"}));
	var peers = rpc_peers.peers;
	return peers;
}


this.pending = function(account, count = '4096') {
	var rpc_pending = this.rpc(JSON.stringify({"action":"pending","account":account,"count":count}));
	var pending = rpc_pending.blocks;
	return pending;
}


this.representatives = function() {
	var rpc_representatives = this.rpc(JSON.stringify({"action":"representatives"}));
	var representatives = rpc_representatives.representatives;
	return representatives;
}


// Empty output
this.republish = function(hash) {
	var rpc_republish = this.rpc(JSON.stringify({"action":"republish", "hash":hash}));
	var republish = rpc_republish.success;
	return republish;
}


this.search_pending = function(wallet) {
	var rpc_search_pending = this.rpc(JSON.stringify({"action":"search_pending","wallet":wallet}));
	var search_pending = rpc_search_pending.started;
	return search_pending;
}


this.send = function(wallet, source, destination, amount, unit = 'raw') {
	var raw_amount = this.unit(amount, unit, 'raw');
	var rpc_send = this.rpc(JSON.stringify({"action":"send","wallet":wallet,"source":source,"destination":destination,"amount":raw_amount}));
	var send = rpc_send.block;
	return send;
}


this.stop = function() {
	var stop = this.rpc(JSON.stringify({"action":"stop"}));
	return stop;
}


this.successors = function(block, count = '4096') {
	var rpc_successors = this.rpc(JSON.stringify({"action":"successors","block":block,"count":count}));
	var successors = rpc_successors.blocks;
	return successors;
}


this.validate_account_number = function(account) {
	var rpc_validate_account_number = this.rpc(JSON.stringify({"action":"validate_account_number","account":account}));
	var validate_account_number = rpc_validate_account_number.valid;
	return validate_account_number;
}


this.version = function() {
	var version = this.rpc(JSON.stringify({"action":"version"}));
	return version;
}


this.wallet_add = function(wallet, key) {
	var rpc_wallet_add = this.rpc(JSON.stringify({"action":"wallet_add","wallet":wallet,"key":key}));
	var wallet_add = rpc_wallet_add.account;
	return wallet_add;
}


// Empty output
this.wallet_change_seed = function(wallet, seed) {
	var rpc_wallet_change_seed = this.rpc(JSON.stringify({"action":"wallet_change_seed", "wallet":wallet, "seed":seed}));
	var wallet_change_seed = rpc_wallet_change_seed.success;
	return wallet_change_seed;
}


this.wallet_contains = function(wallet, account) {
	var rpc_wallet_contains = this.rpc(JSON.stringify({"action":"wallet_contains","wallet":wallet,"account":account}));
	var wallet_contains = rpc_wallet_contains.exists;
	return wallet_contains;
}


this.wallet_create = function() {
	var rpc_wallet_create = this.rpc(JSON.stringify({"action":"wallet_create"}));
	var wallet_create = rpc_wallet_create.wallet;
	return wallet_create;
}


this.wallet_destroy = function(wallet) {
	var wallet_destroy = this.rpc(JSON.stringify({"action":"wallet_destroy","wallet":wallet}));
	return wallet_destroy;
}


// Return as array or as JSON/Object?
this.wallet_export = function(wallet) {
	var rpc_wallet_export = this.rpc(JSON.stringify({"action":"wallet_export","wallet":wallet}));
	var wallet_export = rpc_wallet_export.json;
	return wallet_export;
}


this.wallet_frontiers = function(wallet) {
	var rpc_wallet_frontiers = this.rpc(JSON.stringify({"action":"wallet_frontiers","wallet":wallet}));
	var wallet_frontiers = rpc_wallet_frontiers.frontiers;
	return wallet_frontiers;
}


this.wallet_representative = function(wallet) {
	var rpc_wallet_representative = this.rpc(JSON.stringify({"action":"wallet_representative","wallet":wallet}));
	var wallet_representative = rpc_wallet_representative.representative;
	return wallet_representative;
}


this.wallet_representative_set = function(wallet, representative) {
	var rpc_wallet_representative_set = this.rpc(JSON.stringify({"action":"wallet_representative_set","wallet":wallet,"representative":representative}));
	var wallet_representative_set = rpc_wallet_representative_set.set;
	return wallet_representative_set;
}


this.work_cancel = function(hash) {
	var work_cancel = this.rpc(JSON.stringify({"action":"work_cancel","hash":hash}));
	return work_cancel;
}


this.work_generate = function(hash) {
	var rpc_work_generate = this.rpc(JSON.stringify({"action":"work_generate","hash":hash}));
	var work_generate = rpc_work_generate.work;
	return work_generate;
}

this.work_validate = function(work, hash) {
	var rpc_work_validate = this.rpc(JSON.stringify({"action":"work_validate","work":work,"hash":hash}));
	var work_validate = rpc_work_validate.valid;
	return work_validate;
}

};
