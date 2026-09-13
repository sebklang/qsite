import express from 'express'

import { indexGet, indexPost } from '../controllers/index.js'
import { roomGet, roomPost, roomPostBypass } from '../controllers/room.js'
import { apiGetEntries } from '../controllers/api.js'

var router = express.Router()

router.get('/api/:roomName', apiGetEntries)

router.get('/', indexGet)
router.post('/', indexPost)
router.get('/:roomName/:secret', roomGet)
router.get('/:roomName', roomGet)
router.post('/:roomName/:secret', roomPostBypass)
router.post('/:roomName', roomPost)

export default router
