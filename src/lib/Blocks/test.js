import nock from 'nock'; // eslint-disable-line
import Rai from '../../Rai';
import packageJSON from '../../../package.json';

const { testURL } = packageJSON.jest;

describe('Blocks', () => {
  const rai = new Rai(testURL);

  test('blocks.account', async () => {
    nock(testURL)
      .post('/', {
        action: 'blocks_account',
      })
      .reply(200, {

      });

    const response = await rai.blocks.account({});
    expect(response).toEqual({

    });
  });

  test('blocks.count', async () => {
    nock(testURL)
      .post('/', {
        action: 'blocks_count',
      })
      .reply(200, {

      });

    const response = await rai.blocks.count({});
    expect(response).toEqual({

    });
  });

  test('blocks.countByType', async () => {
    nock(testURL)
      .post('/', {
        action: 'blocks_count_type',
      })
      .reply(200, {

      });

    const response = await rai.blocks.countByType({});
    expect(response).toEqual({

    });
  });

  test('blocks.chain', async () => {
    nock(testURL)
      .post('/', {
        action: 'blocks_chain',
      })
      .reply(200, {

      });

    const response = await rai.blocks.chain({});
    expect(response).toEqual({

    });
  });

  test('blocks.create', async () => {
    nock(testURL)
      .post('/', {
        action: 'blocks_create',
      })
      .reply(200, {

      });

    const response = await rai.blocks.create({});
    expect(response).toEqual({

    });
  });

  test('blocks.process', async () => {
    nock(testURL)
      .post('/', {
        action: 'blocks_process',
      })
      .reply(200, {

      });

    const response = await rai.blocks.process({});
    expect(response).toEqual({

    });
  });

  test('blocks.get', async () => {
    nock(testURL)
      .post('/', {
        action: 'blocks_get',
      })
      .reply(200, {

      });

    const response = await rai.blocks.get({});
    expect(response).toEqual({

    });
  });
});
