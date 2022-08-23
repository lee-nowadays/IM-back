import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '缺少姓名欄位'],
    minlength: [2, '姓名不得小於兩個字']
  },
  password: {
    type: String,
    minlength: [4, '密碼不得小於4個字']
  },
  tokens: {
    type: [String]
  },
  // 0 = user
  // 1 = admin
  role: {
    type: Number,
    default: 1
  }
}, { versionKey: false })

export default mongoose.model('admins', schema)
