import { database } from '../helpers/firebase'
const browses = database.ref('browses')

const filterByKey = (o,y) => Object.keys(o).filter(x => x !== y).reduce((r, k) => (r[k] = o[k], r), {})
const sortByKeyDesc = o => Object.keys(o).sort().reverse().reduce((r, k) => (r[k] = o[k], r), {})
const lastItem = o => o[Object.keys(o)[Object.keys(o).length - 1]]

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
  state: {
    browses: {
      list: {},
      filter: 0
    },
  },
  actions: {
    browses: {
      clear: (m) => ({
        browses: { ...m.browses,
          list: {},
        }}),
      filter: (m,a,d) => ({
        browses: { ...m.browses,
          filter: d,
        }}),
      add: (m,a,d) => ({
        browses: { ...m.browses,
          list: sortByKeyDesc({ ...m.browses.list,
            [d.key]: d.val()
          })
        }}),
      fetch: (m) => {
        const filter = m.browses.filter
        const start = lastItem(m.browses.list)
        if(filter === 0) return getLatestBrowses(start)
        return getUserBrowses(filter, start)
      },
      set: (m,a,d) => {
        a.browses.clear()
        a.browses.filter(d)
        a.browses.fetch()
        .then(browses => browses.forEach(
          a.browses.add
        ))
      },
      remove: (m,a,d) => ({
        browses: { ...m.browses,
          list: filterByKey(m.browses.list, d)
        }}),
      view: (m,a,d) => ({
        browses: { ...m.browses,
          list: { ...m.browses.list,
            [d]: { ...m.browses.list[d],
              browsers: { ...m.browses.list[d].browsers,
                [m.user.fbid]: true
              }
            }
          }
        }}),
    },
  },
  events: {
    loaded: [
      // (_,a) =>
      //   browses.limitToLast(1).on('value',
      //     browses => browses.forEach(a.browses.add)
      //   ),
      (_,a) =>
        window.onscroll = () => {
          if(document.body.scrollTop > 0 &&
            (window.innerHeight + window.scrollY) >=
            document.body.scrollHeight) {
            a.browses.fetch()
            .then(browses => browses.forEach(a.browses.add))
          }
        },
    ]
  },
})
