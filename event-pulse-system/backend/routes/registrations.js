const express = require('express');
const router = express.Router();
const pool = require('../db');
const { requireAuth } = require('../middleware/auth');

// POST register the logged-in user for an event (calls sp_register_for_event)
router.post('/', requireAuth, async (req, res) => {
  const { event_id } = req.body;
  const user_id = req.user.user_id;

  try {
    await pool.query('CALL sp_register_for_event(?, ?, @result)', [event_id, user_id]);
    const [[{ '@result': result }]] = await pool.query('SELECT @result');
    res.json({ message: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET the logged-in user's own registrations (ticket + payment status)
router.get('/me', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM vw_my_registrations WHERE user_id = ?',
      [req.user.user_id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET a user's registrations by id — kept for admin/back-office use, self or ADMIN only
router.get('/user/:userId', requireAuth, async (req, res) => {
  const requestedId = Number(req.params.userId);
  if (req.user.user_id !== requestedId && req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'You can only view your own registrations' });
  }
  try {
    const [rows] = await pool.query('SELECT * FROM vw_my_registrations WHERE user_id = ?', [requestedId]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
