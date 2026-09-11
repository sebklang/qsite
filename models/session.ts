import { Request } from 'express'
import { Client } from 'pg'

export async function insertSession(db: Client, token: string, expiresAt: Date, userId: string) {
    const insertQuery = await db.query(`
        INSERT INTO sessions (token, expires_at, user_id)
        VALUES ($1, $2, $3)`,
        [token, expiresAt, userId]
    )
    return insertQuery
}

export async function getSession(db: Client, token: string) {
    const query = await db.query(`
        SELECT id, token, expires_at, user_id
        FROM sessions
        WHERE token = $1`,
        [token]
    )
    return query.rows?.[0]
}

export async function deleteSession(db: Client, token: string) {
    const query = await db.query(`
        DELETE FROM queue_entries WHERE session_token = $1;
        DELETE FROM sessions WHERE token = $1`,
        [token]
    )
    return query
}
