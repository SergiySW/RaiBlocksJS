# RaiBlocksJS
JavaScript functions for RaiBlocks node/wallet management via RPC commands
https://github.com/clemahieu/raiblocks/wiki/RPC-protocol

**Optimized for 7.5.1 unreleased version**  
If your node/wallet version < 7.5.1 use file versions uploaded before 15/01/2017

* **rai.rpc.js** contains very basic RPC request tool + all RPC commands as JS functions
* ~~**rai.core.js** contains all RPC commands as JS functions~~ merged with rai.rpc.js
* **rai.extended.js** contains some extended functions not available in current RPC implementation
* **rai.community.js** contains requests to RaiBlocksCommunity.net website

# Usage sample
concept
```javascript
var [connection_name] = new Rai([host]); // create connection
var answer_1 = [connection_name].[action_1]([parameters_1]); // RPC action_1 with parameters_1
var answer_2 = [connection_name].[action_2]([parameters_2]); // RPC action_2 with parameters_2
```
sample 1
```javascript
var rai = new Rai(); // default connection to localhost
var blocks = rai.block_count(); // recieve block count
var weight = rai.account_weight('xrb_35jjmmmh81kydepzeuf9oec8hzkay7msr6yxagzxpcht7thwa5bus5tomgz9');
// recieve weight of official faucet account
```
sample 2
```javascript
var rai_example = new Rai('https://example.tld:5867'); // connection to sample host with HTTPS and different port
var generate = rai_example.work_generate('A703C82F08B1F2A61BDC3254D992025FE9D9566BD9FFDE19535D781BFE79BF92');
// generates work for block
var weight = rai_example.chain('A703C82F08B1F2A61BDC3254D992025FE9D9566BD9FFDE19535D781BFE79BF92', 64);
// retrieve chain of block (up to 64 blocks)
```

# Currrent limitations
* [Fixed in 7.5.1 unreleased version] Cross-origin resource sharing prevents access from browser to node. Use plugins such as
  https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi
  https://addons.mozilla.org/ru/firefox/addon/cors-everywhere/
* Impossible to retrieve wallet id via RPC. Replace var wallet in sample.html

Show RPC improvenment progress here:
https://github.com/clemahieu/raiblocks/issues/29

# External libraries used
* **BigNumber.js** https://github.com/MikeMcl/bignumber.js
* **jQuery** https://github.com/jquery/jquery
