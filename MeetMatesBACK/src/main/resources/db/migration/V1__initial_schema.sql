-- =============================================================================
-- V1__initial_schema.sql
-- MeetMates - Initial schema
-- MySQL 8.x / InnoDB / utf8mb4
-- =============================================================================

-- ---------------------------------------------------------------------------
-- USERS
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  user_id              CHAR(36)      NOT NULL,
  first_name           VARCHAR(255)  NOT NULL,
  last_name            VARCHAR(255)  NOT NULL,
  email                VARCHAR(254)  NOT NULL,
  password             VARCHAR(255)  NOT NULL,

  age                  INT           NULL,
  city                 VARCHAR(255)  NULL,

  enabled              BOOLEAN       NOT NULL DEFAULT FALSE,

  status               VARCHAR(32)   NOT NULL,
  role                 VARCHAR(32)   NOT NULL,

  accepted_cgu_at      DATETIME(6)   NULL,

  created_at           DATETIME(6)   NOT NULL,
  updated_at           DATETIME(6)   NOT NULL,
  deleted_at           DATETIME(6)   NULL,

  profile_picture_url  VARCHAR(1024) NULL,

  PRIMARY KEY (user_id),
  CONSTRAINT uk_users_email UNIQUE (email),

  INDEX idx_users_status (status),
  INDEX idx_users_role (role),
  INDEX idx_users_enabled (enabled),
  INDEX idx_users_deleted_at (deleted_at)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_0900_ai_ci;

ALTER TABLE users
  ADD CONSTRAINT chk_users_role
  CHECK (role IN ('USER', 'MODERATOR', 'ADMIN'));

ALTER TABLE users
  ADD CONSTRAINT chk_users_status
  CHECK (status IN ('ACTIVE', 'BANNED', 'DELETED'));

-- ---------------------------------------------------------------------------
-- TOKENS
-- Token.id has no @JdbcTypeCode(SqlTypes.CHAR) -> Hibernate expects BINARY(16)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS token (
  id            BINARY(16)    NOT NULL,
  token         VARCHAR(255)  NOT NULL,
  user_id       CHAR(36)      NOT NULL,

  created_at    TIMESTAMP(6)  NOT NULL,
  expires_at    TIMESTAMP(6)  NULL,
  confirmed_at  TIMESTAMP(6)  NULL,

  used          BOOLEAN       NOT NULL DEFAULT FALSE,
  type          VARCHAR(32)   NOT NULL,

  PRIMARY KEY (id),
  CONSTRAINT uk_token_token UNIQUE (token),

  CONSTRAINT fk_token_user
    FOREIGN KEY (user_id)
    REFERENCES users (user_id)
    ON DELETE CASCADE,

  INDEX idx_token_user (user_id),
  INDEX idx_token_user_type (user_id, type),
  INDEX idx_token_expires_at (expires_at)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_0900_ai_ci;

ALTER TABLE token
  ADD CONSTRAINT chk_token_type
  CHECK (type IN ('REFRESH', 'PASSWORD_RESET', 'VERIFICATION'));

-- ---------------------------------------------------------------------------
-- PICTURE_USER
-- PictureUser.id has no @JdbcTypeCode(SqlTypes.CHAR) -> Hibernate expects BINARY(16)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS picture_user (
  id           BINARY(16)    NOT NULL,
  user_id      CHAR(36)      NOT NULL,

  url          VARCHAR(1024) NOT NULL,
  public_id    VARCHAR(255)  NOT NULL,

  is_main      BOOLEAN       NOT NULL DEFAULT FALSE,

  created_at   DATETIME(6)   NOT NULL,
  updated_at   DATETIME(6)   NULL,
  deleted_at   DATETIME(6)   NULL,

  PRIMARY KEY (id),

  CONSTRAINT fk_picture_user_user
    FOREIGN KEY (user_id)
    REFERENCES users (user_id)
    ON DELETE CASCADE,

  INDEX idx_picture_user_user (user_id),
  INDEX idx_picture_user_deleted_at (deleted_at),

  CONSTRAINT uk_picture_user_main
    UNIQUE (user_id, is_main, deleted_at)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_0900_ai_ci;

-- ---------------------------------------------------------------------------
-- ADDRESSES
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS addresses (
  id           CHAR(36)      NOT NULL,
  street       VARCHAR(255)  NULL,
  city         VARCHAR(255)  NULL,
  postal_code  VARCHAR(32)   NULL,

  PRIMARY KEY (id),

  INDEX idx_addresses_city (city),
  INDEX idx_addresses_postal_code (postal_code)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_0900_ai_ci;

-- ---------------------------------------------------------------------------
-- CATEGORY
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS category (
  category_id  CHAR(36)      NOT NULL,
  name         VARCHAR(255)  NOT NULL,

  PRIMARY KEY (category_id),
  CONSTRAINT uk_category_name UNIQUE (name),

  INDEX idx_category_name (name)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_0900_ai_ci;

-- ---------------------------------------------------------------------------
-- ACTIVITY
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS activity (
  activity_id  CHAR(36)      NOT NULL,
  name         VARCHAR(255)  NOT NULL,
  category_id  CHAR(36)      NULL,

  PRIMARY KEY (activity_id),

  CONSTRAINT fk_activity_category
    FOREIGN KEY (category_id)
    REFERENCES category (category_id)
    ON DELETE CASCADE,

  INDEX idx_activity_category (category_id),
  INDEX idx_activity_name (name)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_0900_ai_ci;

-- ---------------------------------------------------------------------------
-- EVENTS
-- Event.id has @JdbcTypeCode(SqlTypes.CHAR) -> CHAR(36)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS events (
  event_id          CHAR(36)      NOT NULL,

  title             VARCHAR(255)  NOT NULL,
  description       TEXT          NULL,

  event_date        DATE          NOT NULL,
  start_time        TIME          NOT NULL,
  end_time          TIME          NOT NULL,

  max_participants  INT           NULL,

  status            VARCHAR(32)   NOT NULL,
  material          VARCHAR(32)   NOT NULL,
  level             VARCHAR(32)   NOT NULL,

  address_id        CHAR(36)      NOT NULL,
  activity_id       CHAR(36)      NOT NULL,

  created_at        DATETIME(6)   NOT NULL,
  updated_at        DATETIME(6)   NULL,
  deleted_at        DATETIME(6)   NULL,

  PRIMARY KEY (event_id),

  CONSTRAINT fk_events_address
    FOREIGN KEY (address_id)
    REFERENCES addresses (id)
    ON DELETE RESTRICT,

  CONSTRAINT fk_events_activity
    FOREIGN KEY (activity_id)
    REFERENCES activity (activity_id)
    ON DELETE RESTRICT,

  INDEX idx_events_event_date (event_date),
  INDEX idx_events_activity (activity_id),
  INDEX idx_events_status (status),
  INDEX idx_events_deleted_at (deleted_at)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_0900_ai_ci;

ALTER TABLE events
  ADD CONSTRAINT chk_events_status
  CHECK (status IN ('OPEN', 'FULL', 'CANCELLED', 'FINISHED'));

ALTER TABLE events
  ADD CONSTRAINT chk_events_material
  CHECK (material IN ('PROVIDED', 'YOUR_OWN', 'NOT_REQUIRED'));

ALTER TABLE events
  ADD CONSTRAINT chk_events_level
  CHECK (level IN ('BEGINNER', 'INTERMEDIATE', 'EXPERT', 'ALL_LEVELS'));

-- ---------------------------------------------------------------------------
-- EVENT_USER
-- EventUser.id has @JdbcTypeCode(SqlTypes.CHAR) -> CHAR(36)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS event_user (
  event_user_id         CHAR(36)      NOT NULL,
  event_id              CHAR(36)      NOT NULL,
  user_id               CHAR(36)      NOT NULL,

  role                  VARCHAR(32)   NOT NULL,
  participation_status  VARCHAR(32)   NOT NULL,

  joined_at             DATETIME(6)   NOT NULL,
  user_email            VARCHAR(254)  NOT NULL,

  PRIMARY KEY (event_user_id),

  CONSTRAINT uk_event_user_event_user UNIQUE (event_id, user_id),

  CONSTRAINT fk_event_user_event
    FOREIGN KEY (event_id)
    REFERENCES events (event_id)
    ON DELETE CASCADE,

  CONSTRAINT fk_event_user_user
    FOREIGN KEY (user_id)
    REFERENCES users (user_id)
    ON DELETE CASCADE,

  INDEX idx_event_user_event (event_id),
  INDEX idx_event_user_user (user_id),
  INDEX idx_event_user_status (participation_status),
  INDEX idx_event_user_role (role)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_0900_ai_ci;

ALTER TABLE event_user
  ADD CONSTRAINT chk_event_user_role
  CHECK (role IN ('ORGANIZER', 'PARTICIPANT'));

ALTER TABLE event_user
  ADD CONSTRAINT chk_event_user_participation_status
  CHECK (participation_status IN ('PENDING', 'ACCEPTED', 'REJECTED', 'LEFT', 'LEFT_REJECTED'));