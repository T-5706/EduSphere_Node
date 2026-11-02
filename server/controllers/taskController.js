import Task from '../models/Task.js';

export async function listTasks(req, res) {
  const tasks = await Task.find({ user: req.userId }).sort({ createdAt: -1 });
  res.json(tasks);
}

export async function createTask(req, res) {
  const { title, subject, dueDate, priority, kind } = req.body;
  if (!title || !title.trim()) return res.status(400).json({ message: 'Task title is required.' });
  const task = await Task.create({
    user: req.userId, title: title.trim(), subject, dueDate, priority,
    kind: kind === 'assignment' ? 'assignment' : 'task',
    fileName: req.file ? req.file.originalname : '',
    filePath: req.file ? `/uploads/${req.file.filename}` : ''
  });
  res.status(201).json(task);
}

export async function updateTask(req, res) {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.userId }, req.body,
    { new: true, runValidators: true }
  );
  if (!task) return res.status(404).json({ message: 'Task not found.' });
  res.json(task);
}

export async function deleteTask(req, res) {
  const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.userId });
  if (!task) return res.status(404).json({ message: 'Task not found.' });
  res.json({ message: 'Task deleted.' });
}
