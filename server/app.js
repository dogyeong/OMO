const express = require('express')
const next = require('next')
const helmet = require('helmet')
const compression = require('compression')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const mongoose = require('mongoose')
const passport = require('passport')

/* Loads all variables from .env file to "process.env" */
require('dotenv').config()
require('./models/Post')
require('./models/User')
require('./passport')

const routes = require('./routes')

const dev = process.env.NODE_ENV !== 'production'
const port = process.env.PORT || 3000
const ROOT_URL = dev ? `http://localhost:${port}` : process.env.PRODUCTION_URL
const app = next({ dev })
const handle = app.getRequestHandler()
const sessionConfig = {
  name: 'omo.sid',
  // secret used for using signed cookies w/ the session
  secret: process.env.SESSION_SECRET,
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 7 * 24 * 60 * 60, // save session for 7 days
  }),
  // forces the session to be saved back to the store
  resave: false,
  // don't save unmodified sessions
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 14, // expires in 14 days
  },
}
const mongooseOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
}

mongoose.connect(process.env.MONGO_URI, mongooseOptions).then(() => console.log('DB connected'))

mongoose.connection.on('error', (err) => {
  console.log(`DB connection error: ${err.message}`)
})

app.prepare().then(() => {
  const server = express()

  // 프로덕션 환경에서의 추가적인 미들웨어 설정
  if (!dev) {
    /* helmet : http 헤더 설정을 통해 보안 강화 */
    server.use(helmet())
    /* compression: Gzip 압축으로 응답파일 크기 감소  */
    server.use(compression())
    /* serve secure cookies in production environment */
    sessionConfig.cookie.secure = true
    /* 1번째 프록시 서버를 클라이언트로서 신뢰한다 */
    server.set('trust proxy', 1)
  }

  server.use(express.json())
  /* Apply our session configuration to express-session */
  server.use(session(sessionConfig))
  /* Add passport middleware to set passport up */
  server.use(passport.initialize())
  server.use(passport.session())
  server.use((req, res, next) => {
    /* custom middleware to put our user data (from passport) on the req.user so we can access it as such anywhere in our app */
    res.locals.user = req.user || null
    next()
  })

  /* api routes */
  server.use('/api', routes)

  /* create custom routes with route params */
  server.get('/profile/:userId', (req, res) => {
    const routeParams = Object.assign({}, req.params, req.query)
    return app.render(req, res, '/profile', routeParams)
  })

  /** default route
   * allows Next to handle all other routes
   * includes the numerous `/_next/...` routes which must    be exposedfor the next app to work correctly
   * includes 404'ing on unknown routes
   */
  server.get('*', (req, res) => {
    handle(req, res)
  })

  /* Error handling from async / await functions */
  server.use((err, req, res, next) => {
    const { status = 500, message } = err
    res.status(status).json(message)
  })

  server.listen(port, (err) => {
    if (err) throw err
    console.log(`Server listening on ${ROOT_URL}`)
  })
})
