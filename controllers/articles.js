import articles from '../models/articles.js'

export const createArticle = async (req, res) => {
  try {
    const article = await articles.create({
      title: req.body.title,
      content: req.body.content,
      // 假如沒有上傳圖片或附件 直接使用req.files (upload.js 裡面產生) 會 undefined，對 undefined 寫 .path 會出現錯誤
      // ?. 就算選出來是空的也是 undefined 如果是undefined 就是空的
      image: req.files?.image?.[0]?.path || '',
      files: req.files?.files?.map(file => file.path) || [],
      category: req.body.category,
      post: req.body.post,
      date: new Date(req.body.date)
    })
    res.status(200).send({ success: true, message: '', article })
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
export const getArticles = async (req, res) => {
  try {
    const article = await articles.find({ post: true }).sort({ date: -1 })
    res.status(200).send({ success: true, message: '', article })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const getAllArticles = async (req, res) => {
  try {
    const article = await articles.find().sort({ date: -1 })
    res.status(200).send({ success: true, message: '', article })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}
export const getArticle = async (req, res) => {
  try {
    const article = await articles.findById(req.params.id)
    res.status(200).send({ success: true, message: '', article })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}
export const postArticle = async (req, res) => {
  try {
    const data = {
      post: req.body.post
    }
    const article = await articles.findByIdAndUpdate(req.params.id, data, { new: true })
    res.status(200).send({ success: true, message: '', article })
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
export const editArticle = async (req, res) => {
  try {
    const data = {
      title: req.body.title,
      content: req.body.content,
      category: req.body.category,
      post: req.body.post,
      date: new Date(req.body.date)
    }
    if (req.files) {
      // data.image = req.file.path
      // data.files = req.file.path
      data.image = req.files?.image?.[0]?.path
      data.files = req.files?.files?.map(file => file.path)
    }
    const article = await articles.findByIdAndUpdate(req.params.id, data, { new: true })
    res.status(200).send({ success: true, message: '', article })
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
export const deleteArticle = async (req, res) => {
  try {
    await articles.findByIdAndDelete(req.params.id)
    res.status(200).send({ success: true, message: '' })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}
