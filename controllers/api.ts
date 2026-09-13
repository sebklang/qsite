import { Request, Response, NextFunction } from 'express'
import { getRoom, getEntries } from '../models/room.js'
import db from '../models/db.js'

// id, description, isDeletable

export async function apiGetEntries(req: Request, res: Response, next: NextFunction) {
    const roomName: any = req.params.roomName // todo type

    try {
        // Get room
        const room = await getRoom(db, roomName)
        if (!room) {
            throw new Error(`Room ${roomName} was not found`)
        }

        const entries = await getEntries(db, room.id)
        const token = req.cookies.session_token

        const result = entries.map(e => {return {
            id: e.id,
            name: e.name,
            description: e.description,
            created_at: e.created_at,
            isDeletable: token && (token == e.session_token || token == room.owner_token)
        }})

        res.json(result)
    }
    catch(err) {
        console.error(err) // todo 500
        next()
    }
}
