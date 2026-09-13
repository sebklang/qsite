CREATE TABLE users (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    name            TEXT NOT NULL UNIQUE
);

CREATE TABLE rooms (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    name            TEXT NOT NULL UNIQUE,
    displayname     TEXT,
    owner_token     TEXT NOT NULL
);

CREATE TABLE user_rooms (
    user_id         INTEGER NOT NULL REFERENCES users(id),
    room_id         INTEGER NOT NULL REFERENCES rooms(id),
    is_admin        BOOLEAN,
    PRIMARY KEY (user_id, room_id)
);

CREATE TABLE queue_entries (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    name            TEXT NOT NULL,
    description     TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    room_id         INTEGER NOT NULL REFERENCES rooms(id),
    user_id         INTEGER REFERENCES users(id),
    session_token   TEXT NOT NULL REFERENCES sessions(token)
);

CREATE TABLE sessions (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    token           TEXT NOT NULL UNIQUE,
    expires_at      TIMESTAMPTZ NOT NULL,
    user_id         INTEGER
);
