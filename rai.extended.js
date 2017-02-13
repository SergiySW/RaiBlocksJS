/*
* RaiBlocks extended functions in JavaScript
* https://github.com/SergiySW/RaiBlocksJS
*
* Released under the BSD 3-Clause License
*
*/


// Global variables: block_count, count, unchecked, frontier_count, frontiers, peers
var RaiBlocks = RaiBlocks || {};

Rai.prototype.initialize = function() {
	RaiBlocks.available_supply = this.available_supply();
	RaiBlocks.block_count = this.block_count();
	RaiBlocks.count = RaiBlocks.block_count.count;
	RaiBlocks.unchecked = RaiBlocks.block_count.unchecked;
	RaiBlocks.frontier_count = this.frontier_count();
	RaiBlocks.frontiers = this.frontiers();
	RaiBlocks.peers = this.peers();
}


// Extended function, jQuery is required
Rai.prototype.account_history = function(account, count) {
	var rpc_request = this;
	
	if (typeof RaiBlocks.frontiers == 'undefined') this.initialize(); // if not initialized
	var hash = RaiBlocks.frontiers[account];

	if (typeof hash != 'undefined') {
		var account_history = this.history(hash);
		var chain = this.chain(hash);
		
		// Retrieve change blocks
		$.each(chain, function( key, value ){
			if (account_history[key].hash !== value) {
				let block = rpc_request.block(value);
				if (block.type=='change') {
					let insert = {account:block.representative, amount:0, hash:value, type:block.type};
					account_history.splice(key, 0, insert);
				}
			}
		});
	}
	else {
		console.log("Empty account " + account);
	}
	
	return account_history;
}


// Extended function, jQuery is required
Rai.prototype.wallet_accounts_info = function(wallet, count) {
	var rpc_request = this;
	
	if (typeof RaiBlocks.frontiers == 'undefined') this.initialize(); // if not initialized
	
	var accounts_list = rpc_request.account_list(wallet);

	var wallet_accounts_info = []; // Accounts Array + balances
	$.each(accounts_list, function(){
		let balance = rai.balance(this);
		let history = rai.account_history(this, count);
		wallet_accounts_info.push({key: this, raw_balance: balance, balance: rai.unit(balance, 'raw', 'rai'), history: history});
	});
	
	return wallet_accounts_info;
}


Rai.prototype.rpc_version = function() {
	var rpc_version = this.version().rpc_version;
	return rpc_version;
}


Rai.prototype.store_version = function() {
	var store_version = this.version().store_version;
	return store_version;
}


Rai.prototype.node_vendor = function() {
	var node_vendor = this.version().node_vendor;
	return node_vendor;
}


// String output
Rai.prototype.balance = function(account, unit) {
	if (typeof unit == 'undefined') { unit = 'raw'; }
	var account_balance = rpc_request.account_balance(account);
	var balance = this.unit(account_balance.balance, 'raw', unit);
	return balance;
}


// String output
Rai.prototype.account_pending = function(account, unit) {
	if (typeof unit == 'undefined') { unit = 'raw'; }
	var account_balance = rpc_request.account_balance(account);
	var pending = this.unit(account_balance.pending, 'raw', unit);
	return pending;
}


// String output
this.count = function() {
	var count = rpc_request.block_count().count;
	return count;
}


// String output
this.unchecked = function() {
	var unchecked = rpc_request.block_count().unchecked;
	return unchecked;
}