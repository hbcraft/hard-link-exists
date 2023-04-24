import { link, unlink } from 'fs/promises';

export async function hardLinkFile(sourceFile: string, targetFile: string) {
  console.log(`hardLinkFile ${targetFile} => ${sourceFile}`);
  await unlink(targetFile);
  console.log('unlink targetFile success!');
  await link(sourceFile, targetFile);
  console.log('hard link success!');
}
