import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { protect } from '../middleware/auth.js';
import { listTasks, createTask, updateTask, deleteTask } from '../controllers/taskController.js';
const router = Router();
const here = path.dirname(fileURLToPath(import.meta.url));
const uploadFolder = path.resolve(here, '../uploads');
const storage = multer.diskStorage({
  destination: (req, file, callback) => callback(null, uploadFolder),
  filename: (req, file, callback) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    callback(null, `${Date.now()}-${safeName}`);
  }
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });
router.use(protect);
router.get('/', listTasks);
router.post('/', upload.single('file'), createTask);
router.patch('/:id', updateTask);
router.delete('/:id', deleteTask);
export default router;
