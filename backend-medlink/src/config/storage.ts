import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { env } from './environment';

export interface StoredObject {
  key: string;
  url: string;
  size: number;
  mimeType: string;
  checksum: string;
}

/**
 * Storage abstraction. The local driver keeps binaries on disk and MongoDB only
 * stores metadata + the storage key. Swap in an S3/GCS driver by implementing
 * the same three methods.
 */
export interface StorageDriver {
  put(buffer: Buffer, originalName: string, mimeType: string, folder: string): Promise<StoredObject>;
  get(key: string): Promise<Buffer>;
  remove(key: string): Promise<void>;
}

class LocalStorageDriver implements StorageDriver {
  constructor(private readonly baseDir: string) {
    fs.mkdirSync(this.baseDir, { recursive: true });
  }

  private resolve(key: string): string {
    const full = path.resolve(this.baseDir, key);
    if (!full.startsWith(this.baseDir)) throw new Error('Invalid storage key');
    return full;
  }

  async put(buffer: Buffer, originalName: string, mimeType: string, folder: string): Promise<StoredObject> {
    const ext = path.extname(originalName) || '';
    const key = path.posix.join(folder, `${Date.now()}-${crypto.randomUUID()}${ext}`);
    const full = this.resolve(key);
    await fs.promises.mkdir(path.dirname(full), { recursive: true });
    await fs.promises.writeFile(full, buffer);
    return {
      key,
      url: `${env.storage.publicBaseUrl}/${encodeURIComponent(key)}`,
      size: buffer.length,
      mimeType,
      checksum: crypto.createHash('sha256').update(buffer).digest('hex'),
    };
  }

  async get(key: string): Promise<Buffer> {
    return fs.promises.readFile(this.resolve(key));
  }

  async remove(key: string): Promise<void> {
    await fs.promises.rm(this.resolve(key), { force: true });
  }
}

export const storage: StorageDriver = new LocalStorageDriver(env.storage.localDir);
