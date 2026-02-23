-- ========================================
-- BACKROOMS MULTIPLAYER - DATABASE SCHEMA
-- ========================================
-- Versión: 1.0
-- Fecha: 2026-02-22
-- Total de tablas: 8
-- ========================================

-- Crear base de datos si no existe
CREATE DATABASE IF NOT EXISTS backrooms_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE backrooms_db;

-- ========================================
-- TABLA 1: USERS
-- Usuarios del sistema
-- ========================================
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  avatar_url VARCHAR(255) DEFAULT NULL,
  role ENUM('user', 'admin') DEFAULT 'user' NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP NULL DEFAULT NULL,

  INDEX idx_username (username),
  INDEX idx_email (email),
  INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- TABLA 2: GAME_SESSIONS
-- Salas de juego multijugador
-- ========================================
CREATE TABLE IF NOT EXISTS game_sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  room_code VARCHAR(10) NOT NULL UNIQUE,
  max_players INT NOT NULL DEFAULT 4,
  current_level INT DEFAULT 1,
  status ENUM('waiting', 'playing', 'finished') DEFAULT 'waiting' NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_room_code (room_code),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- TABLA 3: ROOM_PLAYERS
-- Relación N:M entre usuarios y salas
-- ========================================
CREATE TABLE IF NOT EXISTS room_players (
  id INT AUTO_INCREMENT PRIMARY KEY,
  session_id INT NOT NULL,
  user_id INT NOT NULL,
  is_host BOOLEAN DEFAULT FALSE,
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (session_id) REFERENCES game_sessions(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,

  UNIQUE KEY unique_player_session (session_id, user_id),
  INDEX idx_session (session_id),
  INDEX idx_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- TABLA 4: INVENTORIES
-- Items de cada jugador por partida
-- ========================================
CREATE TABLE IF NOT EXISTS inventories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  session_id INT NOT NULL,
  user_id INT NOT NULL,
  item_name VARCHAR(100) NOT NULL,
  quantity INT DEFAULT 1,
  acquired_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (session_id) REFERENCES game_sessions(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,

  INDEX idx_session_user (session_id, user_id),
  INDEX idx_item (item_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- TABLA 5: MESSAGES
-- Chat global y por sala
-- ========================================
CREATE TABLE IF NOT EXISTS messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sender_id INT NOT NULL,
  session_id INT NULL DEFAULT NULL,
  message_text TEXT NOT NULL,
  is_global BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (session_id) REFERENCES game_sessions(id) ON DELETE CASCADE,

  INDEX idx_sender (sender_id),
  INDEX idx_session (session_id),
  INDEX idx_global (is_global),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- TABLA 6: FRIENDS
-- Sistema de amigos
-- ========================================
CREATE TABLE IF NOT EXISTS friends (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  friend_id INT NOT NULL,
  status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending' NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (friend_id) REFERENCES users(id) ON DELETE CASCADE,

  UNIQUE KEY unique_friendship (user_id, friend_id),
  INDEX idx_user (user_id),
  INDEX idx_friend (friend_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- TABLA 7: GAME_PROGRESS
-- Progreso individual en partidas
-- ========================================
CREATE TABLE IF NOT EXISTS game_progress (
  id INT AUTO_INCREMENT PRIMARY KEY,
  session_id INT NOT NULL,
  user_id INT NOT NULL,
  current_level INT DEFAULT 1,
  decisions_made JSON DEFAULT NULL,
  checkpoints JSON DEFAULT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (session_id) REFERENCES game_sessions(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,

  UNIQUE KEY unique_progress (session_id, user_id),
  INDEX idx_session (session_id),
  INDEX idx_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- TABLA 8: USER_MUTES
-- Sistema de moderación de chat
-- ========================================
CREATE TABLE IF NOT EXISTS user_mutes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  muted_by INT NOT NULL,
  session_id INT NULL DEFAULT NULL,
  reason TEXT NULL,
  mute_until TIMESTAMP NULL DEFAULT NULL,
  is_global BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (muted_by) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (session_id) REFERENCES game_sessions(id) ON DELETE CASCADE,

  INDEX idx_user_session (user_id, session_id),
  INDEX idx_global (is_global),
  INDEX idx_mute_until (mute_until)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- DATOS DE PRUEBA (OPCIONAL)
-- ========================================

-- Crear usuario admin de prueba (password: admin123)
INSERT INTO users (username, email, password_hash, role) VALUES
('admin', 'admin@backrooms.com', '$2b$10$rGVz1P6xqXqX9KX9KX9KXeO9KX9KX9KX9KX9KX9KX9KX9KX9KXu', 'admin');

-- Crear usuarios normales de prueba (password: user123)
INSERT INTO users (username, email, password_hash, role) VALUES
('player1', 'player1@test.com', '$2b$10$rGVz1P6xqXqX9KX9KX9KXeO9KX9KX9KX9KX9KX9KX9KX9KX9KXu', 'user'),
('player2', 'player2@test.com', '$2b$10$rGVz1P6xqXqX9KX9KX9KXeO9KX9KX9KX9KX9KX9KX9KX9KX9KXu', 'user');

-- ========================================
-- FIN DEL SCHEMA
-- ========================================
