const passport = require('passport')
const mongoose = require('mongoose')
const User = mongoose.model('User')
const { check, validationResult } = require('express-validator')

exports.validateSignup = () => {
  return [
    check('name', '이름을 4자 이상 10자 이하로 입력해 주세요.')
      .not()
      .isEmpty()
      .isLength({ min: 4, max: 10 })
      .trim(),
    check('email', '올바르지 않은 이메일입니다.').isEmail().normalizeEmail(),
    check('password', '비밀번호를 4자 이상 10자 이하로 입력해 주세요.')
      .not()
      .isEmpty()
      .isLength({ min: 4, max: 10 }),
  ]
}

exports.signup = async (req, res) => {
  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }

  const { name, password, email } = req.body
  const user = await new User({ name, password, email })
  await User.register(user, password, (err, user) => {
    if (err) {
      return res.status(500).send(err.message)
    }
    res.json(user.name)
  })
}

exports.signin = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return res.status(500).json(err.message)
    }
    if (!user) {
      return res.status(400).json(info.message)
    }

    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json(err.message)
      }
      res.json(user)
    })
  })(req, res, next)
}

exports.signout = (req, res) => {
  res.clearCookie('omo.sid')
  req.logout()
  res.json({ message: 'You are now signed out' })
}

exports.checkAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/signin')
}
