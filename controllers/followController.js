const User = require('../models/usersModel')
const Follow = require('../models/followsModel')
const appError = require("../utils/appError")
const resHandle = require('../utils/resHandle')

const follows = {
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

    const hasUser = await User.findById(req.params.userId).count()
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

module.exports = follows