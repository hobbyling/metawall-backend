var express = require('express');
var router = express.Router();
const UploadControllers = require('../controllers/uploadController');
const { isAuth } = require('../utils/auth');
const upload = require("../utils/image")
const handleErrorAsync = require("../utils/handleErrorAsync")

/* δΈε³εη */
router.post('/', upload, isAuth, handleErrorAsync(UploadControllers.uploadImage))

module.exports = router;