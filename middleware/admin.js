// (三個) 代表 middleware (四個) 多 error 是錯誤處理
export default (req, res, next) => {
  if (req.student.role !== 1) {
    return res.status(403).send({ success: false, message: '權限不足' })
  } else {
    next()
  }
}
