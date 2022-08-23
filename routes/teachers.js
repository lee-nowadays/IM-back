import express from 'express'
import * as auth from '../middleware/auth.js'
import content from '../middleware/content.js'
import admin from '../middleware/admin.js'
import upload from '../middleware/upload.js'

import {
  createTeacher,
  getTeachers,
  getAllTeachers,
  editTeacher,
  deleteTeacher
} from '../controllers/teachers.js'

const router = express.Router()

router.post('/', content('multipart/form-data'), auth.jwt, admin, upload, createTeacher)
router.get('/', getTeachers)
router.get('/all', auth.jwt, admin, getAllTeachers)
router.patch('/:id', content('multipart/form-data'), auth.jwt, admin, upload, editTeacher)
router.delete('/:id', auth.jwt, admin, deleteTeacher)
export default router
