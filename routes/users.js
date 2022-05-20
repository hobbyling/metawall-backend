var express = require('express');
var router = express.Router();
const UserControllers = require('../controllers/userController');
const { isAuth } = require('../utils/auth');
const handleErrorAsync = require("../utils/handleErrorAsync")

/* 註冊 */
router.post('/sign_up', handleErrorAsync(UserControllers.signUp))

/* 登入 */
router.post('/sign_in', handleErrorAsync(UserControllers.signIn))

/* 重設密碼 */
router.post('/updatePassword', isAuth, handleErrorAsync(UserControllers.updatePassword))

/* 取得個人資料 */
router.get('/profile/:userId?', isAuth, handleErrorAsync(UserControllers.getUserProfile))

/* 更新個人資料 */
router.patch('/profile', isAuth, handleErrorAsync(UserControllers.updateUserProfile))


module.exports = router;
