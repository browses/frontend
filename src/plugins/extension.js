export default () => ({
  state: {
    extension: {
      isInstalled: null
    }
  },
  actions: {
    extension: {
      setIsInstalled: (s,a,d) => ({ extension: { isInstalled: d } }),
      install: (s,a) => chrome.webstore.install('',
        (d) => a.setIsInstalled(true),
        (e) => console.log('not installed: '+ e)
      )
    },
  },
  events: {
    loaded: [
      (s,a) => chrome.app.isInstalled
        ? a.extension.setIsInstalled(true)
        : a.extension.setIsInstalled(false)
    ]
  },
})
