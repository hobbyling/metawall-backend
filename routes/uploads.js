var express = require('express');
var router = express.Router();
const UploadControllers = require('../controllers/uploadController');
const { isAuth } = require('../utils/auth');
const upload = require("../utils/image")
const handleErrorAsync = require("../utils/handleErrorAsync")

/* 上傳圖片 */
router.post('/', isAuth, upload, handleErrorAsync(UploadControllers.uploadImage))

module.exports = router;