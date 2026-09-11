import { Request, Response, NextFunction } from 'express'
import { connect } from '../models/connect.js'
import { existsRoom, createRoom } from '../models/index.js'
import { updateSession } from '../controllers/session.js'

export function indexGet(req: Request, res: Response, next: NextFunction) {
    res.render('index', { title: 'Qsite' })
}

export async function indexPost(req: Request, res: Response, next: NextFunction) {
    const db = await connect()
    const expiresAt = new Date(2050, 0, 0) // 900 seconds
    try {
        const token = await updateSession(db, req, res)
        if (!existsRoom(db, req)) {
            res.status(200).send(`Room already exists. Click <a href=${req.originalUrl}>here</a> to go back.`)
        }
        const roomQuery = await createRoom(db, req.body.name, req.body.displayname, token)
        res.redirect(`/${req.body.name}`)
    }

    catch (err) {
        console.error(err)
        next()
    }

    finally {
        db.end()
    }
}
