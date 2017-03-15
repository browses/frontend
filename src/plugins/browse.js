import { database } from '../helpers/firebase'
export default () => ({
  actions: {
    browse: {
      view: (m,d,a) => {
        database.ref(`browses/${d}/views`)
        .transaction(views => views ? views + 1 : 1)
        .catch(console.log)
        database.ref(`browses/${d}/browsers`)
        .transaction(browsers => ({ ...browsers, [m.user.fbid]: true }))
        .then(a.browses.view(d))
        .catch(console.log)
      },
      delete: (m,d,a) => {
        if(confirm('Delete this browse forever?')) {
          database.ref(`browses/${d}`).remove()
          .then(a.browses.remove(d))
          .catch(console.log)
        }
      },
    }
  }
})
