const User = require('../models/usersModel')
const resHandle = require('../utils/resHandle')

const users = {
  // 取得所有用戶
  async getUsers(req, res, next) {
    const users = await User.find()
    resHandle.successHandle(res, users)
  },

  // 新增用戶
  async addUser(req, res, next) {
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
  }
}

module.exports = users