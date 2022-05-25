const Post = require('../models/postsModel')
const Comment = require('../models/commentsModel')
const appError = require("../utils/appError")
const resHandle = require('../utils/resHandle')
const mongoose = require('mongoose');
const { generateSendJWT } = require('../utils/auth')
const validator = require('validator')

const posts = {
  // 取得全體動態牆
  async getAllPosts(req, res, next) {
    // 時間排序
    const timeSort = req.query.timeSort === 'asc' ? 'createdAt' : '-createdAt'

    // 關鍵字搜尋
    const filter = req.query.q !== undefined ? { "content": new RegExp(req.query.q) } : {};

    const posts = await Post.find(filter).populate({
      path: 'user',
      select: 'name avatar'
    }).sort(timeSort)

    resHandle.successHandle(res, posts)
  },

  // 取得個人動態牆
  async getPosts(req, res, next) {
    // 時間排序
    const timeSort = req.query.timeSort === 'asc' ? 'createdAt' : '-createdAt'

    // 關鍵字搜尋
    const filter = req.query.q !== undefined ? { "content": new RegExp(req.query.q) } : {};

    filter.user = req.params.userId

    const posts = await Post.find(filter).populate({
      path: 'user',
      select: 'name avatar'
    }).sort(timeSort)

    resHandle.successHandle(res, posts)
  },

  // 新增貼文
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