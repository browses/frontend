import { app, Router } from 'hyperapp'

// Routable Views
import Default from './routes/default'
import Fallback from './routes/fallback'
// Required Plugins
import Browses from './plugins/browses'
import Browse from './plugins/browse'
import User from './plugins/user'
import Linker from './plugins/linker'
import Extension from './plugins/extension'

app({
  view: [
    ['/', Default],
    ['/:id', Default],
    ['*', Fallback],
  ],
  mixins: [
    Router,
    Linker,
    Browses,
    Browse,
    User,
    Extension,
  ],
})
