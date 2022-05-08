const mongoose = require('mongoose')
const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, '貼文者 ID 未填寫']
    },
    content: {
      type: String,
      required: [true, '貼文內容未填寫']
    },
    image: {
      type: String,
      default: ''
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

const Post = mongoose.model('Post', postSchema)
module.exports = Post