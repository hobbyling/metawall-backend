var express = require('express');
var router = express.Router();
const PostControllers = require('../controllers/postController')

/* GET 取得貼文列表. */
router.get('/', PostControllers.getPosts);

/* POST 新增貼文. */
router.post('/', PostControllers.addPosts);

module.exports = router;
