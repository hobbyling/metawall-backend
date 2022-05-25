const mongoose = require('mongoose')
const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User"
    },
    postId: {
      type: mongoose.Schema.ObjectId,
      ref: "Post"
    },
    content: {
      type: String,
      required: [true, '內容未填寫']
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    versionKey: false
  }
)

const follows = mongoose.model('Comment', commentSchema)
module.exports = follows