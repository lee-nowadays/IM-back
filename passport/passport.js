import passport from 'passport'
import passportJWT from 'passport-jwt'
import passportLocal from 'passport-local'
import bcrypt from 'bcrypt'
import students from '../models/students.js'

const LocalStrategy = passportLocal.Strategy
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

passport.use('login', new LocalStrategy({
  usernameField: 'studentId',
  passwordField: 'password'
}, async (studentId, password, done) => {
  try {
    const student = await students.findOne({ studentId })
    if (!student) {
      return done(null, false, { message: '學號不存在' })
    }
    if (student.password === '00000000' && student.password === password) {
      return done(null, student)
      // return done(null, false, { message: '密碼錯誤' })
    } else if (!bcrypt.compareSync(password, student.password)) {
      return done(null, false, { message: '密碼錯誤' })
    }
    return done(null, student)
  } catch (error) {
    return done(error, false)
  }
}))

passport.use('jwt', new JWTStrategy({
  // 把 Token 取出來
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  // 設定解譯 jwt 用的 KEY
  secretOrKey: process.env.SECRET,
  // 把 req 傳進 callback 讓下面的 async 可以多塞 req
  passReqToCallback: true,
  // 忽略過期 (避免使用者收到 token 過期錯誤) ， 自己寫 jwt 過期的驗證
  ignoreExpiration: true
}, async (req, payload, done) => {
  const expired = payload.exp * 1000 < Date.now()
  if (expired && req.originalUrl !== '/students/extend' && req.originalUrl !== '/students/logout') {
    return done(null, false, { message: '登入逾期' })
  }
  const token = req.headers.authorization.split(' ')[1]
  try {
    const student = await students.findById(payload._id)
    if (!student) {
      return done(null, false, { message: '學生不存在' })
    }
    if (student.tokens.indexOf(token) === -1) {
      return done(null, false, { message: '驗證錯誤' })
    }
    return done(null, { student, token })
  } catch (error) {
    return done(error, false)
  }
}))
