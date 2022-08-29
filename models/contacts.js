import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  subject: {
    type: String,
    required: [true, '缺少主旨']
  },
  description: {
    type: String,
    required: [true, '缺少描述']
  },
  question: {
    type: String,
    required: [true, '缺少問題類型']
  }
})

export default mongoose.model('contacts', schema)
