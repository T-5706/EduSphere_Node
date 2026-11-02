import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import path from 'path';
import { unlink } from 'fs/promises';
import { fileURLToPath } from 'url';

const uploadsFolder = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../uploads');

function createToken(userId) {
  // JWT contains a payload, a signature and a header; never put passwords in it.
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

export async function register(req, res) {
  try {
    const { firstName, lastName, email, password, program } = req.body;
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'Fill in all required fields.' });
    }
    if (password.length < 8) return res.status(400).json({ message: 'Password must contain at least 8 characters.' });
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) return res.status(409).json({ message: 'An account with this email already exists.' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ firstName, lastName, email, password: hashedPassword, program });
    return res.status(201).json({ token: createToken(user._id), user: publicUser(user) });
  } catch (error) {
    return res.status(500).json({ message: 'Could not create account.' });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: (email || '').toLowerCase() });
    if (!user || !(await bcrypt.compare(password || '', user.password))) {
      return res.status(401).json({ message: 'Email or password is incorrect.' });
    }
    return res.json({ token: createToken(user._id), user: publicUser(user) });
  } catch (error) {
    return res.status(500).json({ message: 'Could not log in.' });
  }
}

export async function me(req, res) {
  const user = await User.findById(req.userId).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found.' });
  return res.json({ user });
}

export async function updateProfilePicture(req, res) {
  try {
    if (!req.file) return res.status(400).json({ message: 'Choose a profile picture first.' });

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const oldPicture = user.profilePicture;
    user.profilePicture = `/uploads/${req.file.filename}`;
    await user.save();

    // Remove the previous uploaded picture after the new one has been saved.
    if (oldPicture && oldPicture.startsWith('/uploads/')) {
      const oldFile = path.basename(oldPicture);
      if (oldFile && oldFile !== path.basename(user.profilePicture)) {
        await unlink(path.join(uploadsFolder, oldFile)).catch(() => {});
      }
    }

    return res.json({ user: publicUser(user), message: 'Profile picture updated.' });
  } catch (error) {
    return res.status(500).json({ message: 'Could not update profile picture.' });
  }
}

function publicUser(user) {
  return {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    program: user.program,
    profilePicture: user.profilePicture || ''
  };
}
