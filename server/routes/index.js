const express = require('express')
const authController = require('../controllers/authController')
const userController = require('../controllers/userController')
const postController = require('../controllers/postController')
const router = express.Router()

/* Error handler for async / await functions */
const catchErrors = (fn) => {
  return function (req, res, next) {
    return fn(req, res, next).catch(next)
  }
}

/**
 * AUTH ROUTES: /auth
 */
router.post('/auth/signup', authController.validateSignup(), catchErrors(authController.signup))
router.post('/auth/signin', authController.signin)
router.get('/auth/signout', authController.signout)

/**
 * USER ROUTES: /users
 *
 */

// userId가 파라미터로 들어간 모든 경로에 대해 getUserById를 먼저 실행
// req.profile 에 파라미터로 넘겨준 userId에 해당하는 user정보를 저장하고
// req.user와 userId의 user가 일치하는지를 req.isAuthUser에 저장
router.param('userId', userController.getUserById)

router.put(
  '/users/follow',
  authController.checkAuth,
  catchErrors(userController.addFollowing),
  catchErrors(userController.addFollower)
)
router.put(
  '/users/unfollow',
  authController.checkAuth,
  catchErrors(userController.deleteFollowing),
  catchErrors(userController.deleteFollower)
)

router
  .route('/users/:userId')
  .get(userController.getAuthUser)
  .put(
    authController.checkAuth,
    userController.uploadAvatar,
    catchErrors(userController.resizeAvatar),
    catchErrors(userController.updateUser)
  )
  .delete(authController.checkAuth, catchErrors(userController.deleteUser))

router.get('/users', userController.getUsers)
router.get('/users/profile/:userId', userController.getUserProfile)
router.get('/users/feed/:userId', authController.checkAuth, catchErrors(userController.getUserFeed))

/**
 * POST ROUTES: /posts
 */
router.param('postId', postController.getPostById)

router.put('/posts/like', authController.checkAuth, catchErrors(postController.toggleLike))
router.put('/posts/unlike', authController.checkAuth, catchErrors(postController.toggleLike))

router.put('/posts/comment', authController.checkAuth, catchErrors(postController.toggleComment))
router.put('/posts/uncomment', authController.checkAuth, catchErrors(postController.toggleComment))

router.delete('/posts/:postId', authController.checkAuth, catchErrors(postController.deletePost))

router.post(
  '/posts/new/:userId',
  authController.checkAuth,
  postController.uploadImage,
  catchErrors(postController.resizeImage),
  catchErrors(postController.addPost)
)
router.get('/posts/by/:userId', catchErrors(postController.getPostsByUser))
router.get('/posts/feed/:userId', catchErrors(postController.getPostFeed))

module.exports = router
