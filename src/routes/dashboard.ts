import { Route } from '../types'

const routes: Route[] = [
  {
    method: 'get',
    path: '/test',
    handler: (req, res) => {
      res.sendStatus(200)
    }
  }
]

export default routes