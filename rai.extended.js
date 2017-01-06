/*
RaiBlocks extended functions in JavaScript

*/


// Global variables: block_count, frontier_count, frontiers, peers, [node] version (?)
var RaiBlocks = RaiBlocks || {};

Rai.prototype.initialize = function() {
	RaiBlocks.available_supply = this.available_supply();
	RaiBlocks.block_count = this.block_count();
	RaiBlocks.frontier_count = this.frontier_count();
	RaiBlocks.frontiers = this.frontiers();
	RaiBlocks.peers = this.peers();
	RaiBlocks.version = this.version();
}


Rai.prototype.account_history = function(account, count) {
	var rpc_request = this;
	
	if (typeof RaiBlocks.frontiers == 'undefined') this.initialize(); // if not initialized
	var hash = RaiBlocks.frontiers[account];
	var history = this.history(hash);
	var chain = this.chain(hash);
	
	var account_history = history;
	
	// Retrieve change blocks
	$.each(chain, function( key, value ){
		if (account_history[key].hash !== value) {
			var block = rpc_request.block(value);
			if (block.type=='change') {
				var insert = {account:block.representative, amount:0, hash:value, type:block.type};
				account_history.splice(key, 0, insert);
			}
		}
	});
	
	return account_history;
}

