import { RequestHandler } from 'express'

export type Route = {
  method: 'get',
  path: string,
  handler: RequestHandler
}

export type SQLConfig = {
  server: string,
  database: string,
  user: string,
  password: string,
  options: {
    encrypt: boolean,
    enableArithAbort: boolean,
    trustServerCertificate: boolean
  },
  pool: {
    max: number,
    min: number,
    idleTimeoutMillis: number
  }
}