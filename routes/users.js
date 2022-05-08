var express = require('express');
var router = express.Router();
const User = require('../models/usersModel')
const resHandle = require('../utils/resHandle')

/* GET users listing. */
router.get('/', async function (req, res, next) {
  const users = await User.find()
  resHandle.successHandle(res, users)
});

/* POST users */
router.post('/', async function (req, res, next) {
  try {
    const { name, avatar } = req.body
    const newUser = await User.create({
      name: name,
      avatar: avatar
    })
    resHandle.successHandle(res, newUser)

  } catch (error) {
    let errorMessage = Object.values(error.errors).map(item => item.message)
    resHandle.errorHandle(res, 400, errorMessage)
  }
});

module.exports = router;
