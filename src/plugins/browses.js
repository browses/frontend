import { database } from '../helpers/firebase'
const browses = database.ref('browses')

const whitelist = [
  '10157368805735201',
  '10154100107713751',
  '10154055590328075',
]

const filterByKey = (o, y) =>
  Object.keys(o)
    .filter(x => x !== y)
    .reduce((r, k) => ((r[k] = o[k]), r), {})
const sortByKeyDesc = o =>
  Object.keys(o)
    .sort()
    .reverse()
    .reduce((r, k) => ((r[k] = o[k]), r), {})
const lastItem = o => o[Object.keys(o)[Object.keys(o).length - 1]]

const getUsersBrowses = id =>
  browses
    .orderByChild('browser')
    .equalTo(id)
    .limitToLast(5)
    .once('value')
    .then(data => data.val())
const getUsersBrowsesFrom = id => next =>
  browses
    .orderByChild('browser')
    .startAt(id)
    .endAt(id, next)
    .limitToLast(5)
    .once('value')
    .then(data => data.val())
const getRecentBrowses = _ =>
  Promise.all(whitelist.map(getUsersBrowses)).then(picked =>
    picked.reduce((a, b) => ({ ...a, ...b }), {})
  )

const getUserBrowses = (id, start) =>
  start && start.key ? getUsersBrowsesFrom(id)(start.key) : getUsersBrowses(id)

const getLatestBrowses = start =>
  start && start.published ? Promise.resolve({}) : getRecentBrowses()

export default () => ({
  state: {
    browses: {
      list: {},
      filter: 0,
    },
  },
  actions: {
    browses: {
      fetch: (m, a) =>
        m.browses.filter === 0
          ? getLatestBrowses(lastItem(m.browses.list)).then(a.browses.add)
          : getUserBrowses(m.browses.filter, lastItem(m.browses.list)).then(
              a.browses.add
            ),
      set: (m, a, d) => {
        a.browses.clear()
        a.browses.filter(d)
        a.browses.fetch()
      },
      clear: m => ({ browses: { ...m.browses, list: {} } }),
      filter: (m, a, d) => ({ browses: { ...m.browses, filter: d } }),
      topup: (s, a, d) => (s.browses.filter === 0 ? a.browses.add(d) : null),
      add: (m, a, d) => ({
        browses: {
          ...m.browses,
          list: sortByKeyDesc({ ...m.browses.list, ...d }),
        },
      }),
      remove: (m, a, d) => ({
        browses: {
          ...m.browses,
          list: filterByKey(m.browses.list, d),
        },
      }),
      view: (m, a, d) => ({
        browses: {
          ...m.browses,
          list: {
            ...m.browses.list,
            [d]: {
              ...m.browses.list[d],
              browsers: {
                ...m.browses.list[d].browsers,
                [m.user.fbid]: true,
              },
            },
          },
        },
      }),
    },
  },
  events: {
    route: (m, a, d) => a.browses.set(d.params.id || 0),
    loaded: [
      (_, a) =>
        addEventListener('scroll', event => {
          var {
            scrollHeight,
            scrollTop,
            clientHeight,
          } = event.target.documentElement
          scrollTop = scrollTop == 0 ? document.body.scrollTop : scrollTop
          if (scrollHeight - scrollTop === clientHeight) {
            a.browses.fetch()
          }
        }),
    ],
  },
})
