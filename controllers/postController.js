const resHandle = require('../utils/resHandle')
const Post = require('../models/postsModel')

const posts = {
  // 取得所有貼文
  async getPosts(req, res) {
    const timeSort = req.query.timeSort === 'asc' ? 'createdAt' : '-createdAt'
    const q = req.query.q !== undefined ? { "content": new RegExp(req.query.q) } : {};

    const posts = await Post.find(q).populate({
      path: 'user',
      select: 'name avatar'
    }).sort(timeSort)
    resHandle.successHandle(res, posts)
  },

  // 新增貼文
  async addPosts(req, res) {
    try {
      const { user, content, image } = req.body
      const newPost = await Post.create({
        user, content, image
      })
      resHandle.successHandle(res, newPost)

    } catch (error) {
      let errorMessage = Object.values(error.errors).map(item => item.message)
      resHandle.errorHandle(res, 400, errorMessage)
    }
  }
}

module.exports = posts