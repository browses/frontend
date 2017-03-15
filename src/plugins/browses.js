import { database } from '../helpers/fire'
const browses = database.ref('browses')

const removeDuplicatesBy = (keyFn, array) => {
  var mySet = new Set()
  return array.filter(function(x) {
    var key = keyFn(x), isNew = !mySet.has(key)
    if (isNew) mySet.add(key)
    return isNew
  })
}

const getUserBrowses = (id, start) => {
  const next = start && start.key
  if (next) {
    return browses
    .orderByChild('browser')
    .startAt(id)
    .endAt(id, next)
    .limitToLast(5)
    .once('value')
  }
  return browses
  .orderByChild('browser')
  .equalTo(id)
  .limitToLast(5)
  .once('value')
}

const getLatestBrowses = start => {
  const next = start && start.published
  if (next) {
    return browses
    .orderByChild('published')
    .endAt(next)
    .limitToLast(5)
    .once('value')
  }
  return browses
  .limitToLast(5)
  .once('value')
}

export default () => ({
  model: {
    browses: {
      list: [],
      filter: 0
    },
  },
  actions: {
    browses: {
      clear: (m) => ({
        browses: { ...m.browses,
          list: [],
        }}),
      filter: (m,d) => ({
        browses: { ...m.browses,
          filter: d,
        }}),
      fetch: (m) => {
        const filter = m.browses.filter
        const start = [...m.browses.list].pop()
        if(filter === 0) return getLatestBrowses(start)
        return getUserBrowses(filter, start)
      },
      set: (m,d,a) => {
        a.browses.clear()
        a.browses.filter(d)
        a.browses.fetch()
        .then(browses => browses.forEach(b =>
          a.browses.add(b.val())
        ))
      },
      add: (m,d) => ({
        browses: { ...m.browses,
          list: removeDuplicatesBy(x => x.key,
            m.browses.list.concat(d).sort((a, b) => {
              if (a.published > b.published) return -1
              if (a.published < b.published) return 1
              return 0
            })),
        }}),
      remove: (m,d) => ({
        browses: { ...m.browses,
          list: m.browses.list.filter(
            x => x.key !== d
          )
        }}),
      view: (m,d) => ({
        browses: { ...m.browses,
          list: m.browses.list.map(x => {
            if(x.key === d) x.browsers = {
              ...x.browsers,
              [m.user.fbid]: true
            }
            return x
          })
        }}),
    },
  },
  subscriptions: [
    (m,a) =>
      a.browses.set(m.router.params.id || 0),
    (_,a) =>
      browses.limitToLast(1).on('value',
      browses => browses.forEach(b =>
        a.browses.add(b.val())
      )),
    (_,a) =>
      window.onscroll = () => {
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
