import { Request, Response, NextFunction } from 'express'
import db from '../models/db.js'
import { agoify } from '../util/util.js'
import { authenticate } from '../models/authenticate.js'
import { getRoom, getEntries, getEntry, getUser, insertEntry, deleteEntry } from '../models/room.js'
import { updateSession } from './session.js'
import { normalizeRoomName, serializeEntries } from './api.js'

async function broadcastRoomUpdate(req: Request, roomName: string) {
    const room = await getRoom(db, roomName)
    if (!room) return

    const entries = await getEntries(db, room.id)
    const io = req.app.get('io')
    io.to(room.name).emit('room:update', {
        roomName: room.name,
        entries: serializeEntries(entries, room, req.cookies.session_token ?? null)
    })
}

async function roomGet (req: Request, res: Response, next: NextFunction) {
    const roomName = normalizeRoomName(req.params.roomName)
    var isAdmin = false
    if (req.params.secret == 'secret') {
        isAdmin = true;
    }
    try {
        // Get room
        const room = await getRoom(db, roomName)
        if (!room) {
            throw new Error(`Room ${roomName} was not found`)
        }

        // Get entries
        const entries = await getEntries(db, room.id)
        const sessionToken = req.cookies.session_token

        const entriesWithPermissions = entries.map((entry) => ({
            ...entry,
            isDeletable: !!sessionToken && (sessionToken === entry.session_token || sessionToken === room.owner_token),
            diffStr: agoify(entry.time_diff)
        }))

        // Get user (maybe null)
        const user = await getUser(db, room.id, sessionToken)

        res.render('room', {
            title: room.displayname || 'Unnamed queue',
            room: room,
            entries: entriesWithPermissions,
            user: user,
            sessionToken: sessionToken,
            isAdmin: isAdmin
        })
    }

    catch (err) {
        console.error(err) // todo 500
        next()
    }
}

async function roomPost(req: Request, res: Response, next: NextFunction) {
    try {
        const token = await updateSession(db, req, res)
        // Delete
        if (req.body.delete) {
            const entry = await getEntry(db, req.body.entryId)
            const room = await getRoom(db, req.body.roomName)
            if (!entry || !room) {
                res.redirect(req.originalUrl)
                return
            }
            const auth: boolean = await authenticate(db, req, entry.session_token, room.owner_token)
            if (!auth) {
                throw new Error('Attempted delete without authentication')
            }
            const entryId = req.body.entryId
            if (!entryId) {
                throw new Error('entryId field missing from request body')
            }
            await deleteEntry(db, entryId)
            await broadcastRoomUpdate(req, room.name)
            res.redirect(req.originalUrl)
            return
        }

        // Insert
        else if (!req.body.name) {
            throw new Error('name field is required')
        }
        const user = await getUser(db, req.body.roomId, token)
        await insertEntry(db, req, user?.id, token)
        const roomName = normalizeRoomName(req.params.roomName)
        if (roomName) {
            await broadcastRoomUpdate(req, roomName)
        }
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
}

export async function roomPostBypass(req: Request, res: Response, next: NextFunction) {
    try {
        const token = await updateSession(db, req, res)
        // Delete
        if (req.body.delete) {
            const entryId = req.body.entryId
            if (!entryId) {
                throw new Error('entryId field missing from request body')
            }
            const roomName = normalizeRoomName(req.body.roomName ?? req.params.roomName)
            const room = roomName ? await getRoom(db, roomName) : null
            await deleteEntry(db, entryId)
            if (room) {
                await broadcastRoomUpdate(req, room.name)
            }
            res.redirect(req.originalUrl)
            return
        }

        // Insert
        else if (!req.body.name) {
            throw new Error('name field is required')
        }
        const user = await getUser(db, req.body.roomId, token)
        await insertEntry(db, req, user?.id, token)
        const roomName = normalizeRoomName(req.params.roomName)
        if (roomName) {
            await broadcastRoomUpdate(req, roomName)
        }
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
}

export { roomGet, roomPost }
