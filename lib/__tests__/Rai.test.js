import Rai from '../Rai';

describe('Rai', () => {
  test('Rai is a function', () => {
    const rai = new Rai();
    expect(rai instanceof Rai).toBeTruthy();
  });
});
