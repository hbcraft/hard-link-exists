import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';

type IFileName = string;
export interface IFileHash {
  [type: string]: string;
}
type IFileHashMap = Map<IFileName, IFileHash>;
const fileHashMap: IFileHashMap = new Map();

/**
 * 获取文件的摘要
 *
 * @param file 文件的绝对路径
 * @param type 摘要算法
 * @returns 文件的摘要
 */
export function getFileHash(file: string, type = 'md5'): Promise<string> {
  const fileHash = fileHashMap.get(file);
  if (fileHash && fileHash[type]) {
    return Promise.resolve(fileHash[type]);
  }
  return new Promise((resolve) => {
    const rs = createReadStream(file);
    const hash = createHash(type);
    rs.on('data', (chunk) => {
      hash.update(chunk);
    });
    rs.on('end', () => {
      const fileHashStr = hash.digest('hex');
      if (fileHash) {
        const newFileHash: IFileHash = Object.assign({}, fileHash, {
          [type]: fileHashStr,
        });
        fileHashMap.set(file, newFileHash);
      } else {
        fileHashMap.set(file, { [type]: fileHashStr });
      }
      resolve(fileHashStr);
    });
  });
}
