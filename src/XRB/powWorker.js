const { blake2bInit, blake2bUpdate, blake2bFinal } = require('blakejs');
const getRandomValues = require('get-random-values');
const workerPool = require('workerpool');

const powThreshold = Uint8Array => (
  Uint8Array[0] === 255
  && Uint8Array[1] === 255
  && Uint8Array[2] === 255
  && Uint8Array[3] >= 192
);

const randomUint = () => {
  const array = new Uint8Array(8);
  getRandomValues(array);
  return array;
};

const generator256 = (hash) => {
  const random = randomUint();
  for (let r = 0; r < 256; r += 1) {
    random[7] = (random[7] + r) % 256; // pseudo random part
    const context = blake2bInit(8, null);
    blake2bUpdate(context, random);
    blake2bUpdate(context, hash);
    const blakeRandom = blake2bFinal(context).reverse();
    const check = powThreshold(blakeRandom);
    if (check) return random.reverse();
  }
  return false;
};

const doProofOfWork = (hash, amountOfAttempts) => {
  for (let i = 0; i < amountOfAttempts; i += 1) {
    const work = generator256(hash);
    if (work) {
      return work;
    }
  }
  return false;
};

workerPool.worker({
  doProofOfWork,
});
