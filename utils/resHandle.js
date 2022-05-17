exports.successHandle = function (res, data = []) {
  res.status(200).json({
    status: 'success',
    data: data
  })
}