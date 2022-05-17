var express = require('express');
var router = express.Router();
const UserControllers = require('../controllers/userController')


/* GET users listing. */
router.get('/', UserControllers.getUsers);

/* POST users */
router.post('/', UserControllers.addUser);

module.exports = router;
