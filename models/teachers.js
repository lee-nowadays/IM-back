import mongoose from 'mongoose'
import validator from 'validator'

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '缺少姓名欄位'],
    minlength: [2, '姓名不得小於兩個字']
  },
  lab: {
    type: String
  },
  telephone: {
    type: String
  },
  fax: {
    type: String
  },
  email: {
    type: String,
    required: [true, '缺少信箱欄位'],
    unique: true,
    validate: {
      validator (email) {
        return validator.isEmail(email)
      },
      message: '信箱格式錯誤'
    }
  },
  image: {
    type: String,
    required: [true, '缺少老師照片']
  },
  proInterest: {
    type: String
  },
  experience: {
    type: String
  },
  course: {
    type: String
  }
})

export default mongoose.model('teachers', schema)
