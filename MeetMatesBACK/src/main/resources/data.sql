-- ================================
-- Catégories
-- ================================
INSERT INTO category (category_id, name, image_url) VALUES
('10ad56ab-9d31-11f0-9a36-047c1653ad92', 'Sports collectifs', NULL),
('10ad5b36-9d31-11f0-9a36-047c1653ad92', 'Sports de raquette', NULL),
('10ad5c17-9d31-11f0-9a36-047c1653ad92', 'Activités de mobilité', NULL),
('10ad5db0-9d31-11f0-9a36-047c1653ad92', 'Fitness / Bien-être', NULL),
('10ad5c88-9d31-11f0-9a36-047c1653ad92', 'Danse', NULL),
('10ad5ceb-9d31-11f0-9a36-047c1653ad92', 'Jeux', NULL),
('10ad5d49-9d31-11f0-9a36-047c1653ad92', 'Autres activités', NULL);

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
(UUID(), 'Pétanque', '10ad5ceb-9d31-11f0-9a36-047c1653ad92', NOW()),
(UUID(), 'Mölkky', '10ad5ceb-9d31-11f0-9a36-047c1653ad92', NOW()),
(UUID(), 'Palet Breton', '10ad5ceb-9d31-11f0-9a36-047c1653ad92', NOW()),
(UUID(), 'Jeux de carte (belote/tarot/poker)', '10ad5ceb-9d31-11f0-9a36-047c1653ad92', NOW()),
(UUID(), 'Jeux de rôle (Donjons & Dragons)', '10ad5ceb-9d31-11f0-9a36-047c1653ad92', NOW()),
(UUID(), 'Jeux de société (Monopoly/Trivial Pursuit/Cluedo/Risk/Loup garou/Uno)', '10ad5ceb-9d31-11f0-9a36-047c1653ad92', NOW()),
(UUID(), 'Jeux musicaux (Blind test musical/Karaoké)', '10ad5ceb-9d31-11f0-9a36-047c1653ad92', NOW());

-- ================================
-- Autres activités
-- ================================
INSERT INTO activity (activity_id, name, category_id, created_at) VALUES
(UUID(), 'Escape Game', '10ad5d49-9d31-11f0-9a36-047c1653ad92', NOW()),
(UUID(), 'Laser Game', '10ad5d49-9d31-11f0-9a36-047c1653ad92', NOW()),
(UUID(), 'Bowling', '10ad5d49-9d31-11f0-9a36-047c1653ad92', NOW()),
(UUID(), 'VR', '10ad5d49-9d31-11f0-9a36-047c1653ad92', NOW());

-- INSERT INTO users (user_id, email, password, first_name, last_name, enabled, role, created_at, updated_at)
-- VALUES (
--     '00000000-0000-0000-0000-000000000001',
--     'pilia.ennio@gmail.com',
--     '$2a$10$E0MYzXyjpJS7Pd0RVvHwHeFxLzBZUEh5p7f1GfKZb9E.VsGe6/O6.', -- mot de passe 'password' encodé BCrypt
--     'Ennio',
--     'Pilia',
--     true,
--     'USER',  
--     NOW(),
--     NOW()
-- );
