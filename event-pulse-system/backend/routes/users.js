const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET all users (id, name, role only — never expose password_hash)
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT user_id, full_name, role FROM Users ORDER BY full_name'
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
