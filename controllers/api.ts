import { Express } from 'express'
import { Server } from 'socket.io'
import { Request, Response, NextFunction } from 'express'
import { getRoom, getEntries } from '../models/room.js'
import db from '../models/db.js'

export function serializeEntries(entries: any[], room: any, sessionToken?: string | null) {
  return entries.map(e => ({
    id: e.id,
    name: e.name,
    description: e.description,
    created_at: e.created_at,
    isDeletable: !!sessionToken && (sessionToken === e.session_token || sessionToken === room.owner_token)
  }))
}

export async function apiGetEntries(req: Request, res: Response, next: NextFunction) {
  const roomName: any = req.params.roomName

  try {
    const room = await getRoom(db, roomName)
    if (!room) throw new Error(`Room ${roomName} was not found`)

    const entries = await getEntries(db, room.id)
    const token = req.cookies.session_token

    const result = serializeEntries(entries, room, token)
    res.json(result)
  } catch (err) {
    console.error(err)
    next()
  }
}

export function setupWebsocket(app: Express, io: Server) {
  app.set('io', io)

  io.on('connection', (socket) => {
    socket.on('room:join', async (roomName: string) => {
      const room = await getRoom(db, roomName)
      if (!room) return

      socket.join(roomName)

      const entries = await getEntries(db, room.id)
      const sessionToken = socket.request.headers.cookie
        ? socket.request.headers.cookie
            .split('; ')
            .find((c) => c.startsWith('session_token='))
            ?.split('=')[1] ?? null
        : null

      socket.emit('room:update', {
        roomName: room.name,
        entries: serializeEntries(entries, room, sessionToken ?? null)
      })
    })
  })
}