const appError = (httpStatus, errStatus, errMessage = null, next) => {
  let status = 0
  switch (errStatus) {
    case 1:
      status = '資料格式錯誤'
      break;

    case 2:
      status = '資料已存在'
      break;

    case 3:
      status = '資料驗證錯誤'

    case 4:
      status = '您尚未登入'

    default:
      break;
  }

  const error = new Error(status)
  error.statusCode = httpStatus
  error.isOperational = true
  error.error = errMessage
  next(error)
}

module.exports = appError