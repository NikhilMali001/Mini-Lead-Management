-- MySQL schema for Mini Lead Management System

CREATE DATABASE IF NOT EXISTS lead_management;
USE lead_management;

CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'manager', 'agent') NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS leads (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  source VARCHAR(100) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'new',
  assigned_to INT UNSIGNED NULL,
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_leads_status (status),
  INDEX idx_leads_source (source),
  INDEX idx_leads_assigned_to (assigned_to),
  CONSTRAINT fk_leads_assigned_to_users FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS activities (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  lead_id INT UNSIGNED NOT NULL,
  action VARCHAR(100) NOT NULL,
  performed_by INT UNSIGNED,
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_activities_lead FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE,
  CONSTRAINT fk_activities_performed_by FOREIGN KEY (performed_by) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
