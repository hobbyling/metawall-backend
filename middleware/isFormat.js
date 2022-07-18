const express = require('express')
const appError = require('./appError')
const handleErrorAsync = require('./handleErrorAsync')

const isJson = (err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error(err);
    return next(appError(401, 1, '資料不是 Json 格式', next)); // Bad request
  }
  next();
};

module.exports = {
  isJson
}