const Post = require('../models/postsModel')
const appError = require("../utils/appError")
const resHandle = require('../utils/resHandle')
const { isValidID } = require('../utils/validate')

const likes = {
  // 取得個人按讚列表
  async getLikeList(req, res, next) {
    const list = await Post.find({
      likes: {
        $in: [req.user.id]
      }
    }).populate({
      path: 'editor',
      select: 'name avatar _id'
    })

    resHandle.successHandle(res, list)
  },

  // 新增一則貼文的讚
  async addLike(req, res, next) {
    const { postId } = req.params

    // 驗證 ID 格式
    if (!isValidID(postId).valid) {
      return next(appError(400, 1, isValidID(postId).msg, next))
    }

    // 在 post 的 like 新增 user id
    await Post.findByIdAndUpdate(postId, {
      $addToSet: {
        likes: req.user.id
      }
    })

    resHandle.successHandle(res, '按讚成功')
  },

  // 取消一則貼文的讚
  async deleteLike(req, res, next) {
    const { postId } = req.params

    // 驗證 ID 格式
    if (!isValidID(postId).valid) {
      return next(appError(400, 1, isValidID(postId).msg, next))
    }

    await Post.findByIdAndUpdate(postId, {
      $pull: {
        likes: req.user.id
      }
    })

    resHandle.successHandle(res, '取消讚成功')
  }
}

module.exports = likes