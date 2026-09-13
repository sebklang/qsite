import { Request } from 'express'
import { Database } from 'sqlite'

export async function getRoom(db: Database, roomName: string) {
    const room = await db.get(`
        SELECT id, name, displayname, owner_token
        FROM rooms
        WHERE rooms.name = ?1`,
        [roomName]
    )
    return room
}

export async function getEntries(db: Database, roomId: bigint) {
    const entriesQuery = await db.all(`
        SELECT
            id,
            name,
            description,
            user_id,
            session_token,
            created_at,
            (julianday('now') - julianday(created_at)) * 86400 AS time_diff
        FROM queue_entries
        WHERE room_id = ?1`,
        [roomId]
    )
    return entriesQuery
}

export async function getEntry(db: Database, entryId: bigint) {
    const entryQuery = await db.get(`
        SELECT id, name, description, created_at, room_id, session_token, user_id
        FROM queue_entries
        WHERE id = ?1`,
        [entryId]
    )
    return entryQuery
}

export async function getUser(db: Database, roomId: bigint, token: string) {
    if (!token) {
        return null
    }
    var user = await db.get(`
        SELECT
            users.id,
            users.name,
            user_rooms.is_admin
        FROM users
        JOIN sessions
        ON users.id = sessions.user_id
        LEFT JOIN user_rooms
        ON users.id = user_rooms.user_id
        WHERE sessions.token = ?1
        AND user_rooms.room_id = ?2`,
        [token, roomId]
    )
    return user
}

export async function insertEntry(db: Database, req: Request, userId: bigint, token: string) {
    const query = await db.run(`
        INSERT INTO queue_entries (name, description, room_id, session_token, user_id)
        VALUES (?1, ?2, ?3, ?4, ?5)`,
        [req.body.name, req.body.description, req.body.roomId, token, userId]
    )
    return query
}

export async function deleteEntry(db: Database, entryId: bigint) {
    const query = await db.run(`
        DELETE FROM queue_entries WHERE id = ?1`,
        [entryId]
    )
    return query
}
