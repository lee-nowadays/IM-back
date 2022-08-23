// 如果很多地方會用到這個東西 可以獨立寫成一個 middleware，範例是登入登出都有，假如還有其他地方要用，獨立出來比較方便
export default (type) => {
  return (req, res, next) => {
    // console.log(req.headers['content-type'])
    // 如果請求沒有內容類型 或者是這個請求的內容類型不是 json 的話
    if (!req.headers['content-type'] || !req.headers['content-type'].includes(type)) {
      return res.status(400).send({ success: false, message: '資料格式錯誤' })
    }
    next()
  }
}
