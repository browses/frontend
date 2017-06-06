import FBSDK from 'fb-sdk'
import auth from 'firebase/auth'

const Facebook = FBSDK({
  appId: '1659456037715738',
  status: true,
  version: 'v2.7',
})

export const getFacebookUser = () =>
new Promise((resolve, reject) => {
  Facebook.getLoginStatus(response => {
    if (response.status === 'connected') resolve(response)
    else reject(response)
  }).catch(console.log)
})

export const getFirebaseUser = fbUser =>
  auth().signInWithCredential(
    auth.FacebookAuthProvider
    .credential(fbUser.authResponse.accessToken)
  ).catch(console.log)

export default () => ({
  state: {
    user: {}
  },
  actions: {
    user: {
      set: (m,a,d) => ({
        user: d,
      }),
      auth: (m,a,d) => getFacebookUser()
        .then(getFirebaseUser)
        .then(user => a.user.set({
          displayName: user.displayName,
          photoURL: user.providerData[0].photoURL,
          uid: user.uid,
          fbid: user.providerData[0].uid,
        })).catch(console.log)
    },
  },
  events: {
    loaded: (m,a) => a.user.auth(),
  },
})
