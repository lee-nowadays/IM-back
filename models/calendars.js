import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, '缺少標題']
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  }
})

export default mongoose.model('calendar', schema)
