const passport = require('passport')
const mongoose = require('mongoose')
const User = mongoose.model('User')

passport.use(User.createStrategy())
passport.serializeUser(User.serializeUser()) // Strategy 성공 시 호출됨
passport.deserializeUser(User.deserializeUser())
