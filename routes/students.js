import express from 'express'
import * as auth from '../middleware/auth.js'
import content from '../middleware/content.js'
import admin from '../middleware/admin.js'
import upload from '../middleware/upload.js'

import {
  createStudent,
  login,
  logout,
  extend,
  getAllStudents,
  getStudentProfile,
  getStudent,
  editStudentProfile,
  editStudent,
  addLecture,
  getMyLecture,
  editLecture,
  deleteStudent
} from '../controllers/students.js'

const router = express.Router()

// 過了 auth 這關 裡面會多req.user req.token 這種東西
// 可以同時傳圖片跟資料的，之後給最新消息那些用
// router.post('/', content('multipart/form-data'), createStudent)
router.post('/', content('multipart/form-data'), auth.jwt, admin, upload, createStudent)
router.post('/login', content('application/json'), auth.login, login)
router.delete('/logout', auth.jwt, logout)
router.post('/extend', auth.jwt, extend)
router.get('/all', auth.jwt, admin, getAllStudents)
router.get('/', auth.jwt, getStudent)
router.get('/lectures', auth.jwt, getMyLecture)
router.get('/:id', auth.jwt, getStudentProfile)
router.patch('/lectures', content('application/json'), auth.jwt, editLecture)
router.post('/lectures', content('application/json'), auth.jwt, addLecture)
router.patch('/me', content('multipart/form-data'), auth.jwt, upload, editStudentProfile)
router.patch('/:id', content('multipart/form-data'), auth.jwt, admin, upload, editStudent)
router.delete('/:id', auth.jwt, admin, deleteStudent)
export default router
