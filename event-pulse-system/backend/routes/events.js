const express = require('express');
const router = express.Router();

const pool = require('../db');
const { requireAuth } = require('../middleware/auth');

// ============================================================
// GET ALL EVENTS
// ============================================================

router.get('/', async (req, res) => {

  try {

    const [rows] = await pool.query(
      `SELECT *
       FROM vw_event_summary
       ORDER BY start_datetime`
    );

    res.json(rows);

  } catch (err) {

    console.error(
      'GET /events error:',
      err
    );

    res.status(500).json({
      error: err.message,
    });
  }
});

// ============================================================
// GET SINGLE EVENT
// ============================================================

router.get('/:id', async (req, res) => {

  try {

    const [event] =
      await pool.query(
        `SELECT *
         FROM Events
         WHERE event_id = ?`,
        [req.params.id]
      );

    if (event.length === 0) {

      return res.status(404).json({
        error: 'Event not found',
      });
    }

    const [sessions] =
      await pool.query(
        `SELECT *
         FROM Sessions
         WHERE event_id = ?
         ORDER BY start_time`,
        [req.params.id]
      );

    res.json({
      ...event[0],
      sessions,
    });

  } catch (err) {

    console.error(
      'GET /events/:id error:',
      err
    );

    res.status(500).json({
      error: err.message,
    });
  }
});

// ============================================================
// CREATE EVENT
// Only authenticated ORGANIZER / ADMIN
// ============================================================

router.post(
  '/',
  requireAuth,
  async (req, res) => {

    const {
      title,
      description,
      category_id,
      venue_id,
      start_datetime,
      end_datetime,
      max_attendees,
      ticket_price,
    } = req.body;

    // ----------------------------------------------------------
    // Validate required fields
    // ----------------------------------------------------------

    if (
      !title ||
      !category_id ||
      !venue_id ||
      !start_datetime ||
      !end_datetime ||
      !max_attendees
    ) {

      return res.status(400).json({
        error:
          'title, category_id, venue_id, start_datetime, end_datetime and max_attendees are required',
      });
    }

    // ----------------------------------------------------------
    // Only organizers/admins can create events
    // ----------------------------------------------------------

    if (
      req.user.role !== 'ORGANIZER' &&
      req.user.role !== 'ADMIN'
    ) {

      return res.status(403).json({
        error:
          'Only organizers and administrators can create events',
      });
    }

    try {

      let organizerId = null;

      // --------------------------------------------------------
      // ADMIN may optionally specify an organizer
      // --------------------------------------------------------

      if (
        req.user.role === 'ADMIN' &&
        req.body.organizer_id
      ) {

        organizerId =
          Number(req.body.organizer_id);

      } else {

        organizerId =
          Number(req.user.user_id);
      }

      // --------------------------------------------------------
      // Make sure organizer profile exists
      // --------------------------------------------------------

      const [organizerRows] =
        await pool.query(
          `SELECT organizer_id
           FROM Organizer_Profiles
           WHERE organizer_id = ?`,
          [organizerId]
        );

      if (
        organizerRows.length === 0
      ) {

        return res.status(400).json({
          error:
            'Organizer profile not found for this user',
        });
      }

      // --------------------------------------------------------
      // Insert event
      // --------------------------------------------------------

      const [result] =
        await pool.query(
          `INSERT INTO Events
          (
            title,
            description,
            category_id,
            venue_id,
            organizer_id,
            start_datetime,
            end_datetime,
            max_attendees,
            ticket_price,
            status
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'PUBLISHED')`,
          [
            title,
            description || null,
            category_id,
            venue_id,
            organizerId,
            start_datetime,
            end_datetime,
            max_attendees,
            ticket_price || 0,
          ]
        );

      res.status(201).json({
        event_id: result.insertId,
        message:
          'Event created successfully',
      });

    } catch (err) {

      console.error(
        'POST /events error:',
        err
      );

      res.status(500).json({
        error: err.message,
      });
    }
  }
);

module.exports = router;