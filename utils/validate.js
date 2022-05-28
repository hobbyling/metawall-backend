const validator = require('validator')

/**
 * 驗證密碼格式，至少 8 個字元以上，並英數混合
 * @param {string} str 密碼
 * @returns {Boolean}
 */
exports.isValidPassword = function (str) {
  const reg = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
  return reg.test(str)
    ? { valid: true }
    : {
      valid: false,
      msg: {
        password: '密碼至少 8 個字元以上，並英數混合'
      }
    }
}

/**
 * 驗證姓名格式
 * @param {string} name 姓名
 * @returns {Boolean}
 */
exports.isValidName = function (name) {
  return validator.isLength(name, { min: 2 })
    ? { valid: true }
    : {
      valid: false,
      msg: {
        name: '姓名至少 2 個字元以上'
      }
    }
}

/**
 * 驗證Email格式
 * @param {string} email 
 * @returns {Boolean}
 */
exports.isValidEmail = function (email) {
  return validator.isEmail(email)
    ? { valid: true }
    : {
      valid: false,
      msg: {
        email: 'Email 格式錯誤'
      }
    }
}