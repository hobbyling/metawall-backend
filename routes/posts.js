var express = require('express');
var router = express.Router();
const PostControllers = require('../controllers/postController')
const { isAuth } = require('../utils/auth');
const handleErrorAsync = require("../utils/handleErrorAsync")

/* 取得全體動態牆 */
router.get('/', isAuth, handleErrorAsync(PostControllers.getAllPosts));

/* 取得個人動態牆 */
router.get('/:userId', isAuth, handleErrorAsync(PostControllers.getPosts));

/* 新增貼文 */
router.post('/', isAuth, handleErrorAsync(PostControllers.addPosts));

/* 取得貼文留言 */
router.get('/comments/:postId', isAuth, handleErrorAsync(PostControllers.getComments))

/* 新增貼文留言 */
router.post('/comments/:postId', isAuth, handleErrorAsync(PostControllers.addComment))

/* 刪除貼文留言 */
router.delete('/comments/:commentId', isAuth, handleErrorAsync(PostControllers.deleteComment))


module.exports = router;
