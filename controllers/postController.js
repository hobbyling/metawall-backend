const Post = require('../models/postsModel')
const Comment = require('../models/commentsModel')
const appError = require("../utils/appError")
const resHandle = require('../utils/resHandle')
const mongoose = require('mongoose');
const { isValidPage, isValidLimit, isNotEmpty, isValidID } = require('../utils/validate')

const posts = {
  // 取得所有貼文
  async getAllPosts(req, res, next) {
    // 時間排序
    const timeSort = req.query.timeSort === 'asc' ? 'createdAt' : '-createdAt'

    // 關鍵字搜尋
    const filter = req.query.q !== undefined ? { "content": new RegExp(req.query.q) } : {};

    // 當前頁碼
    const currentPage = isValidPage(req.query.page)

    // 單頁筆數
    const perPage = isValidLimit(req.query.limit)

    // 總筆數
    const total = await Post.find(filter).count()

    // 總頁數
    const totalPage = Math.ceil(total / perPage)

    // 若總頁數 >0 且 當前頁碼 大於等於 最大頁數
    if (totalPage > 0 && currentPage > totalPage) {
      return next(appError(400, 1, `請輸入正確頁碼，共有${totalPage}頁`, next))
    }

    // 要跳過的筆數
    const skip = (currentPage - 1) * perPage
    const posts = await Post
      .find(filter)
      .populate({
        path: 'editor',
        select: 'name avatar'
      })
      .populate({
        path: 'comments',
        select: 'editor content createdAt'
      })
      .sort(timeSort)
      .skip(skip)

    resHandle.successHandle(res, {
      page: {
        currentPage,
        perPage,
        total,
        totalPage
      },
      list: posts
    })
  },

  // 取得個人動態牆
  async getPosts(req, res, next) {
    // 時間排序
    const timeSort = req.query.timeSort === 'asc' ? 'createdAt' : '-createdAt'

    // 關鍵字搜尋
    const filter = req.query.q !== undefined ? { "content": new RegExp(req.query.q) } : {};

    filter.editor = req.params.userId

    // 當前頁碼
    const currentPage = isValidPage(req.query.page)

    // 單頁筆數
    const perPage = isValidLimit(req.query.limit)

    // 總筆數
    const total = await Post.find(filter).count()

    // 總頁數
    const totalPage = Math.ceil(total / perPage)

    // 若總頁數 >0 且 當前頁碼 大於等於 最大頁數
    if (totalPage > 0 && currentPage > totalPage) {
      return next(appError(400, 1, `請輸入正確頁碼，共有${totalPage}頁`, next))
    }

    // 要跳過的筆數
    const skip = (currentPage - 1) * perPage

    const posts = await Post
      .find(filter)
      .populate({
        path: 'editor',
        select: 'name avatar'
      })
      .populate({
        path: 'comments',
        select: 'editor content createdAt'
      })
      .sort(timeSort)
      .skip(skip)

    resHandle.successHandle(res, {
      page: {
        currentPage,
        perPage,
        total,
        totalPage
      },
      list: posts
    })
  },

  // 取得單一貼文
  async getPost(req, res, next) {
    const { postId } = req.params

    // 驗證 ID 格式
    if (!isValidID(postId).valid) {
      return next(appError(400, 1, isValidID(postId).msg, next))
    }

    const post = await Post.findById(postId)

    resHandle.successHandle(res, post)
  },

  // 新增貼文
  async addPost(req, res, next) {
    let { content, image } = req.body

    content = content ? content.trim() : content
    image = image ? image.trim() : image

    // 內容不可為空
    if (!isNotEmpty({ content }).valid) {
      return next(appError(400, 1, isNotEmpty({ content }).msg, next))
    }

    // 送出參數
    const param = {
      editor: req.user.id,
      content
    }

    if (image) param.image = image

    console.log('param', param)

    const newPost = await Post.create(param)
    resHandle.successHandle(res, newPost)
  },

  // 編輯貼文
  async editPost(req, res, next) {
    const { postId } = req.params
    let { content, image } = req.body

    content = content ? content.trim() : content
    image = image ? image.trim() : image

    // 驗證 ID 格式
    if (!isValidID(postId).valid) {
      return next(appError(400, 1, isValidID(postId).msg, next))
    }

    // 是發布者才可以編輯貼文
    const post = await Post.findById(postId)
    if (post.editor.toString() !== req.user.id) {
      return next(appError(400, 5, { 'user_id': '您並非發文者，無法修改貼文' }, next))
    }

    // 內容不可為空
    if (!isNotEmpty({ content }).valid) {
      return next(appError(400, 1, isNotEmpty({ content }).msg, next))
    }

    // 送出參數
    const param = {
      content
    }

    if (image) param.image = image

    await Post.findByIdAndUpdate(postId, param)

    const editPost = await Post.findById(postId)

    resHandle.successHandle(res, editPost)
  },

  // 刪除貼文
  async deletePost(req, res, next) {
    const { postId } = req.params

    // 驗證 ID 格式
    if (!isValidID(postId).valid) {
      return next(appError(400, 1, isValidID(postId).msg, next))
    }

    // 是發布者才可以刪除貼文
    const post = await Post.findById(postId)
    if (post.editor.toString() !== req.user.id) {
      return next(appError(400, 5, { 'user_id': '您並非發文者，無法刪除貼文' }, next))
    }

    await Post.findByIdAndDelete(postId)

    // 該貼文的留言也刪除
    await Comment.deleteMany({ postId: postId })

    resHandle.successHandle(res, '刪除成功')
  }
}

module.exports = posts