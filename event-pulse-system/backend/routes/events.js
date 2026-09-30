
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
    console.error('GET /events error:', err);

    res.status(500).json({
      error: 'Failed to retrieve events',
    });
  }
});

// ============================================================
// GET SINGLE EVENT
// ============================================================

router.get('/:id', async (req, res) => {
  try {
    const eventId = Number(req.params.id);

    if (!Number.isInteger(eventId) || eventId <= 0) {
      return res.status(400).json({
        error: 'Invalid event ID',
      });
    }

    const [events] = await pool.query(
      `SELECT *
       FROM Events
       WHERE event_id = ?`,
      [eventId]
    );

    if (events.length === 0) {
      return res.status(404).json({
        error: 'Event not found',
      });
    }

    const [sessions] = await pool.query(
      `SELECT *
       FROM Sessions
       WHERE event_id = ?
       ORDER BY start_time`,
      [eventId]
    );

    res.json({
      ...events[0],
      sessions,
    });
  } catch (err) {
    console.error('GET /events/:id error:', err);

    res.status(500).json({
      error: 'Failed to retrieve event',
    });
  }
});

// ============================================================
// CREATE EVENT
// Only authenticated ORGANIZER / ADMIN
// ============================================================

router.post('/', requireAuth, async (req, res) => {
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

  // Enforce role-based access on the server.
  if (
    req.user.role !== 'ORGANIZER' &&
    req.user.role !== 'ADMIN'
  ) {
    return res.status(403).json({
      error: 'Only organizers and administrators can create events',
    });
  }

  // Validate required fields.
  if (
    !title ||
    !String(title).trim() ||
    !category_id ||
    !venue_id ||
    !start_datetime ||
    !end_datetime ||
    max_attendees == null ||
    Number(max_attendees) <= 0
  ) {
    return res.status(400).json({
      error:
        'title, category_id, venue_id, start_datetime, end_datetime and a positive max_attendees are required',
    });
  }

  const categoryId = Number(category_id);
  const venueId = Number(venue_id);
  const capacity = Number(max_attendees);
  const price = ticket_price == null || ticket_price === ''
    ? 0
    : Number(ticket_price);

  if (
    !Number.isInteger(categoryId) ||
    categoryId <= 0 ||
    !Number.isInteger(venueId) ||
    venueId <= 0 ||
    !Number.isInteger(capacity) ||
    capacity <= 0 ||
    !Number.isFinite(price) ||
    price < 0
  ) {
    return res.status(400).json({
      error: 'Invalid category, venue, capacity or ticket price',
    });
  }

  const startDate = new Date(start_datetime);
  const endDate = new Date(end_datetime);

  if (
    Number.isNaN(startDate.getTime()) ||
    Number.isNaN(endDate.getTime()) ||
    endDate <= startDate
  ) {
    return res.status(400).json({
      error: 'The event end time must be later than its start time',
    });
  }

  try {
    const currentUserId = Number(req.user.user_id);
    let organizerId = currentUserId;

    if (!Number.isInteger(currentUserId) || currentUserId <= 0) {
      return res.status(401).json({
        error: 'Invalid authenticated user',
      });
    }

    if (req.user.role === 'ORGANIZER') {
      // Organizers must have a valid organizer profile.
      const [profiles] = await pool.query(
        `SELECT organizer_id
         FROM Organizer_Profiles
         WHERE organizer_id = ?`,
        [currentUserId]
      );

      if (profiles.length === 0) {
        return res.status(403).json({
          error: 'An organizer profile is required to host events',
        });
      }

      // Ignore any organizer_id supplied in the request.
      // Organizers can only create events under their own identity.
      organizerId = currentUserId;
    }

    if (req.user.role === 'ADMIN') {
      // By default, an admin hosts the event under their own user ID.
      organizerId = currentUserId;

      // An admin may optionally assign an event to an existing organizer.
      if (req.body.organizer_id != null && req.body.organizer_id !== '') {
        const requestedOrganizerId = Number(req.body.organizer_id);

        if (
          !Number.isInteger(requestedOrganizerId) ||
          requestedOrganizerId <= 0
        ) {
          return res.status(400).json({
            error: 'Invalid organizer_id',
          });
        }

        const [profiles] = await pool.query(
          `SELECT organizer_id
           FROM Organizer_Profiles
           WHERE organizer_id = ?`,
          [requestedOrganizerId]
        );

        if (profiles.length === 0) {
          return res.status(400).json({
            error: 'The selected user does not have an organizer profile',
          });
        }

        organizerId = requestedOrganizerId;
      }
    }

    // Insert event. The organizer_id references a Users record.
    // Admins do not need an Organizer_Profiles record when hosting
    // under their own user ID.
    const [result] = await pool.query(
      `INSERT INTO Events (
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
        String(title).trim(),
        description ? String(description).trim() : null,
        categoryId,
        venueId,
        organizerId,
        start_datetime,
        end_datetime,
        capacity,
        price,
      ]
    );

    return res.status(201).json({
      event_id: result.insertId,
      organizer_id: organizerId,
      message: 'Event created successfully',
    });
  } catch (err) {
    console.error('POST /events error:', err);

    return res.status(500).json({
      error: 'Failed to create event',
    });
  }
});

module.exports = router;