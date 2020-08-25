const multer = require('multer');
const jimp = require('jimp');
const mongoose = require('mongoose');
const Post = mongoose.model('Post');
const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-east-2' });

const imageUploadOptions = {
  storage: multer.memoryStorage(),
  limits: {
    // storing image files up to 1mb
    fileSize: 1024 * 1024 * 1,
  },
  fileFilter: (req, file, next) => {
    if (file.mimetype.startsWith('image/')) {
      next(null, true);
    } else {
      next(null, false);
    }
  },
};

exports.uploadImage = multer(imageUploadOptions).single('image');

exports.resizeImage = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const image = await jimp.read(Buffer.from(req.file.buffer, 'base64'));
  await image.resize(750, jimp.AUTO);
  const file = await image.getBufferAsync(jimp.AUTO);

  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'us-east-2',
  });

  const extension = req.file.mimetype.split('/')[1];

  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `uploads/${req.user.name}-${Date.now()}.${extension}`,
    Body: file,
    ContentType: req.file.mimetype,
    ACL: 'public-read',
  };

  try {
    await new Promise((resolve, reject) => {
      return s3.upload(params, (err, data) => {
        if (err) {
          console.log(err);
          return reject(err);
        }
        console.log(data);
        req.body.image = data.Location;
        resolve(next());
      });
    });
  } catch (err) {
    throw new Error(err);
  }

  // 기존 express에 static file upload
  //
  // const extension = req.file.mimetype.split('/')[1];
  // req.body.image = `/uploads/${req.user.name}-${Date.now()}.${extension}`;
  // const image = await jimp.read(req.file.buffer);
  // await image.resize(750, jimp.AUTO);
  // await image.write(`./public${req.body.image}`);
  // next();
};

exports.addPost = async (req, res) => {
  req.body.postedBy = req.user._id;
  const post = await new Post(req.body).save();
  await Post.populate(post, {
    path: 'postedBy',
    select: '_id name avatar',
  });
  res.json(post);
};

exports.getPostById = async (req, res, next, id) => {
  const post = await Post.findOne({ _id: id });
  req.post = post;

  const posterId = mongoose.Types.ObjectId(req.post.postedBy._id);
  if (req.user && posterId.equals(req.user._id)) {
    req.isPoster = true;
    return next();
  }
  next();
};

exports.deletePost = async (req, res) => {
  const { _id } = req.post;

  if (!req.isPoster) {
    return res.status(400).json({
      message: 'You are not authorized to perform this action',
    });
  }
  const deletedPost = await Post.findOneAndDelete({ _id });
  res.json(deletedPost);
};

exports.getPostsByUser = async (req, res) => {
  const posts = await Post.find({ postedBy: req.profile._id }).sort({ createdAt: 'desc' });
  res.json(posts);
};

exports.getPostFeed = async (req, res) => {
  const { following, _id } = req.profile;
  following.push(_id);
  const posts = await Post.find({ postedBy: { $in: following } }).sort({ createdAt: 'desc' });
  res.json(posts);
};

exports.toggleLike = async (req, res) => {
  const { postId } = req.body;
  const post = await Post.findOne({ _id: postId });
  const likeIds = post.likes.map((id) => id.toString());
  const authUserId = req.user._id.toString();
  if (likeIds.includes(authUserId)) {
    await post.likes.pull(authUserId);
  } else {
    await post.likes.push(authUserId);
  }
  await post.save();
  res.json(post);
};

exports.toggleComment = async (req, res) => {
  const { comment, postId } = req.body;
  let operator;
  let data;

  if (req.url.includes('uncomment')) {
    operator = '$pull';
    data = { _id: comment._id };
  } else {
    operator = '$push';
    data = { text: comment.text, postedBy: req.user._id };
  }

  const updatedPost = await Post.findOneAndUpdate(
    { _id: postId },
    { [operator]: { comments: data } },
    { new: true }
  )
    .populate('postedBy', '_id name avatar')
    .populate('comments.postedBy', '_id name avatar');

  res.json(updatedPost);
};
