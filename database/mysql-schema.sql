CREATE DATABASE IF NOT EXISTS aiclub
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE aiclub;

CREATE TABLE IF NOT EXISTS members (
  id VARCHAR(50) NOT NULL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  name VARCHAR(201) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL DEFAULT '',
  team VARCHAR(100) NOT NULL,
  created_at DATETIME NOT NULL,
  status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
  INDEX idx_members_created_at (created_at),
  INDEX idx_members_status (status),
  INDEX idx_members_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS messages (
  id VARCHAR(50) NOT NULL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  created_at DATETIME NOT NULL,
  `read` TINYINT(1) NOT NULL DEFAULT 0,
  INDEX idx_messages_created_at (created_at),
  INDEX idx_messages_read (`read`),
  INDEX idx_messages_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS team_members (
  id VARCHAR(50) NOT NULL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  role VARCHAR(150) NOT NULL,
  department VARCHAR(150) NOT NULL,
  bio TEXT NOT NULL,
  image VARCHAR(500) NOT NULL DEFAULT '',
  linkedin VARCHAR(500) NOT NULL DEFAULT '',
  github VARCHAR(500) NOT NULL DEFAULT '',
  display_order INT NOT NULL DEFAULT 0,
  INDEX idx_team_members_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS events (
  id VARCHAR(50) NOT NULL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  image VARCHAR(500) NOT NULL DEFAULT '',
  instagram VARCHAR(500) NOT NULL DEFAULT '',
  date DATE NOT NULL,
  time TIME NOT NULL,
  location VARCHAR(255) NOT NULL,
  map_query VARCHAR(255) NOT NULL DEFAULT '',
  type ENUM('workshop', 'seminar', 'hackathon', 'meetup') NOT NULL,
  capacity INT NOT NULL DEFAULT 0,
  unlimited_capacity TINYINT(1) NOT NULL DEFAULT 0,
  registered INT NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  display_order INT NOT NULL DEFAULT 0,
  INDEX idx_events_date (date),
  INDEX idx_events_type (type),
  INDEX idx_events_active (is_active),
  INDEX idx_events_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
