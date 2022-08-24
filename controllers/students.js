import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import students from '../models/students.js'
import articles from '../models/articles.js'

export const createStudent = async (req, res) => {
  try {
    const student = await students.create({
      studentId: req.body.studentId,
      name: req.body.name,
      class: req.body.class,
      phone: req.body.phone,
      email: req.body.email,
      residenceAddress: req.body.residenceAddress,
      currentAddress: req.body.currentAddress,
      personalId: req.body.personalId
    })
    // await students.create(req.body)
    res.status(200).send({ success: true, message: '', student })
  } catch (error) {
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      return res.status(400).send({ success: false, message })
    } else if (error.name === 'MongoServerError' && error.code === 11000) {
      res.status(400).send({ success: false, message: '學生已存在' })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}
export const login = async (req, res) => {
  try {
    const token = jwt.sign({ _id: req.student._id }, process.env.SECRET, { expiresIn: '3600s' })
    req.student.tokens.push(token)
    await req.student.save()
    res.status(200).send({
      success: true,
      message: '',
      result: {
        token,
        studentId: req.student.studentId,
        email: req.student.email,
        name: req.student.name,
        class: req.student.class,
        residenceAddress: req.student.residenceAddress,
        currentAddress: req.student.currentAddress,
        personalId: req.student.personalId,
        phone: req.student.phone,
        lectures: req.student.lectures,
        password: req.student.password,
        _id: req.student._id,
        role: req.student.role
      }
    })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const logout = async (req, res) => {
  try {
    req.student.tokens = req.student.tokens.filter(token => token !== req.token)
    await req.student.save()
    res.status(200).send({ success: true, message: '' })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const extend = async (req, res) => {
  try {
    const idx = req.student.tokens.findIndex(token => token === req.token)
    const token = jwt.sign({ _id: req.student._id }, process.env.SECRET, { expiresIn: '3600s' })
    req.student.tokens[idx] = token
    await req.student.save()
    res.status(200).send({ success: true, message: '', result: token })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}
export const getAllStudents = async (req, res) => {
  try {
    const student = await students.find().sort({ studentId: 1 })
    res.status(200).send({ success: true, message: '', student })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}
export const getStudent = (req, res) => {
  try {
    res.status(200).send({
      success: true,
      message: '',
      result: {
        studentId: req.student.studentId,
        email: req.student.email,
        name: req.student.name,
        class: req.student.class,
        residenceAddress: req.student.residenceAddress,
        currentAddress: req.student.currentAddress,
        personalId: req.student.personalId,
        phone: req.student.phone,
        lectures: req.student.lectures,
        password: req.student.password,
        role: req.student.role
      }
    })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const getStudentProfile = async (req, res) => {
  try {
    const student = await students.findById(req.params.id)
    res.status(200).send({ success: true, message: '', student })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const editStudent = async (req, res) => {
  try {
    const data = {
      studentId: req.body.studentId,
      name: req.body.name,
      class: req.body.class,
      phone: req.body.phone,
      email: req.body.email,
      residenceAddress: req.body.residenceAddress,
      currentAddress: req.body.currentAddress,
      personalId: req.body.personalId
    }
    const student = await students.findByIdAndUpdate(req.params.id, data, { new: true })
    res.status(200).send({ success: true, message: '', student })
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

export const editStudentProfile = async (req, res) => {
  try {
    const data = {
      email: req.body.email,
      phone: req.body.phone,
      residenceAddress: req.body.residenceAddress,
      currentAddress: req.body.currentAddress
    }
    if (req.body.password) data.password = bcrypt.hashSync(req.body.password, 10)
    // 如果路由有兩個 patch /:id 原本是 route.params.id ， 其中一個改成 /xxx 然後 findbyid 這裡面改成 req.xxxx._id
    const student = await students.findByIdAndUpdate(req.student._id, data, { new: true })
    res.status(200).send({ success: true, message: '', student })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const addLecture = async (req, res) => {
  try {
    // 驗證文章
    const lecture = await articles.findById(req.body.lecture)
    // 沒找到或者已下架
    if (lecture.category === '講座資訊') {
      if (!lecture || !lecture.post) {
        return res.status(404).send({ success: false, message: '講座不存在' })
      }
    } else {
      return res.status(404).send({ success: false, message: '不是講座' })
    }
    // 找已報名講座有沒有這個講座
    // req.body.lecture 進來的會是文字，lectures 的 lecture 會是 mongodb 的 objectId 把前面轉成文字，或者把 req 用 mongoose.ObjectId 包起來
    const idx = req.student.lectures.findIndex(item => item.lecture.toString() === req.body.lecture)

    if (idx > -1) {
      if (req.student.lectures[idx].lecture.toString() === req.body.lecture) {
        return res.status(200).send({ success: true, message: '已報名過此講座' })
      }
    } else {
      req.student.lectures.push({
        lecture: req.body.lecture
      })
    }
    await req.student.save()
    return res.status(200).send({ success: true, message: '', result: req.student.lectures.length })
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

export const editLecture = async (req, res) => {
  try {
    if (req.body.lectures) {
      const idx = req.student.lectures.findIndex(item => item.lecture.toString() === req.body.lecture)
      req.student.lectures.splice(idx, 1)
      await req.student.save()
      //   以下是 mongodb 語法
      //   await students.findOneAndUpdate(
      //     { _id: req.student._id, 'lectures.lecture': req.body.lecture },
      //     // pull 把東西從陣列裡面刪掉
      //     {
      //       $pull: {
      //         lectures: { lecture: req.body.lecture }
      //       }
      //     }
      //   )
    } else {
      const idx = req.student.lectures.findIndex(item => item.lecture.toString() === req.body.lecture)
      req.student.lectures[idx] = req.body.lecture
      await req.student.save()
      // await students.findOneAndUpdate(
      //   { _id: req.student._id, 'lectures.lecture': req.body.lecture },
      //   // pull 把東西從陣列裡面刪掉
      //   {
      //     $set: {
      //       // $ 代表符合陣列搜尋條件的索引
      //       'lecttures.$.lecture': { lecture: req.body.lecture }
      //     }
      //   }
      // )
    }
    res.status(200).send({ success: true, message: '' })
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
export const getMyLecture = async (req, res) => {
  try {
    const result = await students.findById(req.student._id, 'lectures').populate('lectures.lecture')
    res.status(200).send({ success: true, message: '', result: result.lectures })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}
export const deleteStudent = async (req, res) => {
  try {
    await students.findByIdAndDelete(req.params.id)
    res.status(200).send({ success: true, message: '' })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}
