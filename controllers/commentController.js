const Post = require('../models/postsModel')
const Comment = require('../models/commentsModel')
const appError = require("../utils/appError")
const resHandle = require('../utils/resHandle')
const { isNotEmpty, isValidID } = require('../utils/validate')

const comments = {
  // 新增一則貼文的留言
  async addComment(req, res, next) {
    let { content } = req.body
    const { postId } = req.params

    content = content ? content.trim() : content

    // 驗證 ID 格式
    if (!isValidID(postId).valid) {
      return next(appError(400, 1, isValidID(postId).msg, next))
    }

    // 內容不可為空
    if (!isNotEmpty({ content }).valid) {
      return next(appError(400, 1, isNotEmpty({ content }).msg, next))
    }

    const hasPost = await Post.findById(postId).count()

    if (!hasPost) {
      return next(appError(400, 1, { postId: '查無此貼文' }, next))
    }

    // 新增至 comment 資料表
    const newComment = await Comment.create({
      editor: req.user.id,
      postId: postId,
      content
    })

    resHandle.successHandle(res, newComment)
  },

  // 刪除貼文留言
  async deleteComment(req, res, next) {
    const { commentId } = req.params

    // 驗證 ID 格式
    if (!isValidID(commentId).valid) {
      return next(appError(400, 1, isValidID(commentId).msg, next))
    }

    /* 
      刪除條件
      1. 自己新增的留言
      2. 自己貼文下的任何留言
    */
    const comment = await Comment.findById(commentId)
    if (!comment) return next(appError(400, 1, '查無此留言，無法刪除', next))

    // 刪除條件：自己新增的留言
    if (req.user.id === comment.editor._id.toString()) {
      await Comment.findByIdAndDelete(commentId)
      resHandle.successHandle(res, '刪除留言成功')
    } else {

      // 刪除條件：自己貼文下的任何留言
      const post = await Post.findById(comment.postId)

      if (!post) return next(appError(400, 1, '查無此貼文，無法刪除此留言', next))

      if (req.user.id === post.editor.toString()) {
        await Comment.findByIdAndDelete(commentId)
        resHandle.successHandle(res, '刪除留言成功')
      } else {
        return next(appError(400, 0, '您不非留言者，無法刪除此留言', next))
      }
    }
  }
}

module.exports = comments