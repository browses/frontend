import { h, app, Router } from 'hyperapp'

// Routable Views
import Default from './routes/default'
import Fallback from './routes/fallback'
// Required Plugins
import Browses from './plugins/browses'
import Browse from './plugins/browse'
import User from './plugins/user'

app({
  root: document.querySelector('main'),
  view: {
    '/': [Default, (m,a) => a.browses.set(0)],
    '/:id': [Default, (m,a) => a.browses.set(m.router.params.id)],
    '*': [Fallback],
  },
  plugins: [
    Router,
    Browses,
    Browse,
    User,
  ],
})
