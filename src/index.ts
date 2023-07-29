import server from './server'
import config from './config'

const startServer = (): void => {
  try {
    // start the web server
    // server.startWebServer(Number(config.port))
    // start the socket server
    server.startSocketServer(Number(config.sockPort))
    // connect to SQL Server
    // server.connectDB(config.sql)

  } catch (err) {
    console.log('server error:', err)
  }
}

startServer()