import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  subject: { type: String, default: 'General' },
  dueDate: { type: String, default: '' },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  completed: { type: Boolean, default: false },
  kind: { type: String, enum: ['task', 'assignment'], default: 'task' },
  fileName: { type: String, default: '' },
  filePath: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model('Task', taskSchema);
