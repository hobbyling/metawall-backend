const User = require('../models/usersModel')
const appError = require("../utils/appError")
const resHandle = require('../utils/resHandle')

const users = {
  // 取得所有用戶
  async getUsers(req, res, next) {
    const users = await User.find()
    resHandle.successHandle(res, users)
  },

  // 新增用戶
  async addUser(req, res, next) {
    // name 欄位驗證
    if (req.body.name === undefined) {
      return next(appError(400, '請填寫 name', next))
    }

    const { name, avatar } = req.body
    const newUser = await User.create({
      name: name,
      avatar: avatar
    })

    resHandle.successHandle(res, newUser)
  }
}

module.exports = users