import mockServer from '../../../../mocks/mockServer';
import rai from '../../../../mocks/mockRai';

describe('ProofOfWork', () => {
  test('proofOfWork.cancel', async () => {
    const expected = {
      success: true,
    };

    const request = {
      hash: '718CC2121C3E641059BC1C2CFC45666C99E8AE922F7A807B7D07B62C995D79E2',
    };

    mockServer.success({
      request: Object.assign({}, request, {
        action: 'work_cancel',
      }),
      response: {},
    });

    const response = await rai.proofOfWork.cancel(request);
    expect(response).toEqual(expected);
  });

  test('proofOfWork.generate', async () => {
    const expected = {
      work: '2bf29ef00786a6bc',
    };

    const request = {
      hash: '718CC2121C3E641059BC1C2CFC45666C99E8AE922F7A807B7D07B62C995D79E2',
    };

    mockServer.success({
      request: Object.assign({}, request, {
        action: 'work_generate',
      }),
      response: expected,
    });

    const response = await rai.proofOfWork.generate(request);
    expect(response).toEqual(expected);
  });

  test('proofOfWork.get', async () => {
    const expected = {
      work: '2bf29ef00786a6bc',
    };

    const request = {
      wallet: '000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A277D81789F3F',
      account: 'xrb_3e3j5tkog48pnny9dmfzj1r16pg8t1e76dz5tmac6iq689wyjfpi00000000',
    };

    mockServer.success({
      request: Object.assign({}, request, {
        action: 'work_get',
      }),
      response: expected,
    });

    const response = await rai.proofOfWork.get(request);
    expect(response).toEqual(expected);
  });

  test('proofOfWork.set', async () => {
    const expected = {
      success: true,
    };

    const request = {
      wallet: '000D1BAEC8EC208142C99059B393051BAC8380F9B5A2E6B2489A277D81789F3F',
      account: 'xrb_3e3j5tkog48pnny9dmfzj1r16pg8t1e76dz5tmac6iq689wyjfpi00000000',
      work: '0000000',
    };

    mockServer.success({
      request: Object.assign({}, request, {
        action: 'work_set',
      }),
      response: {
        success: '',
      },
    });

    const response = await rai.proofOfWork.set(request);
    expect(response).toEqual(expected);
  });
});
