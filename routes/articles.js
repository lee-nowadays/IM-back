import express from 'express'
import * as auth from '../middleware/auth.js'
import content from '../middleware/content.js'
import admin from '../middleware/admin.js'
import upload from '../middleware/upload.js'

import {
  createArticle,
  getArticles,
  getAllArticles,
  getArticle,
  postArticle,
  editArticle,
  deleteArticle
} from '../controllers/articles.js'

const router = express.Router()

router.post('/', content('multipart/form-data'), auth.jwt, admin, upload, createArticle)
// 預設只顯示有發表的文章
router.get('/', getArticles)
// 包含未發表文章 管理員用
router.get('/all', auth.jwt, admin, getAllArticles)
// 如果 id 放在 all 上面的話，all 會被當成 id，順序有差
router.get('/:id', getArticle)
router.patch('/:id/post', content('application/json'), auth.jwt, admin, postArticle)
router.patch('/:id', content('multipart/form-data'), auth.jwt, admin, upload, editArticle)
router.delete('/:id', auth.jwt, admin, deleteArticle)
export default router
