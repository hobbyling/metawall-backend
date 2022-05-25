const Post = require('../models/postsModel')
const Comment = require('../models/commentsModel')
const appError = require("../utils/appError")
const resHandle = require('../utils/resHandle')

const comments = {
  // 取得貼文留言
  async getComments(req, res, next) {
    const comments = await Comment.find({ "postId": req.params.postId }).populate({
      path: 'user',
      select: 'name avatar'
    })

    resHandle.successHandle(res, comments)
  },

  // 新增貼文留言
  async addComment(req, res, next) {
    const { content } = req.body

    // 內容欄位驗證
    if (!content) {
      return next(appError(400, '請填寫內容', next))
    }

    // 新增至 comment 資料表
    const newComment = await Comment.create({
      user: req.user.id,
      postId: req.params.postId,
      content
    })

    // 新增至 post 資料表的 comment 欄位
    await Post.findByIdAndUpdate(req.params.postId, {
      $push: {
        comment: newComment.id
      }
    })

    resHandle.successHandle(res, '新增留言成功')
  },

  // 刪除貼文留言
  async deleteComment(req, res, next) {
    /* 
      刪除條件
      1. 自己新增的留言
      2. 自己貼文下的任何留言
    */
    const comment = await Comment.findById(req.params.commentId)

    if (!comment) return next(appError(400, '無法刪除此留言', next))

    // 刪除條件：自己新增的留言
    if (req.user.id === comment.user.toString()) {
      await Comment.findByIdAndDelete(req.params.commentId)
      await Post.findByIdAndUpdate(comment.postId, {
        $pull: {
          comment: req.params.commentId
        }
      })
      resHandle.successHandle(res, '刪除留言成功')
    } else {

      // 刪除條件：自己貼文下的任何留言
      const post = await Post.findById(comment.postId)

      if (!post) return next(appError(400, '無法刪除此留言', next))

      if (req.user.id === post.user.toString()) {
        await Comment.findByIdAndDelete(req.params.commentId)
        await Post.findByIdAndUpdate(comment.postId, {
          $pull: {
            comment: req.params.commentId
          }
        })
        resHandle.successHandle(res, '刪除留言成功')
      } else {
        return next(appError(400, '無法刪除此留言', next))
      }
    }
  }
}

module.exports = comments