const mongoose = require('mongoose')
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, '姓名未填寫']
    },
    avatar: {
      type: String,
      default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXkDs9PoEgHbaLi-uZMDGTiBNkCKl58jaqGg&usqp=CAU'
    },
    sex: {
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
      minlength: 8,
      select: false
    },
    email: {
      type: String,
      required: [true, 'Email 未填寫'],
      unique: true,
      lowercase: true,
      select: false
    },
    like: [{
      type: mongoose.Schema.ObjectId,
      ref: 'Post'
    }]
  },
  {
    versionKey: false
  }
)

const users = mongoose.model('User', userSchema)
module.exports = users