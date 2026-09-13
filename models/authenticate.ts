import { Request } from 'express'
import { Database } from 'sqlite'

export function getCookie(req: Request, cookie: string) {
    const result = req.cookies[cookie]
    if (!result) {
        throw new Error(`${cookie} not found`)
    }
    return result
}

export async function authenticate(db: Database, req: Request, entryToken?: string, roomToken?: string): Promise<boolean> {
    const token = getCookie(req, 'session_token')

    if (entryToken && entryToken == token) {
        return true
    }
    if (roomToken && roomToken == token) {
        return true;
    }


    const roomId = req.body.roomId
    if (!roomId) {
        throw new Error('Room ID missing from request body') // todo
    }

    const user = await db.get(`
        SELECT users.id
        FROM users
        JOIN sessions
        ON users.id = sessions.user_id
        WHERE sessions.token = ?1`,
        [token]
    )
    if (!user) {
        throw new Error('User with given token not found')
    }

    const admin = await db.get(`
        SELECT is_admin
        FROM user_rooms
        WHERE user_id = ?1
        AND   room_id = ?2`,
        [user.id, roomId]
    )
    if (!admin) {
        return false
    }

    return true
}
