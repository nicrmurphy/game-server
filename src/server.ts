import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { Server } from 'socket.io'
import { SQLConfig } from './types'
import routes from './routes'
import config from './config'
// import jwt from 'jsonwebtoken'
// import { tokenSecret } from './config'

const app = express()

// helmet security
app.use(helmet())

// reduce fingerprinting
app.disable('x-powered-by')

// CORS configuration
app.use(cors({
  origin: o => o && config.corsWhitelist.includes(o),
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

// custom 404
// TODO: implement
app.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!")
})

// custom error handler
// TODO: implement; fix types
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

const io = new Server(5000, {
  cors: {
    origin: config.corsWhitelist,
    methods: ['get', 'post']
  }
})

io.on('connection', (socket) => {
  socket.emit('hello', 'world')

  socket.on('move', (data: { id: number, prevIndex: number, newIndex: number, newFenString: string }) => {
    socket.broadcast.emit('move', data)
  })
})

const connectDB = async (SQLConfig: SQLConfig) => {
  // Establish SQL Server connection pool
  const db = require('./data/db')
  await db.openConnection(SQLConfig)
  if (db.isConnected())
    console.log(`Successfully connected to database \u001b[36m${SQLConfig.database
      }\u001b[0m on server \u001b[36m${SQLConfig.server
      }\u001b[0m as user \u001b[36m${SQLConfig.user
      }\u001b[0m`)
  else console.log('Unable to connect to database')
}

const server = { app, start, connectDB }


export default server