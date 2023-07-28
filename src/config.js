require('dotenv').config()
const assert = require('assert')

// Deconstruct environment variables for the server
const {
  API_ENDPOINT,
  APP_PASSPHRASE,
  PORT,
  HOST,
  HOST_URL,
  TOKEN_ENCRYPT_SECRET,
  SQL_SERVER,
  SQL_DATABASE,
  SQL_USER,
  SQL_PASSWORD,
  SQL_ENCRYPT
} = process.env

// Validate required environment variables
const validate = (val, name) => assert(val, `${name} configuration is required.`)
validate(API_ENDPOINT, 'API_ENDPOINT')
validate(PORT, 'PORT')
validate(HOST, 'HOST')
validate(HOST_URL, 'HOST_URL')
validate(TOKEN_ENCRYPT_SECRET, 'TOKEN_ENCRYPT_SECRET')
validate(SQL_SERVER, 'SQL_SERVER')
validate(SQL_DATABASE, 'SQL_DATABASE')
validate(SQL_USER, 'SQL_USER')
validate(SQL_PASSWORD, 'SQL_PASSWORD')
validate(SQL_ENCRYPT, 'SQL_ENCRYPT')

// Export the configuration information
module.exports = {
  API_ENDPOINT,
  secret: APP_PASSPHRASE,
  port: PORT,
  host: HOST,
  url: HOST_URL,
  tokenSecret: TOKEN_ENCRYPT_SECRET,
  sql: {
    server: SQL_SERVER,
    database: SQL_DATABASE,
    user: SQL_USER,
    password: SQL_PASSWORD,
    options: {
      encrypt: false,
      enableArithAbort: true,
      trustServerCertificate: false
    },
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000  // TODO: may need to be adjusted
    }
  }
}