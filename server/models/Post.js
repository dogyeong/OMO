const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema

const postSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: 'Post content is required',
    },
    image: {
      type: String,
    },
    likes: [{ type: ObjectId, ref: 'User' }],
    comments: [
      {
        text: String,
        createdAt: { type: Date, default: Date.now },
        postedBy: { type: ObjectId, ref: 'User' },
      },
    ],
    postedBy: { type: ObjectId, ref: 'User' },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  /* don't want to create our indices every time (nice for development, but can result in a performance hit) */
  { autoIndex: false }
)

/* Kind of like a middleware function after creating our schema (since we have access to next) */
/* Must be a function declaration (not an arrow function), because we want to use 'this' to reference our schema */
const autoPopulatePostedBy = function (next) {
  this.populate('postedBy', '_id name avatar')
  this.populate('comments.postedBy', '_id name avatar')
  next()
}

/* We're going to need to populate the 'postedBy' field virtually every time we do a findOne / find query, so we'll just do it as a pre hook here upon creating the schema */
postSchema.pre('findOne', autoPopulatePostedBy).pre('find', autoPopulatePostedBy)
/* Create index on keys for more performant querying/post sorting */
postSchema.index({ postedBy: 1, createdAt: 1 })

module.exports = mongoose.model('Post', postSchema)
