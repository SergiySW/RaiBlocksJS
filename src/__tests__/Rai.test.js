import Rai from '../Rai';
import packageJSON from '../../package.json';

const { testURL } = packageJSON.jest;
const rai = new Rai(testURL);

describe('Rai', () => {
  test('Rai is a class', () => {
    expect(rai instanceof Rai).toBeTruthy();
  });
});
