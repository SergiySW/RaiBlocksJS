# RaiBlocksJS
JavaScript functions for RaiBlocks node/wallet management via RPC commands
https://github.com/clemahieu/raiblocks/wiki/RPC-protocol

**rai.rpc.js** contains very basic RPC request tool
**rai.core.js** contains all RPC commands as JS functions
**rai.extended.js** contains some extended functions not available in current RPC implementation
**rai.community.js** comtains requests to RaiBlocksCommunity.net website

# Currrent limitations
* Cross-origin resource sharing prevents access from browser to node. Use plugins such as
  https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi
  https://addons.mozilla.org/ru/firefox/addon/cors-everywhere/
* Impossible to retrieve wallet number via RPC. Replace var wallet in sample.html

Show RPC improvenment progress here:
https://github.com/clemahieu/raiblocks/issues/29

# External libraries used
**BigNumber.js** https://github.com/MikeMcl/bignumber.js
**jQuery** https://github.com/jquery/jquery
