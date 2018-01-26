import Rai from '../';
import packageJSON from '../../../package.json';
import mockServer from '../../../mocks/mockServer';

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

  test('rpc error handler', async () => {
    expect.assertions(1);
    mockServer.error({ request: { action: 'version' } });

    const response = await rai.node.version();
    expect(response.message).toBe('Network Error');
  });

  test('.getConversion', () => {
    const actual = rai.getConversion({
      value: 1234,
      from: 'raw',
      to: 'XRB',
    });
    expect(actual).toBe('0.000000000000000000000000001234');
  });
});
