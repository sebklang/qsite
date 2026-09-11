import express from 'express'

import { indexGet, indexPost } from '../controllers/index.js'
import { roomGet, roomPost } from '../controllers/room.js'

var router = express.Router()

router.get('/', indexGet)
router.post('/', indexPost)
router.get('/:roomName', roomGet)
router.post('/:roomName', roomPost)

export default router
