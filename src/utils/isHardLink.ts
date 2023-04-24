import { lstat } from 'node:fs/promises';

/**
 * 判断两个文件是否为硬链接
 *
 * @param file1 文件一的绝对路径
 * @param file2 文件二的绝对路径
 * @returns 两个文件是否为硬链接
 */
export async function isHardLink(file1: string, file2: string) {
  return (await lstat(file1)).ino === (await lstat(file2)).ino;
}
