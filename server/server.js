import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import sessionRoutes from './routes/sessionRoutes.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;
const here = path.dirname(fileURLToPath(import.meta.url));

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json()); // Parse JSON request bodies before route handlers run.
app.use('/uploads', express.static(path.join(here, 'uploads')));
app.get('/api/health', (req, res) => res.json({ message: 'EduSphere API is running.' }));
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/sessions', sessionRoutes);
app.use((err, req, res, next) => {
  console.error(err.message);
  if (err.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ message: 'File size must be 5 MB or less.' });
  if (err.message === 'Only JPG, PNG, and WebP images are allowed.') return res.status(400).json({ message: err.message });
  if (err.name === 'MulterError') return res.status(400).json({ message: err.message });
  res.status(500).json({ message: 'Something went wrong on the server.' });
});

// Start listening only after MongoDB connects successfully.
connectDB().then(() => app.listen(port, () => console.log(`EduSphere API listening on port ${port}`)));
