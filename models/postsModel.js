const mongoose = require('mongoose')
const postSchema = new mongoose.Schema(
  {
    editor: {
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
    },
    updatedAt: {
      type: Date,
      default: Date.now
    },
    likes: [{
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }]
  },
  {
    id: false,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
)

postSchema.virtual('comments', {
  ref: 'Comment',
  foreignField: 'postId',
  localField: '_id'
})

const Post = mongoose.model('Post', postSchema)
module.exports = Post