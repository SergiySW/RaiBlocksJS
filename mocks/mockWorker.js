const workerPool = require('workerpool');

const add = (a, b) => a + b;

workerPool.worker({
  add,
});
