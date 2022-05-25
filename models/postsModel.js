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
    comment: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Comment"
      }
    ],
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    },
    like: [{
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }]
  },
  {
    versionKey: false
  }
)

const Post = mongoose.model('Post', postSchema)
module.exports = Post