const User = require('../models/usersModel')
const appError = require("../utils/appError")
const resHandle = require('../utils/resHandle')
const { isValidID } = require('../utils/validate')

const follows = {
  // 取得個人追蹤列表
  async getFollowingList(req, res, next) {
    const list = await User.find(
      { "_id": req.user.id }
    ).populate({
      path: 'followings.user',
      select: 'name avatar _id'
    }).select('followings')

    resHandle.successHandle(res, { list: list[0].followings })
  },

  // 追蹤朋友
  async follow(req, res, next) {
    // 無法追蹤自己
    if (req.user.id === req.params.userId) {
      return next(appError(401, 1, { userId: '您無法追蹤自己' }, next))
    }

    // 確認 ID 格式
    if (!isValidID(req.params.userId).valid) {
      return next(appError(400, 1, isValidID(req.params.userId).msg, next))
    }

    // 確認被追蹤是否存在
    const hasUser = await User.findById(req.params.userId).count()
    if (hasUser === 0) {
      return next(appError(400, 1, { userId: '查無此帳號，無法追蹤' }, next))
    }

    // 在自己的 followings 加上追蹤者
    await User.updateOne(
      {
        _id: req.user.id,
        'followings.user': { $ne: req.params.userId }
      },
      {
        $addToSet: { followings: { user: req.params.userId } }
      }
    )

    // 在被追蹤者的 followers 加上自己
    await User.updateOne(
      {
        _id: req.params.userId,
        'followers.user': { $ne: req.user.id }
      },
      {
        $addToSet: { followers: { user: req.user.id } }
      }
    );
    resHandle.successHandle(res, '追蹤成功')
  },

  // 取消追蹤朋友
  async unFollow(req, res, next) {
    // 無法取消追蹤自己
    if (req.user.id === req.params.userId) {
      return next(appError(401, 1, { userId: '您無法取消追蹤自己' }, next))
    }

    // 確認 ID 格式
    if (!isValidID(req.params.userId).valid) {
      return next(appError(400, 1, isValidID(req.params.userId).msg, next))
    }

    // 確認被追蹤是否存在
    const hasUser = await User.findById(req.params.userId).count()
    if (hasUser === 0) {
      return next(appError(400, 1, { userId: '查無此帳號，無法取消追蹤' }, next))
    }

    // 在自己的 followings 加上追蹤者
    await User.updateOne(
      {
        _id: req.user.id
      },
      {
        $pull: { followings: { user: req.params.userId } }
      }
    )

    // 在被追蹤者的 followers 加上自己
    await User.updateOne(
      {
        _id: req.params.userId
      },
      {
        $pull: { followers: { user: req.user.id } }
      }
    );

    resHandle.successHandle(res, '取消追蹤成功')
  }
}

module.exports = follows