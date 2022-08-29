import contacts from '../models/contacts.js'

export const createContact = async (req, res) => {
  try {
    const contact = await contacts.create({
      subject: req.body.subject,
      description: req.body.description,
      question: req.body.question
    })
    res.status(200).send({ success: true, message: '', contact })
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

export const getAllContact = async (req, res) => {
  try {
    const contact = await contacts.find()
    res.status(200).send({ success: true, message: '', contact })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}
