exports.successHandle = function (res, data = [], message = null) {
  let responseMsg = ''
  switch (message) {
    case 1:
      responseMsg = '取得資料成功'
      break;

    case 2:
      responseMsg = '新增資料成功'
      break;

    case 3:
      responseMsg = '修改資料成功'
      break;

    case 4:
      responseMsg = '刪除資料成功'

    default:
      responseMsg = '操作成功'
      break;
  }

  res.status(200).json({
    status: 'success',
    data: data
  })
}