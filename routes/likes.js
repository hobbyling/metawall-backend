var express = require('express');
var router = express.Router();
const LikeControllers = require('../controllers/likeController')
const { isAuth } = require('../utils/auth');
const handleErrorAsync = require("../utils/handleErrorAsync")

/* 取得個人按讚的貼文列表 */
router.get('/', isAuth, handleErrorAsync(LikeControllers.getPersonalLikePostList))

/* 新增讚 */
router.post('/:postId', isAuth, handleErrorAsync(LikeControllers.addLike))

/* 取消讚 */
router.delete('/:postId', isAuth, handleErrorAsync(LikeControllers.deleteLike))

module.exports = router;
