import { findSameFiles } from './findSameFiles';
import { hardLinkFilesMap } from './hardLinkFilesMap';

export async function hardLinkExists(sourceDir: string, targetDir: string) {
  console.time('main');
  const sameFilesMap = await findSameFiles(sourceDir, targetDir);
  await hardLinkFilesMap(sameFilesMap);
  console.timeEnd('main');
}
