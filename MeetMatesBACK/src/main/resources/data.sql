-- ================================
-- Catégories
-- ================================
INSERT INTO category (category_id, name, image_url) VALUES
('10ad56ab-9d31-11f0-9a36-047c1653ad92', 'Sports collectifs', NULL),
('10ad5b36-9d31-11f0-9a36-047c1653ad92', 'Sports de raquette', NULL),
('10ad5c17-9d31-11f0-9a36-047c1653ad92', 'Activités de mobilité', NULL),
('10ad5ceb-9d31-11f0-9a36-047c1653ad92', 'Jeux d''adresse', NULL),
('10ad5db0-9d31-11f0-9a36-047c1653ad92', 'Fitness / Bien-être', NULL),
('10ad5c88-9d31-11f0-9a36-047c1653ad92', 'Danse', NULL),
('20ad5d49-9d31-11f0-9a36-047c1653ad92', 'Jeux', NULL),
('30ad5d49-9d31-11f0-9a36-047c1653ad92', 'Autres activités', NULL);

-- ================================
-- Sports collectifs
-- ================================
INSERT INTO activity (activity_id, name, category_id, created_at) VALUES
(UUID(), 'Football (five/citystade)', '10ad56ab-9d31-11f0-9a36-047c1653ad92', NOW()),
(UUID(), 'Rugby touch / flag rugby', '10ad56ab-9d31-11f0-9a36-047c1653ad92', NOW()),
(UUID(), 'Basketball', '10ad56ab-9d31-11f0-9a36-047c1653ad92', NOW()),
(UUID(), 'Ultimate frisbee', '10ad56ab-9d31-11f0-9a36-047c1653ad92', NOW()),
(UUID(), 'Volleyball (beachBall)', '10ad56ab-9d31-11f0-9a36-047c1653ad92', NOW());

-- ================================
-- Sports de raquette
-- ================================
INSERT INTO activity (activity_id, name, category_id, created_at) VALUES
(UUID(), 'Tennis', '10ad5b36-9d31-11f0-9a36-047c1653ad92', NOW()),
(UUID(), 'Badminton', '10ad5b36-9d31-11f0-9a36-047c1653ad92', NOW()),
(UUID(), 'Ping-pong', '10ad5b36-9d31-11f0-9a36-047c1653ad92', NOW()),
(UUID(), 'Padel', '10ad5b36-9d31-11f0-9a36-047c1653ad92', NOW());

-- ================================
-- Activités de mobilité
-- ================================
INSERT INTO activity (activity_id, name, category_id, created_at) VALUES
(UUID(), 'Vélo / VTT', '10ad5c17-9d31-11f0-9a36-047c1653ad92', NOW()),
(UUID(), 'Roller', '10ad5c17-9d31-11f0-9a36-047c1653ad92', NOW()),
(UUID(), 'Jogging', '10ad5c17-9d31-11f0-9a36-047c1653ad92', NOW()),
(UUID(), 'Randonnée', '10ad5c17-9d31-11f0-9a36-047c1653ad92', NOW());

-- ================================
-- Jeux d'adresse
-- ================================
INSERT INTO activity (activity_id, name, category_id, created_at) VALUES
(UUID(), 'Pétanque', '10ad5ceb-9d31-11f0-9a36-047c1653ad92', NOW()),
(UUID(), 'Mölkky', '10ad5ceb-9d31-11f0-9a36-047c1653ad92', NOW()),
(UUID(), 'Palet Breton', '10ad5ceb-9d31-11f0-9a36-047c1653ad92', NOW());

-- ================================
-- Fitness / Bien-être
-- ================================
INSERT INTO activity (activity_id, name, category_id, created_at) VALUES
(UUID(), 'Fitness', '10ad5db0-9d31-11f0-9a36-047c1653ad92', NOW()),
(UUID(), 'Yoga', '10ad5db0-9d31-11f0-9a36-047c1653ad92', NOW()),
(UUID(), 'Pilates', '10ad5db0-9d31-11f0-9a36-047c1653ad92', NOW()),
(UUID(), 'CrossFit', '10ad5db0-9d31-11f0-9a36-047c1653ad92', NOW()),
(UUID(), 'Musculation', '10ad5db0-9d31-11f0-9a36-047c1653ad92', NOW()),
(UUID(), 'Stretching', '10ad5db0-9d31-11f0-9a36-047c1653ad92', NOW()),
(UUID(), 'Méditation', '10ad5db0-9d31-11f0-9a36-047c1653ad92', NOW());

-- ================================
-- Danse
-- ================================
INSERT INTO activity (activity_id, name, category_id, created_at) VALUES
(UUID(), 'Zumba', '10ad5c88-9d31-11f0-9a36-047c1653ad92', NOW()),
(UUID(), 'Salsa', '10ad5c88-9d31-11f0-9a36-047c1653ad92', NOW()),
(UUID(), 'Hip-Hop', '10ad5c88-9d31-11f0-9a36-047c1653ad92', NOW()),
(UUID(), 'Moderne Jazz', '10ad5c88-9d31-11f0-9a36-047c1653ad92', NOW());

-- ================================
-- Jeux
-- ================================
INSERT INTO activity (activity_id, name, category_id, created_at) VALUES
(UUID(), 'Jeux de carte (belote/tarot/poker)', '20ad5d49-9d31-11f0-9a36-047c1653ad92', NOW()),
(UUID(), 'Jeux de rôle (Donjons & Dragons)', '20ad5d49-9d31-11f0-9a36-047c1653ad92', NOW()),
(UUID(), 'Jeux de société (Monopoly/Cluedo/Trivial Pursuit/Uno)', '20ad5d49-9d31-11f0-9a36-047c1653ad92', NOW()),
(UUID(), 'Jeux musicaux (Blind test musical/Karaoké)', '20ad5d49-9d31-11f0-9a36-047c1653ad92', NOW());

-- ================================
-- Autres activités
-- ================================
INSERT INTO activity (activity_id, name, category_id, created_at) VALUES
(UUID(), 'Escape Game', '30ad5d49-9d31-11f0-9a36-047c1653ad92', NOW()),
(UUID(), 'Laser Game', '30ad5d49-9d31-11f0-9a36-047c1653ad92', NOW()),
(UUID(), 'Bowling', '30ad5d49-9d31-11f0-9a36-047c1653ad92', NOW()),
(UUID(), 'VR', '30ad5d49-9d31-11f0-9a36-047c1653ad92', NOW());
