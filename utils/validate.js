const validator = require('validator')

/**
 * 欄位不可為空
 * @param {object} obj 
 * @returns {Boolean}
 */
exports.isNotEmpty = function (obj) {
  let msg = {}
  const arr = Object.entries(obj)
  arr.forEach(item => {
    if (!item[1]) {
      msg[item[0]] = '欄位未填寫'
    }
  })

  return Object.keys(msg).length < 1
    ? { valid: true }
    : {
      valid: false,
      msg
    }
}

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

/**
 * 驗證性別格式
 * @param {string} gender 
 * @returns {Boolean}
 */
exports.isValidGender = function (gender) {
  return gender === 'male' || gender === 'female'
    ? { valid: true }
    : {
      valid: false,
      msg: {
        gender: '性別只能填入 male 或 female'
      }
    }
}

/**
 * 驗證 mongoose ID格式
 * @param {string} id 
 * @returns {Boolean}
 */
exports.isValidID = function (id) {
  return validator.isMongoId(id)
    ? { valid: true }
    : {
      valid: false,
      msg: {
        userId: '請輸入正確 ID'
      }
    }
}

/**
 * 驗證 當前頁碼
 * @param {string} page 
 * @returns {Boolean}
 */
exports.isValidPage = function (page) {
  return page
    ? validator.isInt(page.toString())
      ? Math.max(1, Number(page))
      : 1
    : 1
}

/**
 * 驗證 單頁筆數
 * @param {string} limit 
 * @returns {Boolean}
 */
exports.isValidLimit = function (limit) {
  return limit
    ? validator.isInt(limit.toString()) && Number(limit) > 0
      ? Number(limit)
      : 10
    : 10
}