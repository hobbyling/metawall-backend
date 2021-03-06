const express = require('express')
const jwt = require('jsonwebtoken')
const appError = require('./appError')
const handleErrorAsync = require('./handleErrorAsync')
const User = require('../models/usersModel')

const generateSendJWT = (user, statusCode, res) => {
  // 產生 JWT token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_DAY
  })

  user.password = undefined
  res.status(statusCode).json({
    status: 'success',
    data: {
      token,
      id: user._id,
      name: user.name
    }
  })
}

const isAuth = handleErrorAsync(async (req, res, next) => {
  const { reset } = req.body
  // 確認 token 是否存在
  let token

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  } else {
    return next(appError(401, 4, '查無 TOKEN', next))
  }

  if (!token) {
    return next(appError(401, 4, '查無 TOKEN', next))
  }

  // 驗證 token 正確性
  const decoded = await new Promise((resolve, reject) => {

    if (reset) {
      jwt.verify(token, process.env.JWT_RESET_SECRET, (err, payload) => {
        err ? next(appError(400, 6, { token: '認證失敗，請重新點選連結' }, next)) : resolve(payload)
      })
    } else {
      jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
        err ? next(appError(400, 6, { token: '認證失敗，請重新登入' }, next)) : resolve(payload)
      })
    }

  })
  const currentUser = await User.findById(decoded.id)

  req.user = currentUser
  next()
})

module.exports = {
  generateSendJWT,
  isAuth
}