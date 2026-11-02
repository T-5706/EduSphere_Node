import mongoose from 'mongoose';

const studySessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  minutes: { type: Number, required: true, min: 1 },
  sessionDate: { type: String, default: () => new Date().toISOString().slice(0, 10) }
}, { timestamps: true });

export default mongoose.model('StudySession', studySessionSchema);
