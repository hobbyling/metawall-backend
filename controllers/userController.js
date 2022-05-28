const User = require('../models/usersModel')
const appError = require("../utils/appError")
const resHandle = require('../utils/resHandle')
const { generateSendJWT } = require('../utils/auth')
const { isValidPassword, isValidName, isValidEmail } = require('../utils/validate')
const bcrypt = require('bcryptjs')
const validator = require('validator')

const users = {
  // 註冊
  async signUp(req, res, next) {

    let { name, email, password } = req.body

    // 去除前後空白字元
    name = name ? name.trim() : name
    email = email ? email.trim() : email
    password = password ? password.trim() : password

    // 內容不可為空
    let isNull = {}
    if (!name) isNull.name = '欄位未填寫'
    if (!email) isNull.email = '欄位未填寫'
    if (!password) isNull.password = '欄位未填寫'
    if (!name || !email || !password) {
      return next(appError(400, 1, isNull, next))
    }

    // 驗證姓名格式
    if (!isValidName(name).valid) {
      return next(appError(400, 1, isValidName(name).msg, next))
    }

    // Email 格式錯誤
    if (!isValidEmail(email).valid) {
      return next(appError(400, 1, isValidEmail(email).msg, next))
    }

    // 密碼至少 8 個字元以上，並英數混合
    if (!isValidPassword(password).valid) {
      return next(appError(400, 1, isValidPassword(password).msg, next))
    }

    // Email 是否已被註冊過，先在資料庫尋找是否已存在 email
    const isRegister = await User.findOne({ email }).count()
    if (isRegister !== 0) {
      return next(appError(400, 2, { email: '此 Email 已被註冊，請替換新的 Email!' }, next))
    }

    // 密碼加密
    password = await bcrypt.hash(password, 12)

    // 建立使用者
    const newUser = await User.create({
      name,
      email,
      password
    })

    generateSendJWT(newUser, 201, res)
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

  // 取得個人資料（自己 / 他人）
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
  },

  // 取得追蹤列表
  async getFollowList(req, res, next) {
    const follows = await Follow.find({ "user": req.user.id }).populate({
      path: 'following',
      select: 'name avatar'
    })

    resHandle.successHandle(res, follows)
  },

  // 新增追蹤
  async addFollow(req, res, next) {

    const hasUser = await User.findById(req.param.userId).count()
    if (hasUser === 0) {
      return next(appError(400, '查無此帳號，無法追蹤', next))
    }

    await Follow.create({
      user: req.user.id,
      following: req.params.userId
    })

    resHandle.successHandle(res, '追蹤成功')
  },

  // 取消追蹤
  async deleteFollow(req, res, next) {
    await Follow.findOneAndDelete({ user: req.user.id, following: req.params.userId })

    resHandle.successHandle(res, '取消追蹤成功')
  }
}

module.exports = users