const resHandle = require('../utils/resHandle')
const appError = require("../utils/appError")
const Post = require('../models/postsModel')

const posts = {
  // 取得所有貼文
  async getPosts(req, res, next) {
    // 時間排序
    const timeSort = req.query.timeSort === 'asc' ? 'createdAt' : '-createdAt'

    // 關鍵字搜尋
    const q = req.query.q !== undefined ? { "content": new RegExp(req.query.q) } : {};

    const posts = await Post.find(q).populate({
      path: 'user',
      select: 'name avatar'
    }).sort(timeSort)

    resHandle.successHandle(res, posts)
  },

  // 新增貼文
  async addPosts(req, res, next) {
    // 內容欄位驗證
    if (req.body.content === undefined) {
      return next(appError(400, '請填寫 content 資料', next))
    }

    const { user, content, image } = req.body
    const newPost = await Post.create({
      user, content, image
    })

    resHandle.successHandle(res, newPost)
  }
}

module.exports = posts