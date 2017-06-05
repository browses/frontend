import { app, Router } from 'hyperapp'

// Routable Views
import Default from './routes/default'
import Fallback from './routes/fallback'
// Required Plugins
import Browses from './plugins/browses'
import Browse from './plugins/browse'
import User from './plugins/user'
import Linker from './plugins/linker'

app({
  view: {
    '/': Default,
    '/:id': Default,
    '*': Fallback,
  },
  plugins: [
    Router,
    Linker,
    Browses,
    Browse,
    User,
  ],
})
