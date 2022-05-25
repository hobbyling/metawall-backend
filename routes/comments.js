var express = require('express');
var router = express.Router();
const CommentControllers = require('../controllers/commentController')
const { isAuth } = require('../utils/auth');
const handleErrorAsync = require("../utils/handleErrorAsync")

/* 取得貼文留言 */
router.get('/:postId', isAuth, handleErrorAsync(CommentControllers.getComments))

/* 新增貼文留言 */
router.post('/:postId', isAuth, handleErrorAsync(CommentControllers.addComment))

/* 刪除貼文留言 */
router.delete('/:commentId', isAuth, handleErrorAsync(CommentControllers.deleteComment))


module.exports = router;
