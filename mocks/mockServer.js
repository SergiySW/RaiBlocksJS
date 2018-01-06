import nock from 'nock';
import packageJSON from '../package.json';

const { testURL } = packageJSON.jest;

const success = ({ request, response }) => {
  nock(testURL)
    .post('/', request)
    .reply(200, response);
};

export default {
  success,
};
