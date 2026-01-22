-- CATEGORIES 

INSERT INTO category (category_id, name)
SELECT '10ad56ab-9d31-11f0-9a36-047c1653ad92', 'Sports collectifs'
    WHERE NOT EXISTS (
    SELECT 1 FROM category WHERE category_id = '10ad56ab-9d31-11f0-9a36-047c1653ad92'
);

INSERT INTO category (category_id, name)
SELECT '10ad5b36-9d31-11f0-9a36-047c1653ad92', 'Sports de raquette'
    WHERE NOT EXISTS (
    SELECT 1 FROM category WHERE category_id = '10ad5b36-9d31-11f0-9a36-047c1653ad92'
);

INSERT INTO category (category_id, name)
SELECT '10ad5c17-9d31-11f0-9a36-047c1653ad92', 'Activités de mobilité'
    WHERE NOT EXISTS (
    SELECT 1 FROM category WHERE category_id = '10ad5c17-9d31-11f0-9a36-047c1653ad92'
);

INSERT INTO category (category_id, name)
SELECT '10ad5ceb-9d31-11f0-9a36-047c1653ad92', 'Jeux d''adresse'
    WHERE NOT EXISTS (
    SELECT 1 FROM category WHERE category_id = '10ad5ceb-9d31-11f0-9a36-047c1653ad92'
);

INSERT INTO category (category_id, name)
SELECT '10ad5db0-9d31-11f0-9a36-047c1653ad92', 'Fitness Bien-être'
    WHERE NOT EXISTS (
    SELECT 1 FROM category WHERE category_id = '10ad5db0-9d31-11f0-9a36-047c1653ad92'
);

INSERT INTO category (category_id, name)
SELECT '10ad5c88-9d31-11f0-9a36-047c1653ad92', 'Danse'
    WHERE NOT EXISTS (
    SELECT 1 FROM category WHERE category_id = '10ad5c88-9d31-11f0-9a36-047c1653ad92'
);

INSERT INTO category (category_id, name)
SELECT '20ad5d49-9d31-11f0-9a36-047c1653ad92', 'Jeux'
    WHERE NOT EXISTS (
    SELECT 1 FROM category WHERE category_id = '20ad5d49-9d31-11f0-9a36-047c1653ad92'
);

INSERT INTO category (category_id, name)
SELECT '30ad5d49-9d31-11f0-9a36-047c1653ad92', 'Autres activités'
    WHERE NOT EXISTS (
    SELECT 1 FROM category WHERE category_id = '30ad5d49-9d31-11f0-9a36-047c1653ad92'
);

-- ACTIVITIES 

INSERT INTO activity (activity_id, name, category_id)
SELECT UUID(), 'Football', '10ad56ab-9d31-11f0-9a36-047c1653ad92'
    WHERE NOT EXISTS (
    SELECT 1 FROM activity
    WHERE name = 'Football'
      AND category_id = '10ad56ab-9d31-11f0-9a36-047c1653ad92'
);

INSERT INTO activity (activity_id, name, category_id)
SELECT UUID(), 'Basketball', '10ad56ab-9d31-11f0-9a36-047c1653ad92'
    WHERE NOT EXISTS (
    SELECT 1 FROM activity
    WHERE name = 'Basketball'
      AND category_id = '10ad56ab-9d31-11f0-9a36-047c1653ad92'
);

INSERT INTO activity (activity_id, name, category_id)
SELECT UUID(), 'Ultimate frisbee', '10ad56ab-9d31-11f0-9a36-047c1653ad92'
    WHERE NOT EXISTS (
    SELECT 1 FROM activity
    WHERE name = 'Ultimate frisbee'
      AND category_id = '10ad56ab-9d31-11f0-9a36-047c1653ad92'
);

INSERT INTO activity (activity_id, name, category_id)
SELECT UUID(), 'Volleyball', '10ad56ab-9d31-11f0-9a36-047c1653ad92'
    WHERE NOT EXISTS (
    SELECT 1 FROM activity
    WHERE name = 'Volleyball'
      AND category_id = '10ad56ab-9d31-11f0-9a36-047c1653ad92'
);

INSERT INTO activity (activity_id, name, category_id)
SELECT UUID(), 'Badminton', '10ad5b36-9d31-11f0-9a36-047c1653ad92'
WHERE NOT EXISTS (
    SELECT 1 FROM activity WHERE name = 'Badminton'
    AND category_id = '10ad5b36-9d31-11f0-9a36-047c1653ad92'
);

INSERT INTO activity (activity_id, name, category_id)
SELECT UUID(), 'Padel', '10ad5b36-9d31-11f0-9a36-047c1653ad92'
WHERE NOT EXISTS (
    SELECT 1 FROM activity WHERE name = 'Padel'
    AND category_id = '10ad5b36-9d31-11f0-9a36-047c1653ad92'
);

