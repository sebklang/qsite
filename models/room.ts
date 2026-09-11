import { Request } from 'express'
import { Client } from 'pg'

export async function getRoom(db: Client, roomName: string) {
    const roomQuery = await db.query(`
        SELECT id, name, displayname FROM rooms WHERE rooms.name = $1`,
        [roomName]
    )
    const room = roomQuery.rows?.[0]
    return room
}

export async function getEntries(db: Client, roomId: bigint) {
    const entriesQuery = await db.query(`
        SELECT
            id,
            name,
            description,
            user_id,
            session_token,
            NOW() - created_at AS time_diff
        FROM queue_entries
        WHERE room_id = $1`,
        [roomId]
    )
    return entriesQuery.rows
}

export async function getEntry(db: Client, entryId: bigint) {
    const entryQuery = await db.query(`
        SELECT id, name, description, created_at, room_id, session_token, user_id
        FROM queue_entries
        WHERE id = $1`,
        [entryId]
    )
    return entryQuery.rows?.[0]
}

export async function getUser(db: Client, roomId: bigint, token: string) {
    if (token) {
        const userQuery = await db.query(`
            SELECT
                users.id,
                users.name,
                user_rooms.is_admin
            FROM users
            JOIN sessions
            ON users.id = sessions.user_id
            LEFT JOIN user_rooms
            ON users.id = user_rooms.user_id
            WHERE sessions.token = $1
            AND user_rooms.room_id = $2`,
            [token, roomId]
        )
        var user = userQuery.rows?.[0]
        console.log(`user: ${user}`)
    }
    return user // maybe null
}

export async function insertEntry(db: Client, req: Request, userId: bigint) {
    const query = await db.query(`
        INSERT INTO queue_entries (name, description, room_id, session_token, user_id)
        VALUES ($1, $2, $3, $4, $5)`,
        [req.body.name, req.body.description, req.body.roomId, req.cookies.session_token, userId]
    )
    return query
}

export async function deleteEntry(db: Client, entryId: bigint) {
    const query = await db.query(`
        DELETE FROM queue_entries WHERE id = $1`,
        [entryId]
    )
    return query
}