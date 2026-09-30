USE event_pulse_system;

START TRANSACTION;

-- ============================================================
-- EVENT PULSE SYSTEM — DATA EXPANSION
-- ============================================================
-- IMPORTANT:
-- 1. Does NOT delete existing data.
-- 2. Uses the password hash of an existing working account
--    for dataset accounts.
-- 3. Tickets are generated automatically by the trigger.
-- ============================================================


-- ============================================================
-- 1. GET A VALID PASSWORD HASH
-- ============================================================

SET @demo_hash = (
    SELECT password_hash
    FROM Users
    WHERE email = 'ananya@cgc.edu.in'
    LIMIT 1
);


-- ============================================================
-- 2. ADD ATTENDEES
-- ============================================================

INSERT INTO Users
(full_name, email, phone, password_hash, role)
VALUES
('Aarav Malhotra', 'aarav.malhotra@cgc.edu.in', '9876510001', @demo_hash, 'ATTENDEE'),
('Ishita Bansal', 'ishita.bansal@cgc.edu.in', '9876510002', @demo_hash, 'ATTENDEE'),
('Manav Arora', 'manav.arora@cgc.edu.in', '9876510003', @demo_hash, 'ATTENDEE'),
('Mehak Sethi', 'mehak.sethi@cgc.edu.in', '9876510004', @demo_hash, 'ATTENDEE'),
('Arjun Kapoor', 'arjun.kapoor@cgc.edu.in', '9876510005', @demo_hash, 'ATTENDEE'),
('Riya Khanna', 'riya.khanna@cgc.edu.in', '9876510006', @demo_hash, 'ATTENDEE'),
('Harshdeep Singh', 'harshdeep.singh@cgc.edu.in', '9876510007', @demo_hash, 'ATTENDEE'),
('Nandini Sharma', 'nandini.sharma@cgc.edu.in', '9876510008', @demo_hash, 'ATTENDEE'),
('Yuvraj Gill', 'yuvraj.gill@cgc.edu.in', '9876510009', @demo_hash, 'ATTENDEE'),
('Tanya Mehra', 'tanya.mehra@cgc.edu.in', '9876510010', @demo_hash, 'ATTENDEE'),
('Kabir Joshi', 'kabir.joshi@cgc.edu.in', '9876510011', @demo_hash, 'ATTENDEE'),
('Sanya Kapoor', 'sanya.kapoor@cgc.edu.in', '9876510012', @demo_hash, 'ATTENDEE'),
('Aditya Verma', 'aditya.verma@cgc.edu.in', '9876510013', @demo_hash, 'ATTENDEE'),
('Navya Arora', 'navya.arora@cgc.edu.in', '9876510014', @demo_hash, 'ATTENDEE'),
('Vivaan Sharma', 'vivaan.sharma@cgc.edu.in', '9876510015', @demo_hash, 'ATTENDEE'),
('Pihu Kaur', 'pihu.kaur@cgc.edu.in', '9876510016', @demo_hash, 'ATTENDEE'),
('Raghav Mehta', 'raghav.mehta@cgc.edu.in', '9876510017', @demo_hash, 'ATTENDEE'),
('Simranjeet Singh', 'simranjeet.singh@cgc.edu.in', '9876510018', @demo_hash, 'ATTENDEE'),
('Kavya Nair', 'kavya.nair@cgc.edu.in', '9876510019', @demo_hash, 'ATTENDEE'),
('Devika Rao', 'devika.rao@cgc.edu.in', '9876510020', @demo_hash, 'ATTENDEE');


-- ============================================================
-- 3. ADD ORGANIZERS
-- ============================================================

INSERT INTO Users
(full_name, email, phone, password_hash, role)
VALUES
('Vikram Ahuja', 'vikram.ahuja@cgc.edu.in', '9876520001', @demo_hash, 'ORGANIZER'),
('Aditi Sood', 'aditi.sood@cgc.edu.in', '9876520002', @demo_hash, 'ORGANIZER'),
('Kunal Bhatia', 'kunal.bhatia@cgc.edu.in', '9876520003', @demo_hash, 'ORGANIZER'),
('Jasleen Kaur', 'jasleen.kaur@cgc.edu.in', '9876520004', @demo_hash, 'ORGANIZER'),
('Nikhil Sharma', 'nikhil.sharma@cgc.edu.in', '9876520005', @demo_hash, 'ORGANIZER'),
('Pallavi Mehta', 'pallavi.mehta@cgc.edu.in', '9876520006', @demo_hash, 'ORGANIZER');


