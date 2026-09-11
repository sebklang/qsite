import { Request, Response, NextFunction } from 'express'
import { agoify } from '../util/util.js'
import { connect } from '../models/connect.js'
import { authenticate } from '../models/authenticate.js'

async function roomGet (req: Request, res: Response, next: NextFunction) {
    const db = await connect()
    const roomName = req.params.roomName
    try {
        // Get room
        const roomQuery = await db.query(`
            SELECT id, name, displayname FROM rooms WHERE rooms.name = $1`,
            [roomName]
        )
        const room = roomQuery.rows?.[0]
        if (!room) {
            throw new Error(`Room ${roomName} was not found`)
        }

        // Get entries
        const entriesQuery = await db.query(`
            SELECT
                id,
                name,
                description,
                NOW() - created_at AS time_diff
            FROM queue_entries
            WHERE room_id = $1`,
            [room.id]
        )
        // Generate "time ago" fields
        const entries = entriesQuery.rows
        for (const entry of entries) {
            entry.diffStr = agoify(entry.time_diff)
        }

        // Get user
        const token = req.cookies.session_token
        if (token) {
            const userQuery = await db.query(`
                SELECT users.id, users.name, user_rooms.is_admin
                FROM users
                JOIN sessions
                ON users.id = sessions.user_id
                LEFT JOIN user_rooms
                ON users.id = user_rooms.user_id
                WHERE sessions.token = $1
                AND user_rooms.room_id = $2`,
                [token, room.id]
            )
            var user = userQuery.rows?.[0]
        }

        console.log("token == " + token)
        console.log("room.id == " + room.id)
        console.log("Upon rendering room, user ==")
        console.log(user)

        res.render('room', {
            room: room,
            entries: entries,
            user: user // nullable
        })
    }

    catch (err) {
        console.error(err)
        next()
    }

    finally {
        db.end()
    }
}

async function roomPost(req: Request, res: Response, next: NextFunction) {
    const db = await connect()
    try {
        if (req.body.delete) {
            const auth: boolean = await authenticate(db, req)
            if (!auth) {
                throw new Error('Attempted delete without authentication')
            }
            else {
                const entryId = req.body.entryId
                if (!entryId) {
                    throw new Error('entryId field missing from request body')
                }
                const query = await db.query(`
                    DELETE FROM queue_entries WHERE id = $1`,
                    [entryId]
                )
                res.redirect(req.originalUrl)
            }
        }

        else { // !delete ==> insert
            const query = await db.query(`
                INSERT INTO queue_entries (name, description, room_id)
                VALUES ($1, $2, $3)`,
                [req.body.name, req.body.description, req.body.roomId]
            )
            res.redirect(req.originalUrl)
        }
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
