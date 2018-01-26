import mockServer from '../../../../mocks/mockServer';
import rai from '../../../../mocks/mockRai';

describe('Keys', () => {
  test('keys.deterministic', async () => {
    const expected = {
      private: '9F0E444C69F77A49BD0BE89DB92C38FE713E0963165CCA12FAF5712D7657120F',
      public: 'C008B814A7D269A1FA3C6528B19201A24D797912DB9996FF02A1FF356E45552B',
      account: 'xrb_3i1aq1cchnmbn9x5rsbap8b15akfh7wj7pwskuzi7ahz8oq6cobd99d4r3b7',
    };

    const request = {
      seed: '0000000000000000000000000000000000000000000000000000000000000000',
      index: '0',
    };

    mockServer.success({
      request: Object.assign({}, request, {
        action: 'key_deterministic',
      }),
      response: expected,
    });

    const response = await rai.keys.deterministic({
      seed: '0000000000000000000000000000000000000000000000000000000000000000',
      index: 0,
    });
    expect(response).toEqual(expected);
  });

  test('keys.create', async () => {
    const expected = {
      private: '9F0E444C69F77A49BD0BE89DB92C38FE713E0963165CCA12FAF5712D7657120F',
      public: 'C008B814A7D269A1FA3C6528B19201A24D797912DB9996FF02A1FF356E45552B',
      account: 'xrb_3i1aq1cchnmbn9x5rsbap8b15akfh7wj7pwskuzi7ahz8oq6cobd99d4r3b7',
    };

    mockServer.success({
      request: {
        action: 'key_create',
      },
      response: expected,
    });

    const response = await rai.keys.create();
    expect(response).toEqual(expected);
  });

  test('keys.expand', async () => {
    const expected = {
      private: '9F0E444C69F77A49BD0BE89DB92C38FE713E0963165CCA12FAF5712D7657120F',
      public: 'C008B814A7D269A1FA3C6528B19201A24D797912DB9996FF02A1FF356E45552B',
      account: 'xrb_3i1aq1cchnmbn9x5rsbap8b15akfh7wj7pwskuzi7ahz8oq6cobd99d4r3b7',
    };

    const request = {
      key: '9F0E444C69F77A49BD0BE89DB92C38FE713E0963165CCA12FAF5712D7657120F',
    };

    mockServer.success({
      request: Object.assign({}, request, {
        action: 'key_expand',
      }),
      response: expected,
    });

    const response = await rai.keys.expand(request);
    expect(response).toEqual(expected);
  });
});
