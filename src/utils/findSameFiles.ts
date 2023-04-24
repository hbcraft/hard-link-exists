import { IGetFileListOptions, getFileList } from './getFileList';
import { isHardLink } from './isHardLink';
import { isSameFile } from './isSameFile';

export interface IFindSameFilesOptions extends IGetFileListOptions {
  skipHardLinked: boolean;
}
export async function findSameFiles(
  sourceDir: string,
  targetDir: string,
  option: Partial<IFindSameFilesOptions> = {},
) {
  if (option.skipHardLinked == null) {
    option.skipHardLinked = true;
  }
  const sameFilesMap = new Map<string, string>();
  const sourceFiles = await getFileList(sourceDir, option);
  const targetFiles = await getFileList(targetDir, option);
  for (const targetFile of targetFiles) {
    const sourceFile = sourceFiles.find(
      async (sourceFile) => await isSameFile(sourceFile, targetFile),
    );
    if (sourceFile) {
      if (option.skipHardLinked && (await isHardLink(sourceFile, targetFile))) {
        continue;
      }
      sameFilesMap.set(targetFile, sourceFile);
    }
  }
  return sameFilesMap;
}
