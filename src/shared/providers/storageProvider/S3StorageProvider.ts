import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import uploadConfig from '@config/upload';
import mime from 'mime';
import fs from 'node:fs';
import path from 'node:path';

class S3StorageProvider {
  private client;

  constructor() {
    this.client = new S3Client({ region: 'us-east-1' });
  }

  public async saveFile(file: string): Promise<string> {
    const originalPath = path.resolve(uploadConfig.tmpFolder, file);

    const contentType = mime.getType(originalPath);

    if (!contentType) {
      throw new Error('File not found');
    }

    const fileContent = await fs.promises.readFile(originalPath);

    const command = new PutObjectCommand({
      Bucket: uploadConfig.config.aws.bucket,
      Key: file,
      ACL: 'public-read',
      Body: fileContent,
      ContentType: contentType,
    });

    await this.client.send(command);

    await fs.promises.unlink(originalPath);

    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: uploadConfig.config.aws.bucket,
      Key: file,
    });

    await this.client.send(command);
  }
}

export default S3StorageProvider;
