import { Request, Response, NextFunction } from 'express'
import { agoify } from '../util/util.js'
import { connect } from '../models/connect.js'
import { authenticate } from '../models/authenticate.js'
import { getRoom, getEntries, getEntry, getUser, insertEntry, deleteEntry } from '../models/room.js'
//import { existsSession, createSession } from '../models/session.js'
import { updateSession } from './session.js'

async function roomGet (req: Request, res: Response, next: NextFunction) {
    const db = await connect()
    const roomName: any = req.params.roomName // todo type
    try {
        // Get room
        const room = await getRoom(db, roomName)
        if (!room) {
            throw new Error(`Room ${roomName} was not found`)
        }

        // Get entries
        const entries = await getEntries(db, room.id)

        // Generate "time ago" fields
        for (const entry of entries) {
            entry.diffStr = agoify(entry.time_diff)
        }

        // Get user (maybe null)
        const user = await getUser(db, room.id, req.cookies.session_token)

        res.render('room', {
            room: room,
            entries: entries,
            user: user,
            sessionToken: req.cookies.session_token
        })
    }

    catch (err) {
        console.error(err) // todo 500
        next()
    }

    finally {
        db.end()
    }
}

async function roomPost(req: Request, res: Response, next: NextFunction) {
    const db = await connect()
    try {
        const token = await updateSession(db, req, res)
        // Delete
        if (req.body.delete) {
            const entry = await getEntry(db, req.body.entryId)
            const room = await getRoom(db, req.body.roomName)
            const auth: boolean = await authenticate(db, req, entry.session_token, room.owner_token)
            if (!auth) {
                throw new Error('Attempted delete without authentication')
            }
            const entryId = req.body.entryId
            if (!entryId) {
                throw new Error('entryId field missing from request body')
            }
            const query = await deleteEntry(db, entryId)
            res.redirect(req.originalUrl)
            return
        }

        // Insert
        else if (!req.body.name) {
            throw new Error('name field is required')
        }
        const user = await getUser(db, req.body.roomId, token)
        const query = await insertEntry(db, req, user?.id, token)
        res.redirect(req.originalUrl)
    }

    catch (err: any) {
        console.error(err)
        res.status(500).send(`
            Internal server error: ${err.message}.
            <a href=${req.originalUrl}>Click here</a>
            to go back to the previous page.`
        )
    }

    finally {
        db.end()
    }
}

export { roomGet, roomPost }
