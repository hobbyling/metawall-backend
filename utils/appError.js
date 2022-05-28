const appError = (httpStatus, errStatus, errMessage = null, next) => {
  let status = 0
  switch (errStatus) {
    case 1:
      status = '資料格式錯誤'
      break;

    case 2:
      status = '資料已存在'

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