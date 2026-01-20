-- ================================
-- CATEGORIES (idempotent)
-- ================================

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

-- ================================
-- ACTIVITIES (idempotent)
-- ================================

-- Sports collectifs
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

-- 👉 Répéter EXACTEMENT le même pattern
-- pour toutes les autres catégories
-- (raquette, mobilité, danse, jeux, etc.)

