USE event_pulse_system;

-- ------------------------------------------------------------
-- USERS  (passwords are pre-hashed placeholders — replace via app)
-- ------------------------------------------------------------
INSERT INTO Users (full_name, email, phone, password_hash, role) VALUES
('Gurshant Singh',   'gurshant@cgc.edu.in',  '9876500001', 'hash1', 'ADMIN'),
('Priya Sharma',     'priya@cgc.edu.in',     '9876500002', 'hash2', 'ORGANIZER'),
('Rohit Verma',      'rohit@cgc.edu.in',     '9876500003', 'hash3', 'ORGANIZER'),
('Ananya Gupta',     'ananya@cgc.edu.in',    '9876500004', 'hash4', 'ATTENDEE'),
('Karan Mehta',      'karan@cgc.edu.in',     '9876500005', 'hash5', 'ATTENDEE'),
('Simran Kaur',      'simran@cgc.edu.in',    '9876500006', 'hash6', 'ATTENDEE'),
('Devansh Rao',      'devansh@cgc.edu.in',   '9876500007', 'hash7', 'ATTENDEE'),
('Neha Joshi',       'neha@cgc.edu.in',      '9876500008', 'hash8', 'ATTENDEE');

INSERT INTO Organizer_Profiles (organizer_id, organization_name, designation, verified) VALUES
(2, 'CGC Tech Society', 'President', TRUE),
(3, 'CGC Cultural Club', 'Event Head', TRUE);

-- ------------------------------------------------------------
-- VENUES
-- ------------------------------------------------------------
INSERT INTO Venues (venue_name, address, city, capacity, contact_no) VALUES
('Main Auditorium',   'CGC Campus, Sector 71', 'Mohali', 500, '9988000001'),
('Seminar Hall B',    'CGC Campus, Sector 71', 'Mohali', 120, '9988000002'),
('Open Air Theatre',  'CGC Campus, Sector 71', 'Mohali', 800, '9988000003');

-- ------------------------------------------------------------
-- CATEGORIES
-- ------------------------------------------------------------
INSERT INTO Categories (category_name, description) VALUES
('Technical',   'Hackathons, coding contests, tech talks'),
('Cultural',    'Music, dance, drama events'),
('Workshop',    'Hands-on skill-building sessions'),
('Sports',      'Inter/intra college sports events');

-- ------------------------------------------------------------
-- EVENTS
-- ------------------------------------------------------------
INSERT INTO Events (title, description, category_id, venue_id, organizer_id, start_datetime, end_datetime, max_attendees, ticket_price, status) VALUES
('CodeStorm Hackathon 2026', '24-hour hackathon', 1, 1, 2, '2026-10-10 09:00:00', '2026-10-11 09:00:00', 200, 0.00, 'PUBLISHED'),
('Sur Sangam Music Fest',    'Annual music festival', 2, 3, 3, '2026-10-15 17:00:00', '2026-10-15 21:00:00', 600, 150.00, 'PUBLISHED'),
('AI/ML Bootcamp',           'Hands-on ML workshop', 3, 2, 2, '2026-09-28 10:00:00', '2026-09-28 16:00:00', 80, 50.00, 'COMPLETED');

-- ------------------------------------------------------------
-- SESSIONS
-- ------------------------------------------------------------
INSERT INTO Sessions (event_id, session_title, speaker_name, start_time, end_time, room_no) VALUES
(1, 'Opening Ceremony', 'Priya Sharma', '2026-10-10 09:00:00', '2026-10-10 09:30:00', 'Main Hall'),
(3, 'Intro to Neural Networks', 'Dr. Anil Kapoor', '2026-09-28 10:00:00', '2026-09-28 12:00:00', 'Seminar B');

-- ------------------------------------------------------------
-- REGISTRATIONS
-- ------------------------------------------------------------
INSERT INTO Registrations (event_id, user_id, status) VALUES
(1, 4, 'CONFIRMED'),
(1, 5, 'CONFIRMED'),
(2, 4, 'CONFIRMED'),
(2, 6, 'CONFIRMED'),
(3, 5, 'CONFIRMED'),
(3, 7, 'CANCELLED'),
(3, 8, 'CONFIRMED');

-- ------------------------------------------------------------
-- TICKETS (one per CONFIRMED registration)
-- ------------------------------------------------------------
INSERT INTO Tickets (registration_id, ticket_code, checked_in) VALUES
(1, 'TCK-0001', TRUE),
(2, 'TCK-0002', FALSE),
(3, 'TCK-0003', TRUE),
(4, 'TCK-0004', TRUE),
(5, 'TCK-0005', TRUE),
(7, 'TCK-0007', TRUE);

-- ------------------------------------------------------------
-- PAYMENTS (only for paid events)
-- ------------------------------------------------------------
INSERT INTO Payments (registration_id, amount, payment_method, payment_status) VALUES
(3, 150.00, 'UPI', 'SUCCESS'),
(4, 150.00, 'CARD', 'SUCCESS'),
(5, 50.00, 'UPI', 'SUCCESS'),
(7, 50.00, 'CASH', 'SUCCESS');

-- ------------------------------------------------------------
-- FEEDBACK (only for the completed event)
-- ------------------------------------------------------------
INSERT INTO Feedback (event_id, user_id, rating, comments) VALUES
(3, 5, 5, 'Excellent hands-on session, learned a lot!'),
(3, 8, 4, 'Good content, could use more time.');

-- ------------------------------------------------------------
-- NOTIFICATIONS
-- ------------------------------------------------------------
INSERT INTO Notifications (user_id, event_id, message) VALUES
(4, 1, 'You are registered for CodeStorm Hackathon 2026'),
(5, 3, 'Your feedback for AI/ML Bootcamp is awaited'),
(6, 2, 'Sur Sangam Music Fest starts in 3 days!');
