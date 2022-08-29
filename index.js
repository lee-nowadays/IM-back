import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'

import './passport/passport.js'
import studentsRouter from './routes/students.js'
import articlesRouter from './routes/articles.js'
import eventsRouter from './routes/events.js'
import calendarsRouter from './routes/calendars.js'
import teachersRouter from './routes/teachers.js'
import filesRouter from './routes/files.js'
import contactsRouter from './routes/contacts.js'

mongoose.connect(process.env.DB_URL)

const app = express()

app.use(cors({
  origin (origin, callback) {
    if (origin === undefined || origin.includes('github') || origin.includes('localhost')) {
      callback(null, true)
    } else {
      callback(new Error('Not Allowed'), false)
    }
  }
}))
app.use((_, req, res, next) => {
  res.status(400).send({ success: false, message: '請求被拒絕' })
})

app.use(express.json())
// 處理錯誤 err 是 express 的錯誤 抓出來沒有什麼意義 要忽略掉的話用 _
app.use((_, req, res, next) => {
  res.status(400).send({ success: false, message: '請求格式錯誤' })
})

app.use('/students', studentsRouter)
app.use('/articles', articlesRouter)
app.use('/events', eventsRouter)
app.use('/calendars', calendarsRouter)
app.use('/teachers', teachersRouter)
app.use('/files', filesRouter)
app.use('/contacts', contactsRouter)

app.all('*', (req, res) => {
  res.status(404).send({ success: false, message: '找不到' })
})

app.listen(process.env.PORT || 4000, () => {
  console.log('Server is running')
})