INSERT INTO activity (activity_id, name, category_id)
SELECT UUID(), 'Ping-pong', '10ad5b36-9d31-11f0-9a36-047c1653ad92'
WHERE NOT EXISTS (
    SELECT 1 FROM activity WHERE name = 'Ping-pong'
    AND category_id = '10ad5b36-9d31-11f0-9a36-047c1653ad92'
);

INSERT INTO activity (activity_id, name, category_id)
SELECT UUID(), 'Tennis', '10ad5b36-9d31-11f0-9a36-047c1653ad92'
WHERE NOT EXISTS (
    SELECT 1 FROM activity WHERE name = 'Tennis'
    AND category_id = '10ad5b36-9d31-11f0-9a36-047c1653ad92'
);


INSERT INTO activity (activity_id, name, category_id)
SELECT UUID(), 'Jogging', '10ad5c17-9d31-11f0-9a36-047c1653ad92'
WHERE NOT EXISTS (
    SELECT 1 FROM activity WHERE name = 'Jogging'
    AND category_id = '10ad5c17-9d31-11f0-9a36-047c1653ad92'
);

INSERT INTO activity (activity_id, name, category_id)
SELECT UUID(), 'Randonnée', '10ad5c17-9d31-11f0-9a36-047c1653ad92'
WHERE NOT EXISTS (
    SELECT 1 FROM activity WHERE name = 'Randonnée'
    AND category_id = '10ad5c17-9d31-11f0-9a36-047c1653ad92'
);

INSERT INTO activity (activity_id, name, category_id)
SELECT UUID(), 'Roller', '10ad5c17-9d31-11f0-9a36-047c1653ad92'
WHERE NOT EXISTS (
    SELECT 1 FROM activity WHERE name = 'Roller'
    AND category_id = '10ad5c17-9d31-11f0-9a36-047c1653ad92'
);

INSERT INTO activity (activity_id, name, category_id)
SELECT UUID(), 'Vélo / VTT', '10ad5c17-9d31-11f0-9a36-047c1653ad92'
WHERE NOT EXISTS (
    SELECT 1 FROM activity WHERE name = 'Vélo / VTT'
    AND category_id = '10ad5c17-9d31-11f0-9a36-047c1653ad92'
);

INSERT INTO activity (activity_id, name, category_id)
SELECT UUID(), 'Hip-hop', '10ad5c88-9d31-11f0-9a36-047c1653ad92'
WHERE NOT EXISTS (
    SELECT 1 FROM activity WHERE name = 'Hip-hop'
    AND category_id = '10ad5c88-9d31-11f0-9a36-047c1653ad92'
);

INSERT INTO activity (activity_id, name, category_id)
SELECT UUID(), 'Moderne-jazz', '10ad5c88-9d31-11f0-9a36-047c1653ad92'
WHERE NOT EXISTS (
    SELECT 1 FROM activity WHERE name = 'Moderne-jazz'
    AND category_id = '10ad5c88-9d31-11f0-9a36-047c1653ad92'
);

INSERT INTO activity (activity_id, name, category_id)
SELECT UUID(), 'Salsa', '10ad5c88-9d31-11f0-9a36-047c1653ad92'
WHERE NOT EXISTS (
    SELECT 1 FROM activity WHERE name = 'Salsa'
    AND category_id = '10ad5c88-9d31-11f0-9a36-047c1653ad92'
);

INSERT INTO activity (activity_id, name, category_id)
SELECT UUID(), 'Zumba', '10ad5c88-9d31-11f0-9a36-047c1653ad92'
WHERE NOT EXISTS (
    SELECT 1 FROM activity WHERE name = 'Zumba'
    AND category_id = '10ad5c88-9d31-11f0-9a36-047c1653ad92'
);

INSERT INTO activity (activity_id, name, category_id)
SELECT UUID(), 'Mölkky', '10ad5ceb-9d31-11f0-9a36-047c1653ad92'
WHERE NOT EXISTS (
    SELECT 1 FROM activity WHERE name = 'Mölkky'
    AND category_id = '10ad5ceb-9d31-11f0-9a36-047c1653ad92'
);

INSERT INTO activity (activity_id, name, category_id)
SELECT UUID(), 'Pétanque', '10ad5ceb-9d31-11f0-9a36-047c1653ad92'
WHERE NOT EXISTS (
    SELECT 1 FROM activity WHERE name = 'Pétanque'
    AND category_id = '10ad5ceb-9d31-11f0-9a36-047c1653ad92'
);

INSERT INTO activity (activity_id, name, category_id)
SELECT UUID(), 'Fléchettes', '10ad5ceb-9d31-11f0-9a36-047c1653ad92'
WHERE NOT EXISTS (
    SELECT 1 FROM activity WHERE name = 'Fléchettes'
    AND category_id = '10ad5ceb-9d31-11f0-9a36-047c1653ad92'
);

INSERT INTO activity (activity_id, name, category_id)
SELECT UUID(), 'Palet breton', '10ad5ceb-9d31-11f0-9a36-047c1653ad92'
WHERE NOT EXISTS (
    SELECT 1 FROM activity WHERE name = 'Palet breton'
    AND category_id = '10ad5ceb-9d31-11f0-9a36-047c1653ad92'
);

