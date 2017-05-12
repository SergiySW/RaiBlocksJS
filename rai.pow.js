self.importScripts('blake2b.js');

//static uint64_t const publish_full_threshold = 0xffffffc000000000
function threshold (Uint8Array) {
	if ((Uint8Array[0] == 255) && (Uint8Array[1] == 255) && (Uint8Array[2] == 255) && (Uint8Array[3] >= 192))	return true;
	else	return false;
}

function randomUint () {
	let array = new Uint8Array(8);
	self.crypto.getRandomValues(array);
	return array;
}

function generator256 (hash) {
	let random = randomUint();
	for (let r = 0; r < 256; r++) {
		random[7] = (random[7] + r) % 256; // pseudo random part
		let context = blake2bInit(8, null);
		blake2bUpdate(context, random.reverse());
		blake2bUpdate(context, hash);
		let blake_random = blake2bFinal(context).reverse();
		let check = threshold(blake_random);
		if (check === true) 	return random;
	}
	return false;
}

onmessage = function(ev)
{
	for (let i = 0; i < 4096; i++) {
		let generate = generator256(ev.data);
		if (generate) { 
			postMessage(generate); // Worker return
			break;
		}
	}
	postMessage(false);
}
