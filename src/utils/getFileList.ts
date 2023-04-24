import { readdir, stat } from 'node:fs/promises';
import { access } from 'node:fs/promises';
import path from 'node:path';

export interface IGetFileListOptions {
  minSize: number;
  maxSize: number;
  includeExt: string[];
  excludeExt: string[];
  depth: number;
}

const defaultGetFileListOptions: IGetFileListOptions = {
  minSize: 0,
  maxSize: Infinity,
  includeExt: [],
  excludeExt: [],
  depth: Infinity,
};

/**
 * 获取文件夹中的文件列表,返回的路径为绝对路径
 *
 * @param dir 目标目录
 * @param options 过滤选项
 * @returns 文件夹中的文件列表
 */
export async function getFileList(
  dir: string,
  options: Partial<IGetFileListOptions> = {},
): Promise<string[]> {
  const option = Object.assign({}, defaultGetFileListOptions, options);
  if (option.depth === 0) {
    option.depth = Infinity;
  }
  const absoluteDir = path.resolve(dir);
  try {
    await access(absoluteDir);
  } catch (error) {
    return [];
  }
  const dirStat = await stat(absoluteDir);
  if (!dirStat.isDirectory()) {
    throw new Error(`${dir} is not directory!`);
  }
  const files = (await readdir(absoluteDir)).map((file) =>
    path.resolve(dir, file),
  );
  const res: string[] = [];
  for (const file of files) {
    const fileStat = await stat(file);
    if (fileStat.isDirectory()) {
      if (option.depth > 1) {
        res.push(
          ...(await getFileList(
            file,
            Object.assign({}, option, { depth: option.depth - 1 }),
          )),
        );
      }
    } else {
      const ext = path.extname(file);
      if (
        (option.includeExt.length > 0 && !option.includeExt.includes(ext)) ||
        option.excludeExt.includes(ext)
      ) {
        continue;
      }
      if (fileStat.size >= option.minSize && fileStat.size <= option.maxSize) {
        res.push(file);
      }
    }
  }
  return res;
}
