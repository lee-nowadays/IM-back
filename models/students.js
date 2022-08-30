import mongoose from 'mongoose'
import validator from 'validator'

const schema = new mongoose.Schema({
  studentId: {
    type: Number,
    required: [true, '缺少學號欄位'],
    minlength: [8, '學號8個數字'],
    maxlength: [8, '學號不得超過8個數字'],
    unique: true
  },
  password: {
    type: String,
    default: '00000000'
  },
  name: {
    type: String,
    required: [true, '缺少姓名欄位'],
    minlength: [2, '姓名不得小於兩個字']
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
  class: {
    type: String,
    required: [true, '缺少班級欄位'],
    minlength: [3, '班級不得小於三個字'],
    maxlength: [6, '班級不得超過六個字']
  },
  residenceAddress: {
    type: String,
    required: [true, '缺少戶籍地址欄位'],
    unique: true
  },
  currentAddress: {
    type: String,
    required: [true, '缺少聯絡地址欄位'],
    unique: true
  },
  personalId: {
    type: String,
    required: [true, '缺少身份證字號欄位'],
    maxlength: [10, '身份證字號不得超過十個數字'],
    unique: true,
    match: [/^[A-Z]?[1-2]?[0-9]*$/, '身份證字號格式錯誤']
  },
  phone: {
    type: String,
    required: [true, '缺少電話欄位'],
    minlength: [10, '電話要十個數字'],
    maxlength: [10, '電話不得超過十個數字'],
    unique: true,
    match: [/^[0][9][0-9]*$/, '電話號碼格式錯誤']
  },
  lectures: {
    type: [
      {
        lecture: {
          type: mongoose.ObjectId,
          ref: 'articles',
          required: [true, '沒有報名講座']
        },
        date: {
          type: Date
        }
      }
    ]
  },
  tokens: {
    type: [String]
  },
  // 0 = user
  // 1 = admin
  role: {
    type: Number,
    default: 0
  }
}, { versionKey: false })

export default mongoose.model('students', schema)
