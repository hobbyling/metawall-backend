const Post = require('../models/postsModel')
const appError = require("../utils/appError")
const resHandle = require('../utils/resHandle')

const likes = {
  // 取得個人按讚的貼文列表
  async getLikeList(req, res, next) {
    const list = await Post.find({
      likes: {
        $in: [req.user.id]
      }
    }).populate({
      path: 'user',
      select: 'name avatar'
    })

    resHandle.successHandle(res, list)
  },

  // 新增讚
  async addLike(req, res, next) {
    const _id = req.params.postId

    if (!_id) return next(appError(400, '請輸入貼文 ID', next))

    // 在 post 的 like 新增 user id
    await Post.findByIdAndUpdate(_id, {
      $addToSet: {
        likes: req.user.id
      }
    })

    resHandle.successHandle(res, '按讚成功')
  },

  // 取消讚
  async deleteLike(req, res, next) {
    const _id = req.params.postId
    if (!_id) return next(appError(400, '請輸入貼文 ID', next))

    await Post.findByIdAndUpdate(_id, {
      $pull: {
        like: req.user.id
      }
    })

    resHandle.successHandle(res, '取消讚成功')
  }
}

module.exports = likes