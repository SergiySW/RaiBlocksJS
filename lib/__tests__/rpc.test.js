import Rpc from '../rpc';

describe('rpc', () => {
  test('rpc is a function', () => {
    const rpc = new Rpc();
    expect(rpc instanceof Rpc).toBeTruthy();
  });
});
