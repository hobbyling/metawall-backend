const Post = require('../models/postsModel')
const User = require('../models/usersModel')
const appError = require("../utils/appError")
const resHandle = require('../utils/resHandle')

const likes = {
  // 取得個人按讚的貼文列表
  async getPersonalLikePostList(req, res, next) {
    const posts = await User.findById(req.user.id).populate({
      path: 'like',
      select: 'user content image',
      populate: {
        path: 'user',
        select: 'name avatar'
      }
    }).select('like')

    resHandle.successHandle(res, posts)
  },

  // 新增讚
  async addLike(req, res, next) {

    if (!req.params.postId) return next(appError(400, '請輸入貼文 ID', next))

    // 在 post 的 like 新增 user id
    await Post.findByIdAndUpdate(req.params.postId, {
      $push: {
        like: req.user.id
      }
    })

    // 在 user 的 like 新增 post id
    await User.findByIdAndUpdate(req.user.id, {
      $push: {
        like: req.params.postId
      }
    })

    resHandle.successHandle(res, '按讚成功')
  },

  // 取消讚
  async deleteLike(req, res, next) {
    if (!req.params.postId) return next(appError(400, '請輸入貼文 ID', next))

    await Post.findByIdAndUpdate(req.params.postId, {
      $pull: {
        like: req.user.id
      }
    })

    await User.findByIdAndUpdate(req.user.id, {
      $pull: {
        like: req.params.postId
      }
    })

    resHandle.successHandle(res, '收回讚成功')
  }
}

module.exports = likes