INSERT INTO activity (activity_id, name, category_id)
SELECT UUID(), 'Méditation', '10ad5db0-9d31-11f0-9a36-047c1653ad92'
WHERE NOT EXISTS (
    SELECT 1 FROM activity WHERE name = 'Méditation'
    AND category_id = '10ad5db0-9d31-11f0-9a36-047c1653ad92'
);

INSERT INTO activity (activity_id, name, category_id)
SELECT UUID(), 'Musculation', '10ad5db0-9d31-11f0-9a36-047c1653ad92'
WHERE NOT EXISTS (
    SELECT 1 FROM activity WHERE name = 'Musculation'
    AND category_id = '10ad5db0-9d31-11f0-9a36-047c1653ad92'
);

INSERT INTO activity (activity_id, name, category_id)
SELECT UUID(), 'Stretching', '10ad5db0-9d31-11f0-9a36-047c1653ad92'
WHERE NOT EXISTS (
    SELECT 1 FROM activity WHERE name = 'Stretching'
    AND category_id = '10ad5db0-9d31-11f0-9a36-047c1653ad92'
);

INSERT INTO activity (activity_id, name, category_id)
SELECT UUID(), 'Yoga', '10ad5db0-9d31-11f0-9a36-047c1653ad92'
WHERE NOT EXISTS (
    SELECT 1 FROM activity WHERE name = 'Yoga'
    AND category_id = '10ad5db0-9d31-11f0-9a36-047c1653ad92'
);

INSERT INTO activity (activity_id, name, category_id)
SELECT UUID(), 'Jeux de cartes', '20ad5d49-9d31-11f0-9a36-047c1653ad92'
WHERE NOT EXISTS (
    SELECT 1 FROM activity WHERE name = 'Jeux de cartes'
    AND category_id = '20ad5d49-9d31-11f0-9a36-047c1653ad92'
);

INSERT INTO activity (activity_id, name, category_id)
SELECT UUID(), 'Jeux de société', '20ad5d49-9d31-11f0-9a36-047c1653ad92'
WHERE NOT EXISTS (
    SELECT 1 FROM activity WHERE name = 'Jeux de société'
    AND category_id = '20ad5d49-9d31-11f0-9a36-047c1653ad92'
);

INSERT INTO activity (activity_id, name, category_id)
SELECT UUID(), 'Jeux de rôle', '20ad5d49-9d31-11f0-9a36-047c1653ad92'
WHERE NOT EXISTS (
    SELECT 1 FROM activity WHERE name = 'Jeux de rôle'
    AND category_id = '20ad5d49-9d31-11f0-9a36-047c1653ad92'
);

INSERT INTO activity (activity_id, name, category_id)
SELECT UUID(), 'Quiz musicaux', '20ad5d49-9d31-11f0-9a36-047c1653ad92'
WHERE NOT EXISTS (
    SELECT 1 FROM activity WHERE name = 'Quiz musicaux'
    AND category_id = '20ad5d49-9d31-11f0-9a36-047c1653ad92'
);

INSERT INTO activity (activity_id, name, category_id)
SELECT UUID(), 'Bowling', '30ad5d49-9d31-11f0-9a36-047c1653ad92'
WHERE NOT EXISTS (
    SELECT 1 FROM activity WHERE name = 'Bowling'
    AND category_id = '30ad5d49-9d31-11f0-9a36-047c1653ad92'
);

INSERT INTO activity (activity_id, name, category_id)
SELECT UUID(), 'Escape game', '30ad5d49-9d31-11f0-9a36-047c1653ad92'
WHERE NOT EXISTS (
    SELECT 1 FROM activity WHERE name = 'Escape game'
    AND category_id = '30ad5d49-9d31-11f0-9a36-047c1653ad92'
);

INSERT INTO activity (activity_id, name, category_id)
SELECT UUID(), 'Laser game', '30ad5d49-9d31-11f0-9a36-047c1653ad92'
WHERE NOT EXISTS (
    SELECT 1 FROM activity WHERE name = 'Laser game'
    AND category_id = '30ad5d49-9d31-11f0-9a36-047c1653ad92'
);

INSERT INTO activity (activity_id, name, category_id)
SELECT UUID(), 'Paintball', '30ad5d49-9d31-11f0-9a36-047c1653ad92'
WHERE NOT EXISTS (
    SELECT 1 FROM activity WHERE name = 'Paintball'
    AND category_id = '30ad5d49-9d31-11f0-9a36-047c1653ad92'
);

INSERT INTO activity (activity_id, name, category_id)
SELECT UUID(), 'Réalité virtuelle (VR)', '30ad5d49-9d31-11f0-9a36-047c1653ad92'
WHERE NOT EXISTS (
    SELECT 1 FROM activity WHERE name = 'Réalité virtuelle (VR)'
    AND category_id = '30ad5d49-9d31-11f0-9a36-047c1653ad92'
);
