-- ================================
-- Catégories
-- ================================
INSERT INTO category (category_id, name) VALUES
('10ad56ab-9d31-11f0-9a36-047c1653ad92', 'Sports collectifs'),
('10ad5b36-9d31-11f0-9a36-047c1653ad92', 'Sports de raquette'),
('10ad5c17-9d31-11f0-9a36-047c1653ad92', 'Activités de mobilité'),
('10ad5ceb-9d31-11f0-9a36-047c1653ad92', 'Jeux d''adresse'),
('10ad5db0-9d31-11f0-9a36-047c1653ad92', 'Fitness Bien-être'),
('10ad5c88-9d31-11f0-9a36-047c1653ad92', 'Danse'),
('20ad5d49-9d31-11f0-9a36-047c1653ad92', 'Jeux'),
('30ad5d49-9d31-11f0-9a36-047c1653ad92', 'Autres activités');

-- ================================
-- Sports collectifs
-- ================================
INSERT INTO activity (activity_id, name, category_id) VALUES
(UUID(), 'Football', '10ad56ab-9d31-11f0-9a36-047c1653ad92'),
(UUID(), 'Basketball', '10ad56ab-9d31-11f0-9a36-047c1653ad92'),
(UUID(), 'Ultimate frisbee', '10ad56ab-9d31-11f0-9a36-047c1653ad92'),
(UUID(), 'Volleyball', '10ad56ab-9d31-11f0-9a36-047c1653ad92');

-- ================================
-- Sports de raquette
-- ================================
INSERT INTO activity (activity_id, name, category_id) VALUES
(UUID(), 'Tennis', '10ad5b36-9d31-11f0-9a36-047c1653ad92'),
(UUID(), 'Badminton', '10ad5b36-9d31-11f0-9a36-047c1653ad92'),
(UUID(), 'Ping-pong', '10ad5b36-9d31-11f0-9a36-047c1653ad92'),
(UUID(), 'Padel', '10ad5b36-9d31-11f0-9a36-047c1653ad92');

-- ================================
-- Activités de mobilité
-- ================================
INSERT INTO activity (activity_id, name, category_id) VALUES
(UUID(), 'Vélo', '10ad5c17-9d31-11f0-9a36-047c1653ad92'),
(UUID(), 'Roller', '10ad5c17-9d31-11f0-9a36-047c1653ad92'),
(UUID(), 'Jogging', '10ad5c17-9d31-11f0-9a36-047c1653ad92'),
(UUID(), 'Randonnée', '10ad5c17-9d31-11f0-9a36-047c1653ad92');

-- ================================
-- Jeux d'adresse
-- ================================
INSERT INTO activity (activity_id, name, category_id) VALUES
(UUID(), 'Pétanque', '10ad5ceb-9d31-11f0-9a36-047c1653ad92'),
(UUID(), 'Mölkky', '10ad5ceb-9d31-11f0-9a36-047c1653ad92'),
(UUID(), 'Flechettes', '10ad5ceb-9d31-11f0-9a36-047c1653ad92'),
(UUID(), 'Palet Breton', '10ad5ceb-9d31-11f0-9a36-047c1653ad92');

-- ================================
-- Fitness / Bien-être
-- ================================
INSERT INTO activity (activity_id, name, category_id) VALUES
(UUID(), 'Yoga', '10ad5db0-9d31-11f0-9a36-047c1653ad92'),
(UUID(), 'Musculation', '10ad5db0-9d31-11f0-9a36-047c1653ad92'),
(UUID(), 'Stretching', '10ad5db0-9d31-11f0-9a36-047c1653ad92'),
(UUID(), 'Méditation', '10ad5db0-9d31-11f0-9a36-047c1653ad92');

-- ================================
-- Danse
-- ================================
INSERT INTO activity (activity_id, name, category_id) VALUES
(UUID(), 'Zumba', '10ad5c88-9d31-11f0-9a36-047c1653ad92'),
(UUID(), 'Salsa', '10ad5c88-9d31-11f0-9a36-047c1653ad92'),
(UUID(), 'Hip Hop', '10ad5c88-9d31-11f0-9a36-047c1653ad92'),
(UUID(), 'Moderne Jazz', '10ad5c88-9d31-11f0-9a36-047c1653ad92');

-- ================================
-- Jeux
-- ================================
INSERT INTO activity (activity_id, name, category_id) VALUES
(UUID(), 'Jeux de carte', '20ad5d49-9d31-11f0-9a36-047c1653ad92'),
(UUID(), 'Jeux de rôle', '20ad5d49-9d31-11f0-9a36-047c1653ad92'),
(UUID(), 'Jeux de société', '20ad5d49-9d31-11f0-9a36-047c1653ad92'),
(UUID(), 'Jeux musicaux', '20ad5d49-9d31-11f0-9a36-047c1653ad92');

-- ================================
-- Autres activités
-- ================================
INSERT INTO activity (activity_id, name, category_id) VALUES
(UUID(), 'Escape Game', '30ad5d49-9d31-11f0-9a36-047c1653ad92'),
(UUID(), 'PaintBall', '30ad5d49-9d31-11f0-9a36-047c1653ad92'),
(UUID(), 'Laser Game', '30ad5d49-9d31-11f0-9a36-047c1653ad92'),
(UUID(), 'Bowling', '30ad5d49-9d31-11f0-9a36-047c1653ad92');
