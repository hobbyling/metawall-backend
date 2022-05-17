var express = require('express');
var router = express.Router();
const PostControllers = require('../controllers/postController')
const handleErrorAsync = require("../utils/handleErrorAsync")

/* GET 取得貼文列表. */
router.get('/', handleErrorAsync(PostControllers.getPosts));

/* POST 新增貼文. */
router.post('/', handleErrorAsync(PostControllers.addPosts));

module.exports = router;
