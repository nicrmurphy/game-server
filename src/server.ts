import express from 'express'
import http from 'http'
import cors from 'cors'
import helmet from 'helmet'
import { Server } from 'socket.io'
import { GameState, SQLConfig } from './types'
import routes from './routes'
import config from './config'
// import jwt from 'jsonwebtoken'
// import { tokenSecret } from './config'

const app = express()

//#region web server config and setup
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
//#endregion web server config and setup

//#region socket server config and setup
const io = new Server({
  cors: {
    origin: (o, res) => {
      console.log(o)  // here for debug only
      res(null, config.corsWhitelist)
    },
    methods: ['get', 'post']
  }
})

io.on('connection', (socket) => {
  console.log(socket.id, 'connected')

  socket.on('join', data => {
    console.log(`${socket.id} attempting to join room ${data.code}`)
    const room = io.of('/').adapter.rooms.get(data.code)
    if (room) {
      socket.join(data.code)
      io.to(data.code).emit('join', 'joined room successfully')
      console.log('joined room', data.code)
    } else {
      socket.emit('join-error', 'No room found')
    }
  })

  socket.on('new-room', () => {
    console.log(`${socket.id} attempting to create new room`)
    // TODO:- random room code generation
    const code = socket.id.replace(/-/g, '').substring(0, 12)
    socket.join(code)
    socket.emit('join', { code })
    console.log('joined room', code)
  })

  socket.on('start', (data: GameState) => {
    socket.broadcast.emit('start', data)
  })

  socket.on('move', (data: { id: number, prevIndex: number, newIndex: number, newFenString: string }) => {
    console.log('rooms:', socket.rooms)
    socket.broadcast.emit('move', data)
  })

  socket.on('resign', () => {
    console.log(`${socket.id} resigns in room ${socket.rooms}`)
    socket.broadcast.emit('resign')
  })
})
//#endregion socket server config and setup

// create the server instance
const server = http.createServer(app)

/**
 * Start running the web server and socket server on desired port
 * @param port Desired port to listen; defaults to port specified in app config
 */
const start = (port: number | undefined = Number(config.port)) => {
  // start the web server
  server.listen(port, () => {
    console.log(`✅ Web server running on port ${port}...`)

    // start the socket server
    io.listen(server)
    console.log(`✅ Socket server running on port ${port}...`)
  })
}

/**
 * Connect to the SQL Server database specified in app config
 * @param SQLConfig Provided SQL config to use; defaults to options specified in app config
 */
const connectDB = async (SQLConfig: SQLConfig = config.sql) => {
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

export default { app, io, start, connectDB }