CREATE TABLE users (
    id              BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name            TEXT NOT NULL UNIQUE
);

CREATE TABLE rooms (
    id              BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name            TEXT NOT NULL UNIQUE -- url
    displayname     TEXT -- on page
);

CREATE TABLE user_rooms (
    user_id         BIGINT NOT NULL REFERENCES users(id),
    room_id         BIGINT NOT NULL REFERENCES rooms(id),
    is_admin        BOOLEAN,
    PRIMARY KEY (user_id, room_id)
);

CREATE TABLE queue_entries (
    id              BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name            TEXT NOT NULL,
    description     TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    room_id         BIGINT NOT NULL REFERENCES rooms(id)
);

CREATE TABLE sessions (
    id              BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    token           TEXT NOT NULL UNIQUE,
    expires_at      TIMESTAMPTZ NOT NULL,
    user_id         BIGINT NOT NULL REFERENCES users(id)
);
