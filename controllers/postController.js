const Post = require('../models/postsModel')
const appError = require("../utils/appError")
const resHandle = require('../utils/resHandle')
const { generateSendJWT } = require('../utils/auth')
const validator = require('validator')

const posts = {
  // 取得全體動態牆
  async getPosts(req, res, next) {
    // 時間排序
    const timeSort = req.query.timeSort === 'asc' ? 'createdAt' : '-createdAt'

    // 關鍵字搜尋
    const q = req.query.q !== undefined ? { "content": new RegExp(req.query.q) } : {};

    // 有帶參數表示是個人動態牆，搜尋條件需再多一個個人 ID
    const serch = req.params.userId
      ? { content: q, id: req.param.userId }
      : q

    const posts = await Post.find(serch).populate({
      path: 'user',
      select: 'name avatar'
    }).sort(timeSort)

    resHandle.successHandle(res, posts)
  },

  // 新增動態
  async addPosts(req, res, next) {
    const { content, image } = req.body

    // 內容欄位驗證
    if (!content) {
      return next(appError(400, '請填寫內容', next))
    }

    const newPost = await Post.create({
      user: req.user.id,
      content, image
    })

    resHandle.successHandle(res, newPost)
  }
}

module.exports = posts