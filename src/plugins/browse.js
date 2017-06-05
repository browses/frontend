import { database } from '../helpers/firebase'
export default () => ({
  actions: {
    browse: {
      view: (m,a,d) => {
        database.ref(`browses/${d}/browsers`)
        .transaction(browsers => ({ ...browsers, [m.user.fbid]: true }))
        .then(a.browses.view(d))
        .catch(console.log)
      },
      delete: (m,a,d) => {
        if(confirm('Delete this browse forever?')) {
          database.ref(`browses/${d}`).remove()
          .then(a.browses.remove(d))
          .catch(console.log)
        }
      },
    }
  }
})
