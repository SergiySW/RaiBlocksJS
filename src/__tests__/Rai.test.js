import Rai from '../Rai';
import packageJSON from '../../package.json';

const { testURL } = packageJSON.jest;

describe('Rai', () => {
  const rai = new Rai(testURL);

  test('Rai is a class', () => {
    expect(rai instanceof Rai).toBeTruthy();
  });
});
