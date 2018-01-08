import Rai from '../Rai';
import packageJSON from '../../package.json';

const { testURL } = packageJSON.jest;
const rai = new Rai(testURL);

describe('Rai', () => {
  test('Rai is a class', () => {
    expect(rai instanceof Rai).toBeTruthy();
  });

  test('Rai without a host url sets localhost:7076 as a default', () => {
    const raiLocal = new Rai();

    expect(raiLocal.hostUrl).toBe('http://localhost:7076');
  });
});
