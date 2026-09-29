USE event_pulse_system;

-- 1. List all published events with seats remaining, newest first
SELECT title, start_datetime, seats_left, status
FROM vw_event_summary
WHERE status = 'PUBLISHED'
ORDER BY start_datetime;

-- 2. Total confirmed registrations per event (JOIN + GROUP BY)
SELECT e.title, COUNT(r.registration_id) AS total_confirmed
FROM Events e
JOIN Registrations r ON e.event_id = r.event_id
WHERE r.status = 'CONFIRMED'
GROUP BY e.title
ORDER BY total_confirmed DESC;

-- 3. Revenue generated per event (aggregate on Payments)
SELECT e.title, SUM(p.amount) AS total_revenue
FROM Events e
JOIN Registrations r ON e.event_id = r.event_id
JOIN Payments p ON r.registration_id = p.registration_id
WHERE p.payment_status = 'SUCCESS'
GROUP BY e.title;

-- 4. Average feedback rating per event (HAVING clause)
SELECT e.title, ROUND(AVG(f.rating), 2) AS avg_rating, COUNT(f.feedback_id) AS num_reviews
FROM Events e
JOIN Feedback f ON e.event_id = f.event_id
GROUP BY e.title
HAVING AVG(f.rating) >= 4.0;

-- 5. Attendees who registered but never checked in (LEFT JOIN)
SELECT u.full_name, e.title
FROM Registrations r
JOIN Users u ON r.user_id = u.user_id
JOIN Events e ON r.event_id = e.event_id
LEFT JOIN Tickets t ON r.registration_id = t.registration_id
WHERE r.status = 'CONFIRMED' AND (t.checked_in = FALSE OR t.checked_in IS NULL);

-- 6. Most popular category by number of registrations (subquery + JOIN)
SELECT c.category_name, COUNT(r.registration_id) AS registration_count
FROM Categories c
JOIN Events e ON c.category_id = e.category_id
JOIN Registrations r ON e.event_id = r.event_id
GROUP BY c.category_name
ORDER BY registration_count DESC
LIMIT 1;

-- 7. Organizers who have hosted more than 1 event (subquery in HAVING)
SELECT u.full_name AS organizer, COUNT(e.event_id) AS events_hosted
FROM Users u
JOIN Organizer_Profiles op ON u.user_id = op.organizer_id
JOIN Events e ON op.organizer_id = e.organizer_id
GROUP BY u.full_name
HAVING COUNT(e.event_id) > 1;

-- 8. Events happening in the next 30 days at venues with capacity > 200
SELECT e.title, v.venue_name, v.capacity, e.start_datetime
FROM Events e
JOIN Venues v ON e.venue_id = v.venue_id
WHERE v.capacity > 200
  AND e.start_datetime BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 30 DAY);

-- 9. Users who have never registered for any event (NOT IN subquery)
SELECT full_name, email
FROM Users
WHERE role = 'ATTENDEE'
  AND user_id NOT IN (SELECT DISTINCT user_id FROM Registrations);

-- 10. Call the stored procedure to register a user (example usage)
-- CALL sp_register_for_event(1, 6, @result);
-- SELECT @result;
