var express = require('express');
var router = express.Router();
const FollowControllers = require('../controllers/followController')
const { isAuth } = require('../utils/auth');
const handleErrorAsync = require("../utils/handleErrorAsync")

/* 取得追蹤列表 */
router.get('/', isAuth, handleErrorAsync(FollowControllers.getFollowList))

/* 新增追蹤 */
router.post('/:userId', isAuth, handleErrorAsync(FollowControllers.addFollow))

/* 取消追蹤 */
router.delete('/:userId', isAuth, handleErrorAsync(FollowControllers.deleteFollow))

module.exports = router;
