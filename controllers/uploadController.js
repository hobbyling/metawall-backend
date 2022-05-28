const appError = require("../utils/appError")
const resHandle = require("../utils/resHandle")
const sizeOf = require("image-size")
const { imageClient, default: ImgurClient } = require("imgur")

const uploads = {
  async uploadImage(req, res, next) {
    if (!req.files.length) {
      return next(appError(400, '尚未上傳檔案', next))
    }

    const dimensions = sizeOf(req.files[0].buffer)
    // if (dimensions.width !== dimensions.height) {
    //   return next(appError(400, '圖片長寬不符合 1:1 尺寸', next))
    // }

    const client = new ImgurClient({
      clientId: process.env.IMGUR_CLIENTID,
      clientSecret: process.env.IMGUR_CLIENT_SECRET,
      refreshToken: process.env.IMGUR_REFRESH_TOKEN
    })

    const response = await client.upload({
      image: req.files[0].buffer.toString('base64'),
      type: 'base64',
      album: process.env.IMGUR_ALBUM_ID
    })

    resHandle.successHandle(res, { imgUrl: response.data.link })
  }
}

module.exports = uploads