import server from './server'
import config from './config'

const startServer = (): void => {
  try {
    // start the web server
    server.start(Number(config.port))
    // connect to SQL Server
    // server.connectDB(config.sql)

  } catch (err) {
    console.log('server error:', err)
  }
}

startServer()