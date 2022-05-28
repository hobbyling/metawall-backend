const mongoose = require('mongoose')
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, '姓名未填寫'],
      minlength: [2, '姓名至少 2 個字元以上']
    },
    avatar: {
      type: String,
      default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXkDs9PoEgHbaLi-uZMDGTiBNkCKl58jaqGg&usqp=CAU'
    },
    gender: {
      type: String,
      enum: ['male', 'female']
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    },
    password: {
      type: String,
      required: [true, '密碼未填寫'],
      minlength: [8, '密碼至少 8 個字元以上'],
      select: false
    },
    email: {
      type: String,
      required: [true, 'Email 未填寫'],
      unique: true,
      lowercase: true,
      select: false
    },
    followers: [
      {
        user: {
          type: mongoose.Schema.ObjectId,
          ref: 'User'
        },
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    followings: [
      {
        user: {
          type: mongoose.Schema.ObjectId,
          ref: 'User'
        },
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  {
    versionKey: false
  }
)

const User = mongoose.model('User', userSchema)
module.exports = User