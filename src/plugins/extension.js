export default () => ({
  state: {
    extension: {
      isInstalled: true
    }
  },
  actions: {
    extension: {
      setIsInstalled: (s,a,d) => ({ extension: { isInstalled: d } }),
      install: (s,a) => chrome.webstore.install('',
        (d) => a.setIsInstalled(true),
        (e) => alert(e)
      )
    },
  },
  events: {
    loaded: (s,a,d) =>
      chrome && chrome.runtime.sendMessage('fpijpjkcpkhbkeiinkphbiaapekmfgdo', { message: "version" },
        reply => reply && reply.version && reply.version >= 2.1
          ? a.extension.setIsInstalled(true)
          : a.extension.setIsInstalled(false)
      )
  },
})
