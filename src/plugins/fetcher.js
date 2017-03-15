export default () => ({
  hooks: {
    onUpdate: (om,m,d,a) => {
      if(m.router && om.router.path !== m.router.path) {
        switch (m.router.match) {
          case '/': return a.browses.set(0)
          case '/:id': return a.browses.set(m.router.params.id)
        }
      }
    },
  },
})
