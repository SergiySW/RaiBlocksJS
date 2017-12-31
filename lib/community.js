import fetch from 'node-fetch';

const baseUrl = 'https://raiblockscommunity.net';

export default class RaiCommunity {
  async json(url, body = {}) {
    const response = await fetch(url, { method: 'POST', body });

    if(response.status !== 200) {
      return { error: 'Something went wrong' }
    }

    return response.json();
  }

  account(account) {
    return this.json(`${baseUrl}/account/index.php?acc=${account}&json=1`);
  }

  block(hash) {
    const block = this.json(`${baseUrl}/block/index.php?h=${hash}&json=1`);
    return block;
  }


  frontiers() {
    const frontiers = this.json(`${baseUrl}/page/frontiers.php?json=1`);
    return frontiers;
  }


  history(account) {
    return this.account(account).history;
  }


  peers() {
    return this.json(`${baseUrl}/page/peers.php?json=1`);
  }


  representatives() {
    return this.json(`${baseUrl}/page/representatives.php?json=1`);
  }


  summary() {
    const summary = this.json(`${baseUrl}/page/summary.php?json=1`);
    this.available_supply = summary.supply.available_supply;
    this.block_count = summary.blocks;
    this.frontier_count = summary.frontiers;
    return summary;
  }


  // Extended function, TX boost!
  transaction_boost(frontier, boost_count) {
    const rai = new Rai(host);
    const community_request = this;
    const chain = rai.chain(frontier, boost_count).reverse();
    $.each(chain, function(){
      let block = rai.block(this);
      let url_block = encodeURIComponent(JSON.stringify(block));
      let http = new XMLHttpRequest();
      let url = `${baseUrl}/processblock/elaborate.php`;
      let params = "processblock=" + url_block + "&submit=Process";
      http.open("POST", url, true);
      http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      http.timeout = 5000; // Timeout 5 seconds (5000 milliseconds)
      http.ontimeout = setTimeout(function(){ community_request.transaction_boost(frontier, boost_count); }, 30000); // Infinite repeat on fail
      http.send(params);
    });
  }

  // Extended function, TX booster!
  transaction_booster(wallet, host) {
    if (typeof host == 'undefined') { host = 'http://localhost:7076'; } // if not initialized
    const rai = new Rai(host);
    const community_request = this;

    const frontiers = rai.wallet_frontiers(wallet);

    const accounts_list = rai.account_list(wallet);

    $.each(accounts_list, function(){
      let frontier = frontiers[this];
      if (typeof frontier != 'undefined') {
        let chain_length = 64;
        let chain = rai.chain(frontier, chain_length);
        let comm_history = community_request.history(this);
        let boost_count = 0;
        if ((comm_history == null) || (typeof comm_history == 'undefined') || (comm_history.length < 1)) {
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

  // Extended function, TX RPC republisher
  transaction_republisher(wallet, host) {
    if (typeof host == 'undefined') { host = 'http://localhost:7076'; } // if not initialized
    const rai = new Rai(host);
    const community_request = this;

    const frontiers = rai.wallet_frontiers(wallet);

    const accounts_list = rai.account_list(wallet);

    $.each(accounts_list, function(){
      let frontier = frontiers[this];
      if (typeof frontier != 'undefined') {
        let chain_length = 64;
        let chain = rai.chain(frontier, chain_length);
        let comm_history = community_request.history(this);
        if ((comm_history == null) || (typeof comm_history == 'undefined') || (comm_history.length < 1)) { // Empty community history
          alert("Rebroadcast block: " + chain[chain.length - 1]);
          rai.republish(chain[chain.length - 1]);
        }
        else {
          let comm_frontier = comm_history[0]['hash'];
          for (let i = 0; i < chain.length; i++) {
            current_hash = chain[i];
            if (current_hash == comm_frontier) {
              alert("Rebroadcast block: " + current_hash);
              rai.republish(current_hash);
              console.log(i);
            }
            else if ((i + 1) == chain.length) {
              alert("Rebroadcast block: " + chain[chain.length - 1]);
              rai.republish(chain[chain.length - 1]); // Send everything, if not found
            }
          }
        }
      }
    });
  }
};