import { hardLinkFile } from './hardLinkFile';

export async function hardLinkFilesMap(sameFilesMap: Map<string, string>) {
  const targetFiles = sameFilesMap.keys();
  for (const targetFile of targetFiles) {
    const sourceFile = sameFilesMap.get(targetFile) as string;
    await hardLinkFile(sourceFile, targetFile);
    console.log(`${targetFile} hardLink to ${sourceFile} success!`);
  }
}
