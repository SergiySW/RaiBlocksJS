/*
* RaiBlocks community functions in JavaScript
* https://github.com/SergiySW/RaiBlocksJS
*
* Released under the BSD 3-Clause License
*
*
* RaiBlocks Community website
* https://raiblockscommunity.net/
*/


function RaiCommunity() {
	
	this.json = function(url, data, async_callback) {
		try {
			// Asynchronous
			if (typeof async_callback == 'function') {
				let xhr;
				xhr = new XMLHttpRequest();
				xhr.onload = function (e) {
					if (xhr.readyState === 4 && xhr.status === 200) {
						let json = JSON.parse(xhr.responseText);
						async_callback(json);
					}
				};
				
				xhr.onerror = function (e) {
					console.error(xhr.statusText);
				};
				
				xhr.open("POST", url, true);
				xhr.send(data);
			}
			// Synchronous
			else {
				let xhr;
				xhr = new XMLHttpRequest();
				xhr.open("POST", url, false);
				
				xhr.send(data);
				
				if (xhr.readyState == 4 && xhr.status == 200) {
					let json = JSON.parse(xhr.responseText);
					return json;
				}
			}
		}
		catch (ex) {
			alert(ex);
			console.error(ex.message);
		}
	}
	

	this.account = function(account) {
		var account = this.json("https://raiblockscommunity.net/account/index.php?acc=" + account + "&json=1", JSON.stringify({}));
		return account;
	}

	this.block = function(hash) {
		var block = this.json("https://raiblockscommunity.net/block/index.php?h=" + hash + "&json=1", JSON.stringify({}));
		return block;
	}
	
	
	this.frontiers = function() {
		var frontiers = this.json("https://raiblockscommunity.net/page/frontiers.php?json=1", JSON.stringify({}));
		return frontiers;
	}
	
	
	this.history = function(account) {
		var history = this.account(account).history;
		return history;
	}
	
	
	this.peers = function() {
		var peers = this.json("https://raiblockscommunity.net/page/peers.php?json=1", JSON.stringify({}));
		return peers;
	}
	
	
	this.representatives = function() {
		var representatives = this.json("https://raiblockscommunity.net/page/representatives.php?json=1", JSON.stringify({}));
		return representatives;
	}
	
	
	this.summary = function() {
		var summary = this.json("https://raiblockscommunity.net/page/summary.php?json=1", JSON.stringify({}));
		this.available_supply = summary.supply.available_supply;
		this.block_count = summary.blocks;
		this.frontier_count = summary.frontiers;
		return summary;
	}
	
	
	// Extended function, TX boost!
	this.transaction_boost = function(frontier, boost_count) {
		var rai = new Rai(host);
		var chain = rai.chain(frontier, boost_count).reverse();
		$.each(chain, function(){
			let block = rai.block(this);
			let url_block = encodeURIComponent(JSON.stringify(block));
			let http = new XMLHttpRequest();
			let url = "https://raiblockscommunity.net/processblock/elaborate.php";
			let params = "processblock=" + url_block + "&submit=Process";
			http.open("POST", url, true);
			http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			http.send(params);
		});
	}
	
	// Extended function, TX booster!
	this.transaction_booster = function(wallet, host) {
		if (typeof host == 'undefined') { host = 'http://localhost:7076'; } // if not initialized
		var rai = new Rai(host);
		var community_request = this;
		
		if (typeof RaiBlocks.frontiers == 'undefined') rai.initialize(); // if not initialized
		
		var accounts_list = rai.account_list(wallet);
		
		$.each(accounts_list, function(){
			let frontier = RaiBlocks.frontiers[this];
			if (typeof frontier != 'undefined') {
				let chain_lenght = 64;
				let chain = rai.chain(frontier, chain_lenght);
				let comm_history = community_request.history(this);
				let boost_count = 0;
				if (comm_history == null) {
					boost_count = chain.length;
				}
				else {
					let comm_frontier = comm_history[0]['hash'];
					for (let i = 0; i < chain.length; i++) {
						current_hash = chain[i];
						if (current_hash == comm_frontier) {
							console.log(i);
							boost_count = i;
						}
						else if ((i + 1) == chain.length) {
							boost_count = chain.length; // Send everything, if not found
						}
					}
				}
				if (boost_count > 0) community_request.transaction_boost(frontier, boost_count);
			}
		});
	}
	
};
