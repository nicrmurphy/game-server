import { RequestHandler } from 'express'

export type Route = {
  method: 'get',
  path: string,
  handler: RequestHandler
}