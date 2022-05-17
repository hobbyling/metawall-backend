var express = require('express');
var router = express.Router();
const UserControllers = require('../controllers/userController')
const handleErrorAsync = require("../utils/handleErrorAsync")

/* GET users listing. */
router.get('/', handleErrorAsync(UserControllers.getUsers));

/* POST users */
router.post('/', handleErrorAsync(UserControllers.addUser));

module.exports = router;
