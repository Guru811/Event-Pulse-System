-- ============================================================
-- EVENT PULSE SYSTEM — DATABASE SCHEMA (MySQL 8.x)
-- Normalized to 3NF
-- ============================================================

DROP DATABASE IF EXISTS event_pulse_system;
CREATE DATABASE event_pulse_system;
USE event_pulse_system;

-- ------------------------------------------------------------
-- 1. USERS  (base entity for Attendee / Organizer / Admin)
-- ------------------------------------------------------------
CREATE TABLE Users (
    user_id        INT AUTO_INCREMENT PRIMARY KEY,
    full_name      VARCHAR(100) NOT NULL,
    email          VARCHAR(120) NOT NULL UNIQUE,
    phone          VARCHAR(15),
    password_hash  VARCHAR(255) NOT NULL,
    role           ENUM('ATTENDEE','ORGANIZER','ADMIN') NOT NULL DEFAULT 'ATTENDEE',
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- 2. ORGANIZER_PROFILES  (1:1 extension of Users where role=ORGANIZER)
-- ------------------------------------------------------------
CREATE TABLE Organizer_Profiles (
    organizer_id     INT PRIMARY KEY,          -- same as user_id (1:1)
    organization_name VARCHAR(150) NOT NULL,
    designation      VARCHAR(100),
    verified         BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (organizer_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- 3. VENUES
-- ------------------------------------------------------------
CREATE TABLE Venues (
    venue_id     INT AUTO_INCREMENT PRIMARY KEY,
    venue_name   VARCHAR(150) NOT NULL,
    address      VARCHAR(255) NOT NULL,
    city         VARCHAR(80) NOT NULL,
    capacity     INT NOT NULL CHECK (capacity > 0),
    contact_no   VARCHAR(15)
);

-- ------------------------------------------------------------
-- 4. CATEGORIES
-- ------------------------------------------------------------
CREATE TABLE Categories (
    category_id   INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(80) NOT NULL UNIQUE,
    description   VARCHAR(255)
);

-- ------------------------------------------------------------
-- 5. EVENTS
-- ------------------------------------------------------------
CREATE TABLE Events (
    event_id        INT AUTO_INCREMENT PRIMARY KEY,
    title           VARCHAR(150) NOT NULL,
    description     TEXT,
    category_id     INT NOT NULL,
    venue_id        INT NOT NULL,
    organizer_id    INT NOT NULL,
    start_datetime  DATETIME NOT NULL,
    end_datetime    DATETIME NOT NULL,
    max_attendees   INT NOT NULL CHECK (max_attendees > 0),
    ticket_price    DECIMAL(8,2) NOT NULL DEFAULT 0.00,
    status          ENUM('DRAFT','PUBLISHED','ONGOING','COMPLETED','CANCELLED') DEFAULT 'DRAFT',
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES Categories(category_id),
    FOREIGN KEY (venue_id) REFERENCES Venues(venue_id),
    FOREIGN KEY (organizer_id) REFERENCES Organizer_Profiles(organizer_id),
    CHECK (end_datetime > start_datetime)
);

-- ------------------------------------------------------------
-- 6. SESSIONS  (sub-sessions/talks inside an event — 1:N with Events)
-- ------------------------------------------------------------
CREATE TABLE Sessions (
    session_id    INT AUTO_INCREMENT PRIMARY KEY,
    event_id      INT NOT NULL,
    session_title VARCHAR(150) NOT NULL,
    speaker_name  VARCHAR(100),
    start_time    DATETIME NOT NULL,
    end_time      DATETIME NOT NULL,
    room_no       VARCHAR(30),
    FOREIGN KEY (event_id) REFERENCES Events(event_id) ON DELETE CASCADE,
    CHECK (end_time > start_time)
);

-- ------------------------------------------------------------
-- 7. REGISTRATIONS  (M:N resolver between Users and Events)
-- ------------------------------------------------------------
CREATE TABLE Registrations (
    registration_id   INT AUTO_INCREMENT PRIMARY KEY,
    event_id          INT NOT NULL,
    user_id           INT NOT NULL,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status            ENUM('CONFIRMED','WAITLISTED','CANCELLED') DEFAULT 'CONFIRMED',
    FOREIGN KEY (event_id) REFERENCES Events(event_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    UNIQUE KEY uq_event_user (event_id, user_id)   -- one registration per user per event
);

-- ------------------------------------------------------------
-- 8. TICKETS  (1:1 with a CONFIRMED registration)
-- ------------------------------------------------------------
CREATE TABLE Tickets (
    ticket_id        INT AUTO_INCREMENT PRIMARY KEY,
    registration_id  INT NOT NULL UNIQUE,
    ticket_code      VARCHAR(30) NOT NULL UNIQUE,
    issued_date      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    checked_in       BOOLEAN DEFAULT FALSE,
    check_in_time    DATETIME NULL,
    FOREIGN KEY (registration_id) REFERENCES Registrations(registration_id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- 9. PAYMENTS  (1:1 with registration; free events may have no row)
-- ------------------------------------------------------------
CREATE TABLE Payments (
    payment_id       INT AUTO_INCREMENT PRIMARY KEY,
    registration_id  INT NOT NULL UNIQUE,
    amount           DECIMAL(8,2) NOT NULL,
    payment_method   ENUM('CARD','UPI','NETBANKING','CASH') NOT NULL,
    payment_status   ENUM('PENDING','SUCCESS','FAILED','REFUNDED') DEFAULT 'PENDING',
    payment_date     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (registration_id) REFERENCES Registrations(registration_id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- 10. FEEDBACK  (M:N resolver between Users and Events, post-event)
-- ------------------------------------------------------------
CREATE TABLE Feedback (
    feedback_id   INT AUTO_INCREMENT PRIMARY KEY,
    event_id      INT NOT NULL,
    user_id       INT NOT NULL,
    rating        TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comments      VARCHAR(500),
    submitted_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES Events(event_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    UNIQUE KEY uq_event_feedback (event_id, user_id)
);

-- ------------------------------------------------------------
-- 11. NOTIFICATIONS
-- ------------------------------------------------------------
CREATE TABLE Notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id          INT NOT NULL,
    event_id         INT,
    message          VARCHAR(255) NOT NULL,
    sent_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_read          BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES Events(event_id) ON DELETE SET NULL
);

-- ------------------------------------------------------------
-- Indexes for performance
-- ------------------------------------------------------------
CREATE INDEX idx_events_start ON Events(start_datetime);
CREATE INDEX idx_events_status ON Events(status);
CREATE INDEX idx_registrations_event ON Registrations(event_id);
CREATE INDEX idx_registrations_user ON Registrations(user_id);
CREATE INDEX idx_feedback_event ON Feedback(event_id);
