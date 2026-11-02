import multer from 'multer';
import path from 'path';
import { randomUUID } from 'crypto';
import { fileURLToPath } from 'url';

const here = path.dirname(fileURLToPath(import.meta.url));
const uploadFolder = path.resolve(here, '../uploads');

const storage = multer.diskStorage({
  destination: (req, file, callback) => callback(null, uploadFolder),
  filename: (req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    callback(null, `${randomUUID()}${extension}`);
  }
});

function imageOnly(req, file, callback) {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.mimetype)) {
    return callback(new Error('Only JPG, PNG, and WebP images are allowed.'));
  }
  callback(null, true);
}

const upload = multer({
  storage,
  fileFilter: imageOnly,
  limits: { fileSize: 5 * 1024 * 1024 }
});

export default upload;
