import express from 'express'

import { indexGet } from '../controllers/index.js'
import { roomGet, roomPost } from '../controllers/room.js'

var router = express.Router()

router.get('/', indexGet)
router.get('/:roomName', roomGet)
router.post('/:roomName', roomPost)

export default router
