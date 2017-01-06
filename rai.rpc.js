/*
RaiBlocks RPC requests from JavaScript

set 'request' as string. Samples
	JSON.stringify({"action":"block_count"})
	'{"action":"block_count"}'

set 'url_base' as string. Mask protocol://host:port. Default value is http://localhost:7076. Samples
	http://localhost:7076
	https://skyhold.asuscomm.com:7077

set 'async' as boolean. Default value is false
Note: Now only sync requests are available. Async for future developments

Request sample
	var rai = new Rai();
	var block_count = rai.rpc(JSON.stringify({"action":"block_count"}), 'http://localhost:7076', false);
	
*/

function Rai(url_base) {
	
	this.rpc = function(request, async) {
		// Asynchronous
		if (async === true) {
			// TODO
		}
		
		// Synchronous
		else {
			var url = document.createElement('a');
			if (typeof url_base == 'undefined') { url.href = 'http://localhost'; } // if url is not set, use default to localhost
			else if (!url_base.startsWith('http')) { url.href = 'http://' + url_base.split('/').reverse()[0]; } // local files are not supported; default protocol = HTTP
			else { url.href = url_base; }
			
			if (url.port== "") { url.port = '7076'; }
			
			xhr = new XMLHttpRequest();
			xhr.open("POST", url, false);
			xhr.send(request);
			
			if (xhr.readyState == 4 && xhr.status == 200) {
				var json = JSON.parse(xhr.responseText);
				return json;
			}
		}
	}
};

