const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET all events (from view — includes seats_left)
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM vw_event_summary ORDER BY start_datetime');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single event with its sessions
router.get('/:id', async (req, res) => {
  try {
    const [event] = await pool.query('SELECT * FROM Events WHERE event_id = ?', [req.params.id]);
    const [sessions] = await pool.query('SELECT * FROM Sessions WHERE event_id = ?', [req.params.id]);
    if (event.length === 0) return res.status(404).json({ error: 'Event not found' });
    res.json({ ...event[0], sessions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create a new event
router.post('/', async (req, res) => {
  const { title, description, category_id, venue_id, organizer_id,
          start_datetime, end_datetime, max_attendees, ticket_price } = req.body;
  try {
    const [result] = await pool.query(
      `INSERT INTO Events (title, description, category_id, venue_id, organizer_id,
       start_datetime, end_datetime, max_attendees, ticket_price, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'PUBLISHED')`,
      [title, description, category_id, venue_id, organizer_id,
       start_datetime, end_datetime, max_attendees, ticket_price]
    );
    res.status(201).json({ event_id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
