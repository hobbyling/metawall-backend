var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const postsRouter = require('./routes/posts');
const uploadRouter = require('./routes/uploads')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')

let DB = ''
if (process.env.NODE_ENV === 'dev') {
  dotenv.config({ path: './config_dev.env' })
  // DB = process.env.DATABASE
  DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD)
} else {
  dotenv.config({ path: './config.env' })
  DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD)
}

// 補捉程式錯誤
process.on('uncaughtException', err => {
  console.error('Uncaughted Exception！')
  console.error(err);
  process.exit(1);
});

var app = express();

mongoose.connect(DB)
  .then(res => console.log("連線資料成功"))
  .catch(err => console.log("連線失敗：", err))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/posts', postsRouter);
app.use('/upload', uploadRouter);

// 404 錯誤
app.use(function (req, res, next) {
  res.status(404).json({
    status: false,
    message: '查無此頁面'
  })
})

// production 環境錯誤
const resErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: false,
      message: err.message,
      error: err.error
    })
  } else {
    console.error('出現錯誤', err)

    res.status(500).json({
      status: false,
      message: '系統錯誤，請洽系統管理員'
    })
  }
}

// dev 環境錯誤
const resErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: false,
    message: err.message,
    error: err.error,
    statusCode: err.statusCode,
    isOperational: err.isOperational,
    stack: err.stack
  })
}

// 可預期錯誤處理
app.use(function (err, req, res, next) {
  err.statusCode = err.statusCode || 500

  // dev 環境
  if (process.env.NODE_ENV === 'dev') {
    return resErrorDev(err, res)
  }

  // production 環境
  if (err.name === 'ValidationError') {
    err.message = '資料欄位未正確填寫，請重新輸入'
    err.isOperational = true
    return resErrorProd(err, res)
  }

  return resErrorProd(err, res)
})

// 未捕捉到的 catch
process.on('unhandledRejection', (err, promise) => {
  console.error('未捕捉到的 rejection：', promise, '原因：', err);
});

module.exports = app;
