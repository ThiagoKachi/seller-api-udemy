import multer from 'multer';
import crypto from 'node:crypto';
import path from 'node:path';

interface IUploadConfig {
  driver: 's3' | 'disk';
  directory: string;
  tmpFolder: string;
  multer: {
    storage: multer.StorageEngine;
  };
  config: {
    aws: {
      bucket: string;
    };
  };
}

const uploadFolder = path.resolve(__dirname, '..', '..', 'uploads');
const tmpFolder = path.resolve(__dirname, '..', '..', 'temp');

export default {
  driver: process.env.STORAGE_DRIVER,
  directory: uploadFolder,
  tmpFolder,
  multer: {
    storage: multer.diskStorage({
      destination: tmpFolder,
      filename(request, file, callback) {
        const fileHash = crypto.randomBytes(10).toString('hex');
        const fileName = `${fileHash}-${file.originalname}`;

        return callback(null, fileName);
      }
    })
  },
  config: {
    aws: {
      bucket: 'seller-api'
    }
  }
} as IUploadConfig;
