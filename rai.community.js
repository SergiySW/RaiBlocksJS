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
		// Asynchronous
		if (typeof async_callback != 'undefined') {
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
	
	
	this.summary = function() {
		var summary = this.json("https://raiblockscommunity.net/page/summary.php?json=1", JSON.stringify({}));
		this.available_supply = summary.available_supply;
		this.block_count = summary.blocks;
		this.frontier_count = summary.frontiers;
		return summary;
	}
	
	
	this.peers = function() {
		var peers = this.json("https://raiblockscommunity.net/page/peers.php?json=1", JSON.stringify({}));
		return peers;
	}
	
	
	this.block = function(hash) {
		var block = this.json("https://raiblockscommunity.net/explorer/index.php?h=" + hash + "&json=1", JSON.stringify({}));
		return block;
	}
	
	this.history = function(account) {
		var history = this.json("https://raiblockscommunity.net/account/index.php?acc=" + account + "&json=1", JSON.stringify({}));
		return history;
	}
	
};