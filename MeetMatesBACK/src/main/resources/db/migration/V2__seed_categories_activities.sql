-- =============================================================================
-- Seed data - Categories & Activities
-- MySQL 8.x
-- =============================================================================

-- ---------------------------------------------------------------------------
-- CATEGORIES
-- Using stable UUIDs for deterministic environments
-- ---------------------------------------------------------------------------
INSERT INTO category (category_id, name) VALUES
  ('10ad56ab-9d31-11f0-9a36-047c1653ad92', 'Sports collectifs'),
  ('10ad5b36-9d31-11f0-9a36-047c1653ad92', 'Sports de raquette'),
  ('10ad5c17-9d31-11f0-9a36-047c1653ad92', 'Activités de mobilité'),
  ('10ad5ceb-9d31-11f0-9a36-047c1653ad92', 'Jeux d''adresse'),
  ('10ad5db0-9d31-11f0-9a36-047c1653ad92', 'Fitness Bien-être'),
  ('10ad5c88-9d31-11f0-9a36-047c1653ad92', 'Danse'),
  ('20ad5d49-9d31-11f0-9a36-047c1653ad92', 'Jeux'),
  ('30ad5d49-9d31-11f0-9a36-047c1653ad92', 'Autres activités')
ON DUPLICATE KEY UPDATE
  name = VALUES(name);

-- ---------------------------------------------------------------------------
-- ACTIVITIES
-- Using stable UUIDs (no UUID() at insert-time)
-- ---------------------------------------------------------------------------
INSERT INTO activity (activity_id, name, category_id) VALUES
  -- Sports collectifs
  ('20000001-9d31-11f0-9a36-047c1653ad92', 'Football',         '10ad56ab-9d31-11f0-9a36-047c1653ad92'),
  ('20000002-9d31-11f0-9a36-047c1653ad92', 'Basketball',       '10ad56ab-9d31-11f0-9a36-047c1653ad92'),
  ('20000003-9d31-11f0-9a36-047c1653ad92', 'Ultimate frisbee', '10ad56ab-9d31-11f0-9a36-047c1653ad92'),
  ('20000004-9d31-11f0-9a36-047c1653ad92', 'Volleyball',       '10ad56ab-9d31-11f0-9a36-047c1653ad92'),

  -- Sports de raquette
  ('20000005-9d31-11f0-9a36-047c1653ad92', 'Badminton', '10ad5b36-9d31-11f0-9a36-047c1653ad92'),
  ('20000006-9d31-11f0-9a36-047c1653ad92', 'Padel',     '10ad5b36-9d31-11f0-9a36-047c1653ad92'),
  ('20000007-9d31-11f0-9a36-047c1653ad92', 'Ping-pong', '10ad5b36-9d31-11f0-9a36-047c1653ad92'),
  ('20000008-9d31-11f0-9a36-047c1653ad92', 'Tennis',    '10ad5b36-9d31-11f0-9a36-047c1653ad92'),

  -- Activités de mobilité
  ('20000009-9d31-11f0-9a36-047c1653ad92', 'Jogging',    '10ad5c17-9d31-11f0-9a36-047c1653ad92'),
  ('2000000a-9d31-11f0-9a36-047c1653ad92', 'Randonnée',  '10ad5c17-9d31-11f0-9a36-047c1653ad92'),
  ('2000000b-9d31-11f0-9a36-047c1653ad92', 'Roller',     '10ad5c17-9d31-11f0-9a36-047c1653ad92'),
  ('2000000c-9d31-11f0-9a36-047c1653ad92', 'Vélo / VTT', '10ad5c17-9d31-11f0-9a36-047c1653ad92'),

  -- Danse
  ('2000000d-9d31-11f0-9a36-047c1653ad92', 'Hip-hop',       '10ad5c88-9d31-11f0-9a36-047c1653ad92'),
  ('2000000e-9d31-11f0-9a36-047c1653ad92', 'Moderne-jazz',  '10ad5c88-9d31-11f0-9a36-047c1653ad92'),
  ('2000000f-9d31-11f0-9a36-047c1653ad92', 'Salsa',         '10ad5c88-9d31-11f0-9a36-047c1653ad92'),
  ('20000010-9d31-11f0-9a36-047c1653ad92', 'Zumba',         '10ad5c88-9d31-11f0-9a36-047c1653ad92'),

  -- Jeux d'adresse
  ('20000011-9d31-11f0-9a36-047c1653ad92', 'Mölkky',       '10ad5ceb-9d31-11f0-9a36-047c1653ad92'),
  ('20000012-9d31-11f0-9a36-047c1653ad92', 'Pétanque',     '10ad5ceb-9d31-11f0-9a36-047c1653ad92'),
  ('20000013-9d31-11f0-9a36-047c1653ad92', 'Fléchettes',   '10ad5ceb-9d31-11f0-9a36-047c1653ad92'),
  ('20000014-9d31-11f0-9a36-047c1653ad92', 'Palet breton', '10ad5ceb-9d31-11f0-9a36-047c1653ad92'),

  -- Fitness Bien-être
  ('20000015-9d31-11f0-9a36-047c1653ad92', 'Méditation',  '10ad5db0-9d31-11f0-9a36-047c1653ad92'),
  ('20000016-9d31-11f0-9a36-047c1653ad92', 'Musculation', '10ad5db0-9d31-11f0-9a36-047c1653ad92'),
  ('20000017-9d31-11f0-9a36-047c1653ad92', 'Stretching',  '10ad5db0-9d31-11f0-9a36-047c1653ad92'),
  ('20000018-9d31-11f0-9a36-047c1653ad92', 'Yoga',        '10ad5db0-9d31-11f0-9a36-047c1653ad92'),

  -- Jeux
  ('20000019-9d31-11f0-9a36-047c1653ad92', 'Jeux de cartes',   '20ad5d49-9d31-11f0-9a36-047c1653ad92'),
  ('2000001a-9d31-11f0-9a36-047c1653ad92', 'Jeux de société',  '20ad5d49-9d31-11f0-9a36-047c1653ad92'),
  ('2000001b-9d31-11f0-9a36-047c1653ad92', 'Jeux de rôle',     '20ad5d49-9d31-11f0-9a36-047c1653ad92'),
  ('2000001c-9d31-11f0-9a36-047c1653ad92', 'Quiz musicaux',    '20ad5d49-9d31-11f0-9a36-047c1653ad92'),

  -- Autres activités
  ('2000001d-9d31-11f0-9a36-047c1653ad92', 'Bowling',    '30ad5d49-9d31-11f0-9a36-047c1653ad92'),
  ('2000001e-9d31-11f0-9a36-047c1653ad92', 'Escape game','30ad5d49-9d31-11f0-9a36-047c1653ad92'),
  ('2000001f-9d31-11f0-9a36-047c1653ad92', 'Laser game', '30ad5d49-9d31-11f0-9a36-047c1653ad92'),
  ('20000020-9d31-11f0-9a36-047c1653ad92', 'Paintball',  '30ad5d49-9d31-11f0-9a36-047c1653ad92')
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  category_id = VALUES(category_id);