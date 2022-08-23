import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  student: {
    type: mongoose.ObjectId,
    ref: 'students'
  },
  events: [{
    lecture: {
      type: mongoose.ObjectId,
      ref: 'articles',
      required: [true, '缺少講座資訊']
    },
    date: {
      type: Date
    }
  }]
})

export default mongoose.model('events', schema)
