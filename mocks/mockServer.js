import nock from 'nock'; // eslint-disable-line
import packageJSON from '../package.json';
import convertObjectNumbersToStrings from '../src/utils/convertObjectNumbersToStrings';
import convertObjectStringNumbersToNumbers from '../src/utils/convertObjectStringNumbersToNumbers';

const { testURL } = packageJSON.jest;

const success = ({ request, response }) => {
  nock(testURL)
    .post('/', convertObjectNumbersToStrings(request))
    .reply(200, convertObjectStringNumbersToNumbers(response));
};

const error = ({ request }) => {
  nock(testURL)
    .post('/', convertObjectNumbersToStrings(request))
    .replyWithError('Error!');
};

export default {
  success,
  error,
};
