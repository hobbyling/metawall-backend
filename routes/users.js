var express = require('express');
var router = express.Router();
const UserControllers = require('../controllers/userController');
const LikeControllers = require('../controllers/likeController');
const FollowControllers = require('../controllers/followController');
const { isAuth } = require('../utils/auth');
const handleErrorAsync = require("../utils/handleErrorAsync")

/* 註冊 */
router.post('/sign_up', handleErrorAsync(UserControllers.signUp))

/* 登入 */
router.post('/sign_in', handleErrorAsync(UserControllers.signIn))

/* 重設密碼 */
router.post('/updatePassword', isAuth, handleErrorAsync(UserControllers.updatePassword))

/* 取得個人資料（自己） */
router.get('/profile', isAuth, handleErrorAsync(UserControllers.getUserProfile))

/* 取得個人資料（他人） */
router.get('/profile/:userId', isAuth, handleErrorAsync(UserControllers.getUserProfile))

/* 更新個人資料 */
router.patch('/profile', isAuth, handleErrorAsync(UserControllers.updateUserProfile))

/* 追蹤朋友 */
router.post('/:userId/follow', isAuth, handleErrorAsync(FollowControllers.addFollow))

/* 取消追蹤朋友 */
router.delete('/:userId/unfollow', isAuth, handleErrorAsync(FollowControllers.deleteFollow))

/* 取得個人追蹤名單 */
router.get('/following', isAuth, handleErrorAsync(FollowControllers.getFollowList))

/* 取得個人按讚列表 */
router.get('/getLikeList', isAuth, handleErrorAsync(LikeControllers.getLikeList))

module.exports = router;
