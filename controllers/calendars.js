import calendars from '../models/calendars.js'

export const createCalendar = async (req, res) => {
  try {
    const calendar = await calendars.create({
      title: req.body.title,
      startDate: req.body.startDate,
      endDate: req.body.endDate
    })
    res.status(200).send({ success: true, message: '', calendar })
  } catch (error) {
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      return res.status(400).send({ success: false, message })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

export const getCalendar = async (req, res) => {
  try {
    const calendar = await calendars.find()
    res.status(200).send({ success: true, message: '', calendar })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const getAllCalendars = async (req, res) => {
  try {
    const calendar = await calendars.find().sort({ date: -1 })
    res.status(200).send({ success: true, message: '', calendar })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const editCalendar = async (req, res) => {
  try {
    const data = {
      title: req.body.title
    }
    const calendar = await calendars.findByIdAndUpdate(req.params.id, data, { new: true })
    res.status(200).send({ success: true, message: '', calendar })
  } catch (error) {
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      return res.status(400).send({ success: false, message })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}
export const deleteCalendar = async (req, res) => {
  try {
    await calendars.findByIdAndDelete(req.params.id)
    res.status(200).send({ success: true, message: '' })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}
