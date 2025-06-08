import express from 'express';
const router = express.Router();
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

import User from '../models/user.js';

const JWT_SECRET = process.env.JWT_SECRET;

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔍 Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // 🔍 Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // ✅ Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 🔐 Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 📦 Create and save the user
    const newUser = new User({
      email: normalizedEmail,
      password: hashedPassword,
    });

    await newUser.save();

    // 🟢 Respond success
    res.status(201).json({ message: 'User registered successfully' });

  } catch (error) {
    console.error(error);

    // Handle duplicate key error edge case gracefully
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    res.status(500).json({ message: 'Server error' });
  }
});



// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '2d' });
  res.json({ token });
});

export default router;