INSERT INTO Organizer_Profiles
(organizer_id, organization_name, designation, verified)
SELECT user_id, 'CGC Innovation Hub', 'Program Director', TRUE
FROM Users
WHERE email = 'vikram.ahuja@cgc.edu.in';

INSERT INTO Organizer_Profiles
(organizer_id, organization_name, designation, verified)
SELECT user_id, 'CGC Entrepreneurship Cell', 'Faculty Coordinator', TRUE
FROM Users
WHERE email = 'aditi.sood@cgc.edu.in';

INSERT INTO Organizer_Profiles
(organizer_id, organization_name, designation, verified)
SELECT user_id, 'CGC Sports Council', 'Sports Coordinator', TRUE
FROM Users
WHERE email = 'kunal.bhatia@cgc.edu.in';

INSERT INTO Organizer_Profiles
(organizer_id, organization_name, designation, verified)
SELECT user_id, 'CGC Literary Society', 'President', TRUE
FROM Users
WHERE email = 'jasleen.kaur@cgc.edu.in';

INSERT INTO Organizer_Profiles
(organizer_id, organization_name, designation, verified)
SELECT user_id, 'CGC Design Club', 'Creative Lead', TRUE
FROM Users
WHERE email = 'nikhil.sharma@cgc.edu.in';

INSERT INTO Organizer_Profiles
(organizer_id, organization_name, designation, verified)
SELECT user_id, 'CGC Developer Community', 'Community Lead', TRUE
FROM Users
WHERE email = 'pallavi.mehta@cgc.edu.in';


-- ============================================================
-- 4. ADD MORE VENUES
-- ============================================================

INSERT INTO Venues
(venue_name, address, city, capacity, contact_no)
VALUES
('Innovation Lab', 'CGC Campus, Sector 71', 'Mohali', 150, '9988010001'),
('Central Seminar Hall', 'CGC Campus, Sector 71', 'Mohali', 250, '9988010002'),
('Tech Arena', 'CGC Campus, Sector 71', 'Mohali', 350, '9988010003'),
('Sports Complex', 'CGC Campus, Sector 71', 'Mohali', 1000, '9988010004'),
('Conference Room A', 'CGC Campus, Sector 71', 'Mohali', 80, '9988010005'),
('Conference Room B', 'CGC Campus, Sector 71', 'Mohali', 80, '9988010006'),
('Central Lawn', 'CGC Campus, Sector 71', 'Mohali', 1200, '9988010007'),
('Digital Learning Center', 'CGC Campus, Sector 71', 'Mohali', 300, '9988010008'),
('Media Studio', 'CGC Campus, Sector 71', 'Mohali', 100, '9988010009'),
('Indoor Arena', 'CGC Campus, Sector 71', 'Mohali', 600, '9988010010');


-- ============================================================
-- 5. ADD MORE CATEGORIES
-- ============================================================

INSERT INTO Categories
(category_name, description)
VALUES
('Entrepreneurship', 'Startup, business and innovation events'),
('Literature', 'Poetry, writing and literary discussions'),
('Design', 'UI/UX, visual design and creative workshops'),
('Career', 'Career fairs, placements and professional talks');


-- ============================================================
-- 6. ADD 20 EVENTS
-- ============================================================

INSERT INTO Events
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
VALUES

(
'Startup Spark Summit',
'Startup ideas, founders and student entrepreneurship',
(SELECT category_id FROM Categories WHERE category_name='Entrepreneurship'),
(SELECT venue_id FROM Venues WHERE venue_name='Innovation Lab'),
(SELECT organizer_id FROM Organizer_Profiles op
 JOIN Users u ON u.user_id=op.organizer_id
 WHERE u.email='vikram.ahuja@cgc.edu.in'),
'2026-10-03 10:00:00',
'2026-10-03 16:00:00',
120,
99.00,
'PUBLISHED'
),

(
'Founder Fireside Chat',
'Conversation with emerging founders',
(SELECT category_id FROM Categories WHERE category_name='Entrepreneurship'),
(SELECT venue_id FROM Venues WHERE venue_name='Central Seminar Hall'),
(SELECT organizer_id FROM Organizer_Profiles op
 JOIN Users u ON u.user_id=op.organizer_id
 WHERE u.email='aditi.sood@cgc.edu.in'),
'2026-10-05 14:00:00',
'2026-10-05 17:00:00',
180,
0.00,
'PUBLISHED'
),

