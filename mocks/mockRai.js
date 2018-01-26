import Rai from '../src/Rai';
import packageJSON from '../package.json';

const { testURL } = packageJSON.jest;

export default new Rai(testURL);
