import StudySession from '../models/StudySession.js';

export async function listSessions(req, res) {
  const sessions = await StudySession.find({ user: req.userId }).sort({ createdAt: -1 }).limit(60);
  res.json(sessions);
}

export async function createSession(req, res) {
  const minutes = Number(req.body.minutes);
  if (!Number.isFinite(minutes) || minutes < 1) return res.status(400).json({ message: 'Minutes must be at least 1.' });
  const session = await StudySession.create({ user: req.userId, minutes });
  res.status(201).json(session);
}
