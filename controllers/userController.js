const User = require('../models/usersModel')
const appError = require("../utils/appError")
const resHandle = require('../utils/resHandle')
const { generateSendJWT } = require('../utils/auth')
const bcrypt = require('bcryptjs')
const validator = require('validator')

const users = {
  // 取得所有用戶
  async getUsers(req, res, next) {
    const users = await User.find()
    resHandle.successHandle(res, users)
  },

  // 註冊
  async signUp(req, res, next) {

    let { name, email, password, confirmPassword } = req.body

    // 內容不可為空
    if (!name || !email || !password || !confirmPassword) {
      return next(appError(400, '欄位未填寫正確', next))
    }

    // 密碼不一致
    if (password !== confirmPassword) {
      return next(appError(400, '密碼不一致', next))
    }

    // 密碼至少 8 個字元
    if (!validator.isLength(password, { min: 8 })) {
      return next(appError(400, '密碼字數少於 8 碼', next))
    }

    // Email 格式錯誤
    if (!validator.isEmail(email)) {
      return next(appError(400, 'Email 格式錯誤', next))
    }

    // Email 是否已被註冊過
    // 先在資料庫尋找是否已存在 email
    const isRegister = await User.findOne({ email }).count()

    if (isRegister === 0) {
      // 密碼加密
      password = await bcrypt.hash(password, 12)

      const newUser = await User.create({
        name,
        email,
        password
      })

      generateSendJWT(newUser, 201, res)
    } else {
      return next(appError(400, '此 Email 已註冊過', next))
    }
  },

  // 登入
  async signIn(req, res, next) {
    const { email, password } = req.body

    // 內容不可為空
    if (!email || !password) {
      return next(appError(400, '帳號、密碼不可為空', next))
    }

    const user = await User.findOne({ email }).select('+password')

    // 無此帳號
    if (!user) {
      return next(appError(400, '帳號、密碼不正確', next))
    }

    // 密碼錯誤
    const auth = await bcrypt.compare(password, user.password)
    if (!auth) {
      return next(appError(400, '帳號、密碼不正確', next))
    }

    generateSendJWT(user, 200, res)
  },

  // 重設密碼
  async updatePassword(req, res, next) {
    const { password, confirmPassword } = req.body

    // 內容不可為空
    if (!password || !confirmPassword) {
      return next(appError(400, '欄位未填寫正確', next))
    }

    // 密碼不一致
    if (password !== confirmPassword) {
      return next(appError(400, '密碼不一致', next))
    }

    // 密碼至少 8 個字元
    if (!validator.isLength(password, { min: 8 })) {
      return next(appError(400, '密碼字數少於 8 碼', next))
    }

    const newPassword = await bcrypt.hash(password, 12)

    const user = await User.findByIdAndUpdate(req.user.id, {
      password: newPassword
    })

    generateSendJWT(user, 200, res)
  },

  // 取得個人資料
  async getUserProfile(req, res, next) {
    // 若網址有帶參數，代表是其他人的資料
    let user = req.params.userId
      ? await User.findById(req.params.userId)
      : await User.findById(req.user.id)

    resHandle.successHandle(res, user)
  },

  // 更新個人資料
  async updateUserProfile(req, res, next) {
    const { name, sex, avatar } = req.body

    // 內容不可為空
    if (!name || !sex) {
      return next(appError(400, '欄位未填寫正確', next))
    }

    // 要送出的參數
    let param = {
      name,
      sex
    }

    // 大頭照有值才寫入
    if (avatar) param.avatar = avatar

    // 更新資料
    await User.findByIdAndUpdate(req.user.id, param)

    const user = await User.findById(req.user.id)

    resHandle.successHandle(res, user)
  }
}

module.exports = users