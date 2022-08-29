import express from 'express'
import content from '../middleware/content.js'
import upload from '../middleware/upload.js'

import {
  createContact,
  getAllContact
} from '../controllers/contacts.js'

const router = express.Router()

router.post('/', content('multipart/form-data'), upload, createContact)
router.get('/', getAllContact)

export default router
