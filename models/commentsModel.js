const mongoose = require('mongoose')
const commentSchema = new mongoose.Schema(
  {
    editor: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, '請輸入留言者 ID']
    },
    postId: {
      type: mongoose.Schema.ObjectId,
      ref: "Post",
      required: [true, '請輸入貼文 ID']
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

commentSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'editor',
    select: 'name avatar createdAt'
  })

  next();
})

const Comment = mongoose.model('Comment', commentSchema)
module.exports = Comment