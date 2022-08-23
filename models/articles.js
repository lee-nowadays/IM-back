import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, '缺少標題欄位']
  },
  content: {
    type: String
  },
  image: {
    type: String
  },
  files: {
    type: [String]
  },
  category: {
    type: String,
    required: true,
    enum: {
      values: ['最新消息', '講座資訊', '競賽資訊'],
      message: '文章分類錯誤'
    }
  },
  post: {
    type: Boolean,
    default: false
  },
  date: {
    type: Date,
    required: [true, '請選擇日期']
  }
})

export default mongoose.model('articles', schema)
