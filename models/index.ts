import { Request } from 'express'
import { Client } from 'pg'

export async function existsRoom(db: Client, req: Request) {
    const query = await db.query(`
        SELECT id FROM rooms WHERE name = $1`,
        [req.body.name]
    )
    return query.rows.length != 0
}

export async function createRoom(db: Client, name: string, displayname: string, token: string) {
    const query = await db.query(`
        INSERT INTO rooms (name, displayname, owner_token)
        VALUES ($1, $2, $3)`,
        [name, displayname, token]
    )
    return query
}
