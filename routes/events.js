import express from 'express'
import * as auth from '../middleware/auth.js'
import admin from '../middleware/admin.js'

import {
  createEvent,
  getMyEvents,
  getAllEvents
} from '../controllers/events.js'

const router = express.Router()

router.post('/', auth.jwt, createEvent)
router.get('/', auth.jwt, getMyEvents)
router.get('/all', auth.jwt, admin, getAllEvents)

export default router
