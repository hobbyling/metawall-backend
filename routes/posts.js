var express = require('express');
var router = express.Router();
const PostControllers = require('../controllers/postController')
const LikeControllers = require('../controllers/likeController')
const CommentControllers = require('../controllers/commentController')
const { isAuth } = require('../utils/auth');
const handleErrorAsync = require("../utils/handleErrorAsync")

/* 取得所有貼文 */
router.get('/', isAuth, handleErrorAsync(PostControllers.getAllPosts));

/* 取得單一貼文 */
router.get('/posts/postId', isAuth, handleErrorAsync(PostControllers.getPost));

/* 新增貼文 */
router.post('/', isAuth, handleErrorAsync(PostControllers.addPosts));

/* 新增一則貼文的讚 */
router.post('/:postId/like', isAuth, handleErrorAsync(LikeControllers.addLike))

/* 取消一則貼文的讚 */
router.delete('/:postId/unlike', isAuth, handleErrorAsync(LikeControllers.deleteLike))

/* 新增一則貼文的留言 */
router.post('/:postId/comment', isAuth, handleErrorAsync(CommentControllers.addComment))

/* 刪除留言 */
router.delete('/comment/:commentId', isAuth, handleErrorAsync(CommentControllers.deleteComment))

/* 取得個人所有貼文列表 */
router.get('/:userId', isAuth, handleErrorAsync(PostControllers.getPosts));

module.exports = router;
