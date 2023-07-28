import dashboard from './routes/dashboard'
import { Route } from "./types"

const routes: Route[] = [
  {
    method: 'get',
    path: '/',
    handler: (req, res) => {
      res.sendStatus(200)
    }
  },
  ...dashboard
]

export default routes