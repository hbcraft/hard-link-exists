import { SOURCE_DIR, TARGET_DIR } from './config';
import { hardLinkExists } from './utils';

hardLinkExists(SOURCE_DIR, TARGET_DIR).then(() => {
  console.log('Hard link Done!');
});
