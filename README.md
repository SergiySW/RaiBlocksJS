[![npm version](https://badge.fury.io/js/raiblocks-js.svg)](https://badge.fury.io/js/raiblocks-js)
[![Build Status](https://travis-ci.org/orrybaram/RaiBlocksJS.png?branch=master)](https://travis-ci.org/orrybaram/RaiBlocksJS)
[![Coverage Status](https://coveralls.io/repos/github/orrybaram/RaiBlocksJS/badge.svg?branch=master)](https://coveralls.io/github/orrybaram/RaiBlocksJS?branch=master)


![Imgur](https://i.imgur.com/y4djCR9.png?3)
# RaiBlocksJS
An isomorphic async library that interfaces with the RaiBlocks RPC protocol
https://github.com/clemahieu/raiblocks/wiki/RPC-protocol

**Optimized for version 8+**


# Installation
```
yarn add raiblocks-js
```

# Note
To test locally, you'll need to setup your own node.
See instructions here: https://github.com/clemahieu/raiblocks/wiki/Docker-node

# Usage

### Boilerplate
https://gist.github.com/orrybaram/b1c4b724b134c8b7fb0cafe52cb5f6c6

### Basic implementation
```javascript
import Rai from 'raiblocks-js';

const rai = new Rai(); // creates default connection to localhost:7076
const blockCount = rai.blocks.count(); // returns Promise with a response object
blockCount.then(res => console.log(res)) // => { count: '1000', unchecked: '10' }

const accountWeight = rai.account.weight({ account: 'xrb_35jjmmmh81kydepzeuf9oec8hzkay7msr6yxagzxpcht7thwa5bus5tomgz9' });
accountWeight.then(res => console.log(res)) // => 1000000

```

### Creating raw rpc actions
```javascript
const rai = new Rai();
const blockCount = rai.rpc('block_count'); // returns Promise with a response object
blockCount.then(res => console.log(res)) // => { count: '1000', unchecked: '10' }

const accountWeight = rai.rpc('account_weight', { account: 'xrb_35jjmmmh81kydepzeuf9oec8hzkay7msr6yxagzxpcht7thwa5bus5tomgz9' });
accountWeight.then(res => console.log(res)) // => 1000000
```

### Connecting to a custom node
```javascript
const rai = new Rai('https://xrb.example-node.io:3000');

```

### A note about import vs require:
  If you are not using es modules,
  you'll need to reference the default value:

  ```js
    const { default: Rai } = require('raiblocks-js');
  ```

# Roadmap
* Add 'extended' features from https://github.com/SergiySW/RaiBlocksJS/blob/master/rai.extended.js
* Finish documentation


# Methods
  ## rai.account
  * ##### balance()
  * ##### blockCount()
  * ##### create()
  * ##### info()
  * ##### history()
  * ##### get()
  * ##### key()
  * ##### list()
  * ##### move()
  * ##### remove()
  * ##### getRepresentative()
  * ##### setRepresentative()
  * ##### weight()

  ## rai.accounts
  * ##### balances()
  * ##### create()
  * ##### frontiers()
  * ##### pending()

  ## rai.blocks
  * ##### account()
  * ##### count: getCount()
  * ##### countByType()
  * ##### chain()
  * ##### create()
  * ##### process()
  * ##### get()

  ## rai.bootstrap()
  #####

  ## rai.delegators
  * ##### count()
  * ##### get()

  ## rai.frontiers
  * ##### count: ()
  * ##### get()

  ## rai.keys
  * ##### create()
  * ##### deterministic()
  * ##### expand()

  ## rai.ledger
  * ##### get()
  * ##### history()
  * ##### succesors()

  ## rai.network
  * ##### availableSupply()
  * ##### keepAlive()
  * ##### republish()

  ## rai.node
  * ##### version()
  * ##### stop()

  ## rai.payment
  * ##### begin()
  * ##### init()
  * ##### end()
  * ##### wait()

  ## rai.peers
  * ##### addWorkPeer()
  * ##### getWorkPeers()
  * ##### clearWorkPeers()
  * ##### get()

  ## rai.pending
  * ##### get()
  * ##### exists()
  * ##### search()

  ## rai.proofOfWork
  * ##### cancel()
  * ##### get()
  * ##### generate()
  * ##### set()

  ## rai.receive
  * ##### get()
  * ##### minimum()
  * ##### setMinimum()

  ## rai.representatives
  * ##### get()
  * ##### wallet()
  * ##### walletSet()

  ## rai.send()

  ## rai.unchecked
  * ##### clear()
  * ##### get()
  * ##### keys()
  * ##### list()

  ## rai.wallet
  * ##### add()
  * ##### balanceTotal()
  * ##### balances()
  * ##### changeSeed()
  * ##### contains()
  * ##### create()
  * ##### destroy()
  * ##### export: exportWallet()
  * ##### frontiers()
  * ##### locked()
  * ##### passwordChange()
  * ##### passwordEnter()
  * ##### passwordValid()
  * ##### pending()
  * ##### getRepresentative()
  * ##### setRepresentative()
  * ##### republish()
  * ##### unlock()
  * ##### workGet()

RPC improvement progress here:
https://github.com/clemahieu/raiblocks/issues/29
