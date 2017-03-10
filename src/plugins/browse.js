import firebase from 'firebase'

const database = firebase.database()
const storage = firebase.storage().ref()

export default (options) => ({
  actions: {
    browse: {
      view: (m,d,a) => {
        database.ref(`browses/${d}/views`)
        .transaction(views => views ? views + 1 : 1)
        .catch(console.log)
        database.ref(`browses/${d}/browsers`)
        .transaction(browsers => Object.assign({}, browsers, { [m.user.fbid]: true }))
        .then(a.browses.browse(d))
        .catch(console.log)
      },
      delete: (m,d,a) =>
        database.ref(`browses/${d}`).remove()
        .then(a.browses.remove(d))
        .catch(console.log),
    }
  }
})
