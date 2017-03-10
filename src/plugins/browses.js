import firebase from 'firebase'

firebase.initializeApp({
  apiKey: 'AIzaSyDf0B5peKIIXbamijhyJjqtJtv6LsYiQIQ',
  authDomain: 'browses-ef3f0.firebaseapp.com',
  databaseURL: 'https://browses-ef3f0.firebaseio.com',
  storageBucket: 'browses-ef3f0.appspot.com',
  messagingSenderId: '685716734453'
})

const database = firebase.database()
const storage = firebase.storage().ref()

const removeDuplicatesBy = (keyFn, array) => {
  var mySet = new Set()
  return array.filter(function(x) {
    var key = keyFn(x), isNew = !mySet.has(key)
    if (isNew) mySet.add(key)
    return isNew
  })
}

export const getBrowses = (filter, start) => {
  if(filter === 0) return getLatestBrowses(start);
  if(filter === 1) return getPopularBrowses(start);
  return getUserBrowses(filter, start);
}

export const getUserBrowses = (id, start) => {
  const next = start && start.key;
  if (next) {
    return database.ref('browses')
    .orderByChild('browser')
    .startAt(id)
    .endAt(id, next)
    .limitToLast(5)
    .once('value');
  }
  return database.ref('browses')
  .orderByChild('browser')
  .equalTo(id)
  .limitToLast(5)
  .once('value');
}

export const getLatestBrowses = start => {
  const next = start && start.published;
  if (next) {
    return database.ref('browses')
    .orderByChild('published')
    .endAt(next)
    .limitToLast(5)
    .once('value');
  }
  return database.ref('browses')
  .limitToLast(5)
  .once('value');
}

export const getPopularBrowses = start => {
  const views = start && start.views;
  const next = start && start.key;
  if (next) {
    return database.ref('browses')
    .orderByChild('views')
    .endAt(views, next)
    .limitToLast(5)
    .once('value');
  }
  return database.ref('browses')
  .orderByChild('views')
  .limitToLast(5)
  .once('value');
}

export default (options) => ({
  model: {
    browses: {
      list: [],
      filter: 0,
      filters: ['Most Recent', 'Most Popular'],
    },
  },
  actions: {
    browses: {
      set: (m,d,a) => {
        a.browses.clear()
        a.browses.filter(d)
        a.browses.fetch()
        .then(browses => browses.forEach(b =>
          a.browses.add(b.val())
        ))
      },
      fetch: (m,d,a) => {
        const filter = m.browses.filter
        const start = [...m.browses.list].pop()
        if(filter === 0) return getLatestBrowses(start);
        if(filter === 1) return getPopularBrowses(start);
        return getUserBrowses(filter, start);
      },
      add: (m,d) => ({
        browses: { ...m.browses,
          list: removeDuplicatesBy(x => x.key,
            m.browses.list.concat(d).sort((a, b) => {
              if(m.browses.filter === 1) {
                if (a.views > b.views) return -1;
                if (a.views < b.views) return 1;
                return 0;
              } else {
                if (a.published > b.published) return -1;
                if (a.published < b.published) return 1;
                return 0;
              }
            })),
        }}),
      remove: (m,d) => ({
        browses: { ...m.browses,
          list: m.browses.list.filter(
            x => x.key !== d
          )
        }}),
      filter: (m,d) => ({
        browses: { ...m.browses,
          filter: d,
        }}),
      clear: (m,d) => ({
        browses: { ...m.browses,
          list: [],
        }}),
      browse: (m,d) => ({
        browses: { ...m.browses,
          list: m.browses.list.map(x => {
            if(x.key === d) x.browsers = Object.assign({}, x.browsers, {
              [m.user.fbid]: true
            })
            return x
          })
        }}),
    },
  },
  subscriptions: [
    (m,a) => a.browses.set(m.router.params.id || 0),
    (m,a) =>
      window.onscroll = (e) => {
        if(document.body.scrollTop > 0 &&
          (window.innerHeight + window.scrollY) >=
          document.body.scrollHeight) {
          a.browses.fetch()
          .then(browses => browses.forEach(b =>
            a.browses.add(b.val())
          ))
        }
      },
  ],
})
