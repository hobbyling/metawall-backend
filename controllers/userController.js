const User = require('../models/usersModel')
const appError = require("../utils/appError")
const resHandle = require('../utils/resHandle')
const { generateSendJWT } = require('../utils/auth')
const {
  isValidPassword,
  isValidName,
  isValidEmail,
  isNotEmpty,
  isValidGender
} = require('../utils/validate')
const bcrypt = require('bcryptjs')
const nodemailer = require("nodemailer");
const dotenv = require('dotenv')
const jwt = require('jsonwebtoken')

if (process.env.NODE_ENV === 'dev') {
  dotenv.config({ path: './config_dev.env' })
} else {
  dotenv.config({ path: './config.env' })
}

const users = {
  // 註冊
  async signUp(req, res, next) {
    let { name, email, password } = req.body

    // 去除前後空白字元
    name = name ? name.trim() : name
    email = email ? email.trim() : email
    password = password ? password.trim() : password

    // 內容不可為空
    if (!isNotEmpty({ name, email, password }).valid) {
      return next(appError(400, 1, isNotEmpty({ name, email, password }).msg, next))
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
    let { email, password } = req.body

    // 去除前後空白字元
    email = email ? email.trim() : email
    password = password ? password.trim() : password

    // 內容不可為空
    if (!isNotEmpty({ email, password }).valid) {
      return next(appError(400, 1, isNotEmpty({ email, password }).msg, next))
    }

    const user = await User.findOne({ email }).select('+password')

    // 無此帳號
    if (!user) {
      return next(appError(400, 3, { email: '帳號、密碼不正確' }, next))
    }

    // 密碼錯誤
    const auth = await bcrypt.compare(password, user.password)
    if (!auth) {
      return next(appError(400, 3, { email: '帳號、密碼不正確' }, next))
    }

    generateSendJWT(user, 200, res)
  },

  // 更新密碼
  async updatePassword(req, res, next) {
    let { password, confirmPassword } = req.body

    // 去除前後空白字元
    password = password ? password.trim() : password
    confirmPassword = confirmPassword ? confirmPassword.trim() : confirmPassword

    // 內容不可為空
    if (!isNotEmpty({ password, confirmPassword }).valid) {
      return next(appError(400, 1, isNotEmpty({ password, confirmPassword }).msg, next))
    }

    // 密碼不一致
    if (password !== confirmPassword) {
      return next(appError(400, 1, { confirmPassword: '密碼不一致' }, next))
    }

    // 密碼至少 8 個字元以上，並英數混合
    if (!isValidPassword(password).valid) {
      return next(appError(400, 1, isValidPassword(password).msg, next))
    }

    const newPassword = await bcrypt.hash(password, 12)

    const user = await User.findByIdAndUpdate(req.user.id, {
      password: newPassword
    })

    generateSendJWT(user, 200, res)
  },

  // 寄出重設密碼信
  async forgetPassword(req, res, next) {
    let { email } = req.body

    // Email 格式錯誤
    if (!isValidEmail(email).valid) {
      return next(appError(400, 1, isValidEmail(email).msg, next))
    }

    // 是否是註冊過的 email
    const hasRegister = await User.findOne({ email })

    if (!hasRegister) {
      return next(appError(400, 1, { email: '此 Email 尚未註冊' }, next))
    }
    console.log('hasRegister', hasRegister)
    // 產生 JWT token
    const token = jwt.sign({ id: hasRegister._id }, process.env.JWT_RESET_SECRET, {
      expiresIn: Date.now() + 60 * 30 * 1000
    })

    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        type: "OAuth2",
        user: process.env.GMAIL_ACCOUNT,
        clientId: process.env.OAUTH_CLINENTID,
        clientSecret: process.env.OAUTH_CLINENTSECRET,
        refreshToken: process.env.OAUTH_REFRESHTOKEN,
        accessToken: process.env.OAUTH_ACCESSTOKEN
      }
    });

    let mailOptions = {
      from: process.env.GMAIL_ACCOUNT, // sender address
      to: email, // list of receivers:gennaro.nolan58@ethereal.email, zxz5khfjx7nsjlon@ethereal.email
      subject: "MetaWall Reset Password", // plain text body
      html: `https://hobbyling.github.io/metawall/resetPassword?email=${email}&token=${token}`, // html body
    }

    await transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        return next(appError(500, 0, err, next))
      } else {
        return resHandle.successHandle(res, '已發送 Email，請前往信箱查看', 1)
      }
    });
    return resHandle.successHandle(res, '已發送 Email，請前往信箱查看', 1)
  },

  // 取得個人資料（自己）
  async getProfile(req, res, next) {
    const user = await User.findById(req.user.id)

    if (!user) {
      return next(appError(400, 1, { id: '查無此用戶' }, next))
    }

    resHandle.successHandle(res, user, 1)
  },

  // 取得個人資料（他人）
  async getUserProfile(req, res, next) {
    let user = await User.findById(req.params.userId)

    if (!user) {
      return next(appError(400, 1, { id: '查無此用戶' }, next))
    }

    resHandle.successHandle(res, user)
  },

  // 更新個人資料
  async updateProfile(req, res, next) {
    let { name, gender, avatar } = req.body

    // 去除前後空白字元
    name = name ? name.trim() : name
    gender = gender ? gender.trim() : gender
    avatar = avatar ? avatar.trim() : avatar

    // 內容不可為空
    if (!isNotEmpty({ name, gender }).valid) {
      return next(appError(400, 1, isNotEmpty({ name, gender }).msg, next))
    }

    // 驗證姓名格式
    if (!isValidName(name).valid) {
      return next(appError(400, 1, isValidName(name).msg, next))
    }

    // 性別只能填入特定值
    if (!isValidGender(gender).valid) {
      return next(appError(400, 1, isValidGender(gender).msg, next))
    }

    // 要送出的參數
    let param = {
      name,
      gender
    }

    // 頭像有值才寫入
    if (avatar) param.avatar = avatar

    // 更新資料
    await User.findByIdAndUpdate(req.user.id, param)

    const user = await User.findById(req.user.id)

    resHandle.successHandle(res, user)
  }
}

module.exports = users