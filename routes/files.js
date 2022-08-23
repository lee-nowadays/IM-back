import express from 'express'
import axios from 'axios'

const router = express.Router()

router.get('/:file', (req, res) => {
  axios({
    method: 'GET',
    url: 'http://' + process.env.FTP_HOST + '/' + process.env.FTP_USER + '/' + req.params.file,
    responseType: 'stream'
  }).then(result => {
    result.data.pipe(res)
  }).catch(error => {
    res.status(error.response.status).send({ success: false, message: '取得圖片失敗' })
  })
})

export default router
