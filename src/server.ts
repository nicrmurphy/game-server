import express from 'express'
import cors from 'cors'
import routes from './routes'
// import jwt from 'jsonwebtoken'
// import { tokenSecret } from './config'

const app = express()

// CORS configuration
app.use(cors({
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200
}))

// app.use(express.static('public'));

// add body-parser middleware
app.use(express.json())
// app.use(express.urlencoded({ extended: true }))

// add auth middleware
// app.use((req, res, next) => {
//   if (req.path !== '/auth') {
//     // verify JWT is valid token and not expired
//     const { authorization } = req.headers
//     if (authorization) {
//       const token = authorization.split(' ')[1]
//       jwt.verify(token, tokenSecret, (err, user) => {
//         if (err) return res.sendStatus(403)

//         req.user = user
//         return next()
//       })
//     } else {
//       return res.sendStatus(401)
//     }
//   } else {
//     return next()
//   }
// })

// Apply routes to web server
routes.forEach(({ method, path, handler }) => app[method](path, handler))

const start = (port: number) => app.listen(port, () => {
  console.log(`Server running on port ${port}...`)
})

import { Server } from 'socket.io'
const io = new Server(5000, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['get', 'post']
  }
})

io.on('connection', (socket) => {
  socket.emit('hello', 'world')

  socket.on('move', (data: { id: number, prevIndex: number, newIndex: number, newFenString: string }) => {
    socket.broadcast.emit('move', data)
  })
})


const connectDB = async SQLConfig => {
  // Establish SQL Server connection pool
  const db = require('./data/db')
  await db.openConnection(SQLConfig)
  if (db.isConnected())
    console.log(`Successfully connected to database \u001b[36m${SQLConfig.database
      }\u001b[0m on server \u001b[36m${SQLConfig.server
      }\u001b[0m as user \u001b[36m${SQLConfig.user
      }\u001b[0m`)
  else console.log('Unable to connect to database')

  // Debug: Retrieve and display most recent logins for current user
  // const { loginService } = require('./data/vp')
  // const recentLogins = await loginService.getRecentLogins(10)
  // console.table(recentLogins)

}

const server = { app, start, connectDB }


export default server