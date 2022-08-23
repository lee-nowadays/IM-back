import { v2 as cloudinary } from 'cloudinary'
// import { CloudinaryStorage } from 'multer-storage-cloudinary'
import multer from 'multer'
import FTPStorage from 'multer-ftp'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
})

// 設定
const upload = multer({
  storage: new FTPStorage({
    ftp: {
      host: process.env.FTP_HOST,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASSWORD
    }
  }),
  fileFilter (req, file, callback) {
    if (!file.mimetype.startsWith('image') && file.fieldname === 'image') {
      callback(new multer.MulterError('LIMIT_FORMAT'), false)
    } else if (!['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.mimetype) && file.fieldname === 'files') {
      callback(new multer.MulterError('LIMIT_FORMAT'), false)
    } else {
      callback(null, true)
    }
  },
  limits: {
    fieldSize: 1024 * 1024 // 檔案上限 1MB
  }
})
// 上傳圖片只是上傳到 server，所以需要我們設定上傳到雲端，回傳網址再塞進資料庫
// 真的上傳
export default async (req, res, next) => {
  // 接受 0 到 1 個，就算是 0 個也不會出事情
  upload.fields([{ name: 'image', maxCount: 1 }, { name: 'files', maxCount: 5 }])(req, res, async error => {
    if (error instanceof multer.MulterError) {
      let message = '上傳失敗'
      if (error.code === 'LIMIT_FILE_SIZE') {
        message = '檔案太大'
      } else if (error.code === 'LIMIT_FORMAT') {
        message = '檔案格式錯誤'
      }
      res.status(400).send({ success: false, message })
    } else if (error) {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    } else {
      next()
    }
  })
  // 處理完會產生 req.file
}
