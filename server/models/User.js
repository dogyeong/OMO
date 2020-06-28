const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema
const mongodbErrorHandler = require('mongoose-mongodb-errors')
const passportLocalMongoose = require('passport-local-mongoose')

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: 'Email is required',
    },
    name: {
      type: String,
      trim: true,
      unique: true,
      minlength: 4,
      maxlength: 10,
      required: 'Name is required',
    },
    avatar: {
      type: String,
      required: 'Avatar image is required',
      default: '/images/profile.png',
    },
    about: {
      type: String,
      trim: true,
    },
    /* we wrap 'following' and 'followers' in array so that when they are populated as objects, they are put in an array (to more easily iterate over them) */
    following: [{ type: ObjectId, ref: 'User' }],
    followers: [{ type: ObjectId, ref: 'User' }],
  },
  /* gives us "createdAt" and "updatedAt" fields automatically */
  { timestamps: true }
)

const autoPopulateFollowingAndFollowers = function (next) {
  this.populate('following', '_id name avatar')
  this.populate('followers', '_id name avatar')
  next()
}

userSchema.pre('findOne', autoPopulateFollowingAndFollowers)

/* passportLocalMongoose takes our User schema and sets up a passport "local" authentication strategy using our email as the username field */
userSchema.plugin(passportLocalMongoose, { usernameField: 'email' })

/* The MongoDBErrorHandler plugin gives us a better 'unique' error, rather than: "11000 duplicate key" */
userSchema.plugin(mongodbErrorHandler)

module.exports = mongoose.model('User', userSchema)
