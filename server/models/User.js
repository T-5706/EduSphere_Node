import mongoose from 'mongoose';

// A schema describes the fields that each user document can contain.
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  program: { type: String, default: 'Student' },
  profilePicture: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