(
'Design Thinking Sprint',
'Rapid design thinking challenge',
(SELECT category_id FROM Categories WHERE category_name='Design'),
(SELECT venue_id FROM Venues WHERE venue_name='Tech Arena'),
(SELECT organizer_id FROM Organizer_Profiles op
 JOIN Users u ON u.user_id=op.organizer_id
 WHERE u.email='nikhil.sharma@cgc.edu.in'),
'2026-10-08 10:00:00',
'2026-10-08 17:00:00',
300,
50.00,
'PUBLISHED'
),

(
'Career Connect 2026',
'Industry networking and career guidance',
(SELECT category_id FROM Categories WHERE category_name='Career'),
(SELECT venue_id FROM Venues WHERE venue_name='Central Seminar Hall'),
(SELECT organizer_id FROM Organizer_Profiles op
 JOIN Users u ON u.user_id=op.organizer_id
 WHERE u.email='pallavi.mehta@cgc.edu.in'),
'2026-10-12 10:00:00',
'2026-10-12 17:00:00',
220,
0.00,
'PUBLISHED'
),

(
'Inter College Football Cup',
'Annual college football tournament',
(SELECT category_id FROM Categories WHERE category_name='Sports'),
(SELECT venue_id FROM Venues WHERE venue_name='Sports Complex'),
(SELECT organizer_id FROM Organizer_Profiles op
 JOIN Users u ON u.user_id=op.organizer_id
 WHERE u.email='kunal.bhatia@cgc.edu.in'),
'2026-10-18 09:00:00',
'2026-10-18 18:00:00',
900,
100.00,
'PUBLISHED'
),

(
'Poetry Under The Stars',
'Open mic poetry evening',
(SELECT category_id FROM Categories WHERE category_name='Literature'),
(SELECT venue_id FROM Venues WHERE venue_name='Central Lawn'),
(SELECT organizer_id FROM Organizer_Profiles op
 JOIN Users u ON u.user_id=op.organizer_id
 WHERE u.email='jasleen.kaur@cgc.edu.in'),
'2026-10-20 18:00:00',
'2026-10-20 21:00:00',
700,
50.00,
'PUBLISHED'
),

(
'UI/UX Masterclass',
'Practical interface design masterclass',
(SELECT category_id FROM Categories WHERE category_name='Design'),
(SELECT venue_id FROM Venues WHERE venue_name='Digital Learning Center'),
(SELECT organizer_id FROM Organizer_Profiles op
 JOIN Users u ON u.user_id=op.organizer_id
 WHERE u.email='nikhil.sharma@cgc.edu.in'),
'2026-10-24 10:00:00',
'2026-10-24 15:00:00',
250,
75.00,
'PUBLISHED'
),

(
'Campus Startup Expo',
'Student startup exhibition',
(SELECT category_id FROM Categories WHERE category_name='Entrepreneurship'),
(SELECT venue_id FROM Venues WHERE venue_name='Central Lawn'),
(SELECT organizer_id FROM Organizer_Profiles op
 JOIN Users u ON u.user_id=op.organizer_id
 WHERE u.email='vikram.ahuja@cgc.edu.in'),
'2026-10-28 10:00:00',
'2026-10-28 18:00:00',
1000,
0.00,
'PUBLISHED'
),

(
'Python Automation Workshop',
'Build useful automation tools',
(SELECT category_id FROM Categories WHERE category_name='Technical'),
(SELECT venue_id FROM Venues WHERE venue_name='Innovation Lab'),
(SELECT organizer_id FROM Organizer_Profiles op
 JOIN Users u ON u.user_id=op.organizer_id
 WHERE u.email='pallavi.mehta@cgc.edu.in'),
'2026-11-02 10:00:00',
'2026-11-02 16:00:00',
140,
40.00,
'PUBLISHED'
),

(
'Cyber Security Awareness',
'Practical cyber safety session',
(SELECT category_id FROM Categories WHERE category_name='Technical'),
(SELECT venue_id FROM Venues WHERE venue_name='Tech Arena'),
(SELECT organizer_id FROM Organizer_Profiles op
 JOIN Users u ON u.user_id=op.organizer_id
 WHERE u.email='pallavi.mehta@cgc.edu.in'),
'2026-11-06 11:00:00',
'2026-11-06 14:00:00',
300,
0.00,
'PUBLISHED'
),

(
'Placement Strategy Talk',
'Resume, interviews and placement strategy',
(SELECT category_id FROM Categories WHERE category_name='Career'),
(SELECT venue_id FROM Venues WHERE venue_name='Central Seminar Hall'),
(SELECT organizer_id FROM Organizer_Profiles op
 JOIN Users u ON u.user_id=op.organizer_id
 WHERE u.email='aditi.sood@cgc.edu.in'),
'2026-11-10 14:00:00',
'2026-11-10 17:00:00',
200,
0.00,
'PUBLISHED'
),

(
'Badminton Championship',
'Inter department badminton tournament',
(SELECT category_id FROM Categories WHERE category_name='Sports'),
(SELECT venue_id FROM Venues WHERE venue_name='Indoor Arena'),
(SELECT organizer_id FROM Organizer_Profiles op
 JOIN Users u ON u.user_id=op.organizer_id
 WHERE u.email='kunal.bhatia@cgc.edu.in'),
'2026-11-14 09:00:00',
'2026-11-14 17:00:00',
500,
80.00,
'PUBLISHED'
),

(
'Hackathon Prep Camp',
'Problem solving and hackathon preparation',
(SELECT category_id FROM Categories WHERE category_name='Technical'),
(SELECT venue_id FROM Venues WHERE venue_name='Digital Learning Center'),
(SELECT organizer_id FROM Organizer_Profiles op
 JOIN Users u ON u.user_id=op.organizer_id
 WHERE u.email='pallavi.mehta@cgc.edu.in'),
'2026-11-18 10:00:00',
'2026-11-18 18:00:00',
260,
60.00,
'PUBLISHED'
),

(
'Literary Debate Forum',
'Debate and public speaking forum',
(SELECT category_id FROM Categories WHERE category_name='Literature'),
(SELECT venue_id FROM Venues WHERE venue_name='Conference Room A'),
(SELECT organizer_id FROM Organizer_Profiles op
 JOIN Users u ON u.user_id=op.organizer_id
 WHERE u.email='jasleen.kaur@cgc.edu.in'),
'2026-11-22 14:00:00',
'2026-11-22 18:00:00',
70,
0.00,
'PUBLISHED'
),

(
'Photography Walk',
'Campus photography and storytelling walk',
(SELECT category_id FROM Categories WHERE category_name='Design'),
(SELECT venue_id FROM Venues WHERE venue_name='Media Studio'),
(SELECT organizer_id FROM Organizer_Profiles op
 JOIN Users u ON u.user_id=op.organizer_id
 WHERE u.email='nikhil.sharma@cgc.edu.in'),
'2026-11-26 10:00:00',
'2026-11-26 15:00:00',
90,
30.00,
'PUBLISHED'
),

(
'Innovation Demo Day',
'Student prototypes and product demonstrations',
(SELECT category_id FROM Categories WHERE category_name='Entrepreneurship'),
(SELECT venue_id FROM Venues WHERE venue_name='Tech Arena'),
(SELECT organizer_id FROM Organizer_Profiles op
 JOIN Users u ON u.user_id=op.organizer_id
 WHERE u.email='vikram.ahuja@cgc.edu.in'),
'2026-12-02 10:00:00',
'2026-12-02 17:00:00',
300,
0.00,
'PUBLISHED'
),

(
'Annual Sports Awards',
'Recognition of student athletes',
(SELECT category_id FROM Categories WHERE category_name='Sports'),
(SELECT venue_id FROM Venues WHERE venue_name='Main Auditorium'),
(SELECT organizer_id FROM Organizer_Profiles op
 JOIN Users u ON u.user_id=op.organizer_id
 WHERE u.email='kunal.bhatia@cgc.edu.in'),
'2026-12-06 17:00:00',
'2026-12-06 20:00:00',
450,
0.00,
'PUBLISHED'
),

(
'Creative Portfolio Review',
'Portfolio feedback from experienced designers',
(SELECT category_id FROM Categories WHERE category_name='Design'),
(SELECT venue_id FROM Venues WHERE venue_name='Media Studio'),
(SELECT organizer_id FROM Organizer_Profiles op
 JOIN Users u ON u.user_id=op.organizer_id
 WHERE u.email='nikhil.sharma@cgc.edu.in'),
'2026-12-10 10:00:00',
'2026-12-10 16:00:00',
90,
100.00,
'PUBLISHED'
),

(
'Winter Career Fair',
'Recruiter interactions and career booths',
(SELECT category_id FROM Categories WHERE category_name='Career'),
(SELECT venue_id FROM Venues WHERE venue_name='Main Auditorium'),
(SELECT organizer_id FROM Organizer_Profiles op
 JOIN Users u ON u.user_id=op.organizer_id
 WHERE u.email='aditi.sood@cgc.edu.in'),
'2026-12-15 10:00:00',
'2026-12-15 18:00:00',
450,
0.00,
'PUBLISHED'
),

