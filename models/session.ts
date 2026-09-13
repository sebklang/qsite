import { Request } from 'express'
import { Database } from 'sqlite'

export async function insertSession(db: Database, token: string, expiresAt: Date, userId: string) {
    const insertQuery = await db.run(`
        INSERT INTO sessions (token, expires_at, user_id)
        VALUES (?1, ?2, ?3)`,
        [token, expiresAt, userId]
    )
    return insertQuery
}

export async function getSession(db: Database, token: string) {
    const session = await db.get(`
        SELECT id, token, expires_at, user_id
        FROM sessions
        WHERE token = ?1`,
        [token]
    )
    return session
}

export async function deleteSession(db: Database, token: string) {
    const query = await db.exec(`
        BEGIN TRANSACTION;
        DELETE FROM queue_entries WHERE session_token = ${token};
        DELETE FROM sessions WHERE token = ${token};
        COMMIT;
    `)
    return query
}
