USE event_pulse_system;

-- ============================================================
-- VIEWS
-- ============================================================

-- Full event summary: seats left, category, venue, organizer
CREATE OR REPLACE VIEW vw_event_summary AS
SELECT
    e.event_id,
    e.title,
    c.category_name,
    v.venue_name,
    u.full_name AS organizer_name,
    e.start_datetime,
    e.max_attendees,
    (e.max_attendees - COUNT(CASE WHEN r.status = 'CONFIRMED' THEN 1 END)) AS seats_left,
    e.status
FROM Events e
JOIN Categories c ON e.category_id = c.category_id
JOIN Venues v ON e.venue_id = v.venue_id
JOIN Organizer_Profiles op ON e.organizer_id = op.organizer_id
JOIN Users u ON op.organizer_id = u.user_id
LEFT JOIN Registrations r ON e.event_id = r.event_id
GROUP BY e.event_id, c.category_name, v.venue_name, u.full_name;

-- Attendee-facing view: a user's registrations with ticket + payment status
CREATE OR REPLACE VIEW vw_my_registrations AS
SELECT
    r.user_id,
    e.title,
    r.status AS registration_status,
    t.ticket_code,
    t.checked_in,
    p.amount,
    p.payment_status
FROM Registrations r
JOIN Events e ON r.event_id = e.event_id
LEFT JOIN Tickets t ON r.registration_id = t.registration_id
LEFT JOIN Payments p ON r.registration_id = p.registration_id;

-- ============================================================
-- STORED PROCEDURE: register a user for an event with capacity check
-- ============================================================
DELIMITER $$

CREATE PROCEDURE sp_register_for_event (
    IN p_event_id INT,
    IN p_user_id  INT,
    OUT p_result  VARCHAR(100)
)
BEGIN
    DECLARE v_confirmed_count INT;
    DECLARE v_max INT;

    SELECT max_attendees INTO v_max FROM Events WHERE event_id = p_event_id;

    SELECT COUNT(*) INTO v_confirmed_count
    FROM Registrations
    WHERE event_id = p_event_id AND status = 'CONFIRMED';

    IF v_confirmed_count >= v_max THEN
        INSERT INTO Registrations (event_id, user_id, status)
        VALUES (p_event_id, p_user_id, 'WAITLISTED');
        SET p_result = 'Event full — added to waitlist';
    ELSE
        INSERT INTO Registrations (event_id, user_id, status)
        VALUES (p_event_id, p_user_id, 'CONFIRMED');
        SET p_result = 'Registration confirmed';
    END IF;
END$$

DELIMITER ;

-- ============================================================
-- TRIGGER 1: auto-generate a ticket when a registration is CONFIRMED
-- ============================================================
DELIMITER $$

CREATE TRIGGER trg_after_registration_confirmed
AFTER INSERT ON Registrations
FOR EACH ROW
BEGIN
    IF NEW.status = 'CONFIRMED' THEN
        INSERT INTO Tickets (registration_id, ticket_code)
        VALUES (NEW.registration_id, CONCAT('TCK-', LPAD(NEW.registration_id, 4, '0')));
    END IF;
END$$

DELIMITER ;

-- ============================================================
-- TRIGGER 2: prevent registration for an event that already ended
-- ============================================================
DELIMITER $$

CREATE TRIGGER trg_before_registration_insert
BEFORE INSERT ON Registrations
FOR EACH ROW
BEGIN
    DECLARE v_end DATETIME;
    SELECT end_datetime INTO v_end FROM Events WHERE event_id = NEW.event_id;
    IF v_end < NOW() THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cannot register: event has already ended';
    END IF;
END$$

DELIMITER ;