(
'New Year Tech Meetup',
'Community networking and technology talks',
(SELECT category_id FROM Categories WHERE category_name='Technical'),
(SELECT venue_id FROM Venues WHERE venue_name='Tech Arena'),
(SELECT organizer_id FROM Organizer_Profiles op
 JOIN Users u ON u.user_id=op.organizer_id
 WHERE u.email='pallavi.mehta@cgc.edu.in'),
'2026-12-20 15:00:00',
'2026-12-20 20:00:00',
300,
50.00,
'PUBLISHED'
);


-- ============================================================
-- 7. ADD SESSIONS
-- ============================================================

INSERT INTO Sessions
(event_id, session_title, speaker_name, start_time, end_time, room_no)
SELECT
    event_id,
    CONCAT(title, ' — Main Session'),
    'Guest Speaker',
    start_datetime,
    end_datetime,
    'Main Room'
FROM Events
WHERE title IN
(
'Startup Spark Summit',
'Founder Fireside Chat',
'Design Thinking Sprint',
'Career Connect 2026',
'Inter College Football Cup',
'Poetry Under The Stars',
'UI/UX Masterclass',
'Campus Startup Expo',
'Python Automation Workshop',
'Cyber Security Awareness',
'Placement Strategy Talk',
'Badminton Championship',
'Hackathon Prep Camp',
'Literary Debate Forum',
'Photography Walk',
'Innovation Demo Day',
'Annual Sports Awards',
'Creative Portfolio Review',
'Winter Career Fair',
'New Year Tech Meetup'
);


-- ============================================================
-- 8. CREATE MANY REGISTRATIONS
-- ============================================================
-- We use the existing attendees + new attendees.
-- The registration trigger automatically creates Tickets.

INSERT IGNORE INTO Registrations
(event_id, user_id, status)

SELECT
    e.event_id,
    u.user_id,
    'CONFIRMED'
FROM Events e
CROSS JOIN Users u
WHERE
    e.event_id > 3
    AND u.role = 'ATTENDEE'
    AND MOD(e.event_id + u.user_id, 5) IN (0,1);


-- ============================================================
-- 9. PAYMENTS FOR PAID EVENTS
-- ============================================================

INSERT IGNORE INTO Payments
(registration_id, amount, payment_method, payment_status)

SELECT
    r.registration_id,
    e.ticket_price,

    CASE MOD(r.registration_id, 3)
        WHEN 0 THEN 'UPI'
        WHEN 1 THEN 'CARD'
        ELSE 'NETBANKING'
    END,

    'SUCCESS'

FROM Registrations r
JOIN Events e
    ON e.event_id = r.event_id

WHERE
    r.status = 'CONFIRMED'
    AND e.ticket_price > 0
    AND e.event_id > 3;


-- ============================================================
-- 10. NOTIFICATIONS
-- ============================================================

INSERT INTO Notifications
(user_id, event_id, message, is_read)

SELECT
    r.user_id,
    r.event_id,
    CONCAT('You are registered for ', e.title),
    FALSE

FROM Registrations r
JOIN Events e
    ON e.event_id = r.event_id

WHERE e.event_id > 3

LIMIT 30;


COMMIT;


-- ============================================================
-- 11. VERIFY DATASET
-- ============================================================

SELECT 'Users' AS table_name, COUNT(*) AS total FROM Users
UNION ALL
SELECT 'Organizer Profiles', COUNT(*) FROM Organizer_Profiles
UNION ALL
SELECT 'Venues', COUNT(*) FROM Venues
UNION ALL
SELECT 'Categories', COUNT(*) FROM Categories
UNION ALL
SELECT 'Events', COUNT(*) FROM Events
UNION ALL
SELECT 'Sessions', COUNT(*) FROM Sessions
UNION ALL
SELECT 'Registrations', COUNT(*) FROM Registrations
UNION ALL
SELECT 'Tickets', COUNT(*) FROM Tickets
UNION ALL
SELECT 'Payments', COUNT(*) FROM Payments
UNION ALL
SELECT 'Feedback', COUNT(*) FROM Feedback
UNION ALL
SELECT 'Notifications', COUNT(*) FROM Notifications;


-- ============================================================
-- 12. CHECK THE FRONTEND EVENT VIEW
-- ============================================================

SELECT *
FROM vw_event_summary
ORDER BY start_datetime;