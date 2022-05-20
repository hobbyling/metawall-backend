var express = require('express');
var router = express.Router();
const PostControllers = require('../controllers/postController')
const { isAuth } = require('../utils/auth');
const handleErrorAsync = require("../utils/handleErrorAsync")

/* 取得全體 / 個人動態牆 */
router.get('/:userId?', isAuth, handleErrorAsync(PostControllers.getPosts));

/* 新增動態 */
router.post('/', isAuth, handleErrorAsync(PostControllers.addPosts));

module.exports = router;
