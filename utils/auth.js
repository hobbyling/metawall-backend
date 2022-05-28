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
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      err ? reject(err) : resolve(payload)
    })
  })
  const currentUser = await User.findById(decoded.id)

  req.user = currentUser
  next()
})

module.exports = {
  generateSendJWT,
  isAuth
}