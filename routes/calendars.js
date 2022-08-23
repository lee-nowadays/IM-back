import express from 'express'
import * as auth from '../middleware/auth.js'
import content from '../middleware/content.js'
import admin from '../middleware/admin.js'
import upload from '../middleware/upload.js'

import {
  createCalendar,
  getCalendar,
  getAllCalendars,
  editCalendar,
  deleteCalendar
} from '../controllers/calendars.js'

const router = express.Router()

router.post('/', content('application/json'), auth.jwt, admin, upload, createCalendar)
router.get('/', getCalendar)
router.get('/all', auth.jwt, admin, getAllCalendars)
router.patch('/:id', content('multipart/form-data'), auth.jwt, admin, upload, editCalendar)
router.delete('/:id', auth.jwt, admin, deleteCalendar)

export default router
