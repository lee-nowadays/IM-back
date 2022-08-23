import passport from 'passport'
import jsonwebtoken from 'jsonwebtoken'

export const login = (req, res, next) => {
  // (err, student, info) 是 done() 裡面傳出來的東西
  passport.authenticate('login', { session: false }, (err, student, info) => {
    if (err || !student) {
      // 遺失認證的東西
      if (info.message === 'Missing credentials') info.message = '驗證錯誤'
      return res.status(401).send({ success: false, message: info.message })
    }
    req.student = student
    next()
  })(req, res, next)
}

export const jwt = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, data, info) => {
    if (err || !data) {
      // 如果錯誤是 jsonwebtoken error
      if (info instanceof jsonwebtoken.JsonWebTokenError) {
        return res.status(401).send({ success: false, message: '驗證錯誤' })
      } else {
        return res.status(401).send({ success: false, message: info.message })
      }
    }
    req.student = data.student
    req.token = data.token
    next()
  })(req, res, next)
}
