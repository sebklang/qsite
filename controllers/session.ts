import { Request , Response } from 'express'
import { Client } from 'pg'
import { insertSession, getSession, deleteSession } from '../models/session.js'
import crypto from 'crypto'

export function generateToken() {
    return crypto.randomBytes(32).toString('hex')
}

export async function updateSession(db: Client, req: Request, res: Response) {
    var token = req.cookies.session_token
    const session = await getSession(db, token)
    const expired = new Date() > session?.expires_at
    if (expired) {
        await deleteSession(db, token)
    }
    if (!session || expired) {
        token = generateToken()
        res.cookie('session_token', token)
        await insertSession(db, token, new Date(2050, 0, 0), req.body.userId)
    }
    return token
}
