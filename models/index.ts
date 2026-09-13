import { Request } from 'express'
import { Database } from 'sqlite'

export async function existsRoom(db: Database, req: Request) {
    const room = await db.get(`
        SELECT id FROM rooms WHERE name = $1`,
        [req.body.name]
    )
    return !!room
}

export async function createRoom(db: Database, name: string, displayname: string, token: string) {
    const query = await db.run(`
        INSERT INTO rooms (name, displayname, owner_token)
        VALUES (?1, ?2, ?3)`,
        [name, displayname, token]
    )
    return query
}
