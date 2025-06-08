import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const router = express.Router();

import User from '../models/user.js';

const JWT_SECRET = process.env.JWT_SECRET;

// Middleware
function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// Save a meme
router.post('/save', auth, async (req, res) => {
  const { url, caption } = req.body;
  const user = await User.findById(req.userId);
  user.memes.push({ url, caption });
  await user.save();
  res.json({ message: 'Meme saved' });
});

// Get saved memes
router.get('/my', auth, async (req, res) => {
  const user = await User.findById(req.userId);
  res.json({ memes: user.memes });
});

export default router;
