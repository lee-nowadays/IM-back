import teachers from '../models/teachers.js'

export const createTeacher = async (req, res) => {
  try {
    const teacher = await teachers.create({
      name: req.body.name,
      image: req.files?.image?.[0]?.path || '',
      proInterest: req.body.proInterest,
      experience: req.body.experience,
      course: req.body.course,
      lab: req.body.lab,
      email: req.body.email,
      telephone: req.body.telephone,
      fax: req.body.fax
    })
    res.status(200).send({ success: true, message: '', teacher })
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
export const getTeachers = async (req, res) => {
  try {
    const teacher = await teachers.find({ post: true })
    res.status(200).send({ success: true, message: '', teacher })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}
export const getAllTeachers = async (req, res) => {
  try {
    const teacher = await teachers.find().sort({ lab: 1 })
    res.status(200).send({ success: true, message: '', teacher })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const editTeacher = async (req, res) => {
  try {
    const data = {
      name: req.body.name,
      proInterest: req.body.proInterest,
      experience: req.body.experience,
      course: req.body.course,
      lab: req.body.lab,
      email: req.body.email,
      telephone: req.body.telephone,
      fax: req.body.fax
    }
    if (req.files) {
      data.image = req.files?.image?.[0]?.path
    }
    // console.log(data)
    const teacher = await teachers.findByIdAndUpdate(req.params.id, data, { new: true })
    res.status(200).send({ success: true, message: '', teacher })
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
export const deleteTeacher = async (req, res) => {
  try {
    await teachers.findByIdAndDelete(req.params.id)
    res.status(200).send({ success: true, message: '' })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}
