import { stat } from 'node:fs/promises';
import { getFileHash } from './getFileHash';

/**
 * 判断两个文件的内容是否相同
 * 如果两个文件是硬链接的,返回true
 *
 * @param file1 文件1的路径
 * @param file2 文件2的路径
 * @returns 文件内容是否相同
 */
export async function isSameFile(
  file1: string,
  file2: string,
): Promise<boolean> {
  const stat1 = await stat(file1);
  const stat2 = await stat(file2);
  if (stat1.size !== stat2.size) return false;
  if (stat1.ino === stat2.ino) {
    return true;
  }
  const hash1 = await getFileHash(file1);
  const hash2 = await getFileHash(file2);
  return hash1 === hash2;
}
