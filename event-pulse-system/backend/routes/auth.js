const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const pool = require('../db');
const { JWT_SECRET } = require('../middleware/auth');

function signToken(user) {
  return jwt.sign(
    { user_id: user.user_id, full_name: user.full_name, role: user.role },
    JWT_SECRET,
    { expiresIn: '2h' }
  );
}

// POST /api/auth/signup — creates a new ATTENDEE account
router.post('/signup', async (req, res) => {
  const { full_name, email, password, phone } = req.body;

  if (!full_name || !email || !password) {
    return res.status(400).json({ error: 'full_name, email and password are required' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  try {
    const [existing] = await pool.query('SELECT user_id FROM Users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'An account with that email already exists' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      `INSERT INTO Users (full_name, email, phone, password_hash, role)
       VALUES (?, ?, ?, ?, 'ATTENDEE')`,
      [full_name, email, phone || null, password_hash]
    );

    const user = { user_id: result.insertId, full_name, role: 'ATTENDEE' };
    res.status(201).json({ token: signToken(user), user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required' });
  }

  try {
    const [rows] = await pool.query(
      'SELECT user_id, full_name, role, password_hash FROM Users WHERE email = ?',
      [email]
    );
    const user = rows[0];
    if (!user) {
      return res.status(401).json({ error: 'Incorrect email or password' });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Incorrect email or password' });
    }

    const payload = { user_id: user.user_id, full_name: user.full_name, role: user.role };
    res.json({ token: signToken(payload), user: payload });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/auth/me — returns the current user from their token (used to restore session)
router.get('/me', require('../middleware/auth').requireAuth, (req, res) => {
  res.json(req.user);
});

module.exports = router;
