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
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    versionKey: false
  }
)

const users = mongoose.model('User', userSchema)
module.exports = users