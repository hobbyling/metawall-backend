var express = require('express');
var router = express.Router();
const Post = require('../models/postsModel')
const resHandle = require('../utils/resHandle')

/* GET 取得貼文列表. */
router.get('/', async function (req, res, next) {
  const timeSort = req.query.timeSort === 'asc' ? 'createdAt' : '-createdAt'
  const q = req.query.q !== undefined ? { "content": new RegExp(req.query.q) } : {};

  const posts = await Post.find(q).populate({
    path: 'user',
    select: 'name avatar'
  }).sort(timeSort)
  resHandle.successHandle(res, posts)
});

/* POST 新增貼文. */
router.post('/', async function (req, res, next) {
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
});

module.exports = router;
