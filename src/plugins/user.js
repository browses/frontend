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
  })
})

export const getFirebaseUser = fbUser =>
  auth().signInWithCredential(
    auth.FacebookAuthProvider
    .credential(fbUser.authResponse.accessToken)
  )

export default () => ({
  model: {
    user: {}
  },
  actions: {
    user: {
      set: (m,d) => ({
        user: d,
      }),
      auth: (m,d,a) => getFacebookUser()
        .then(getFirebaseUser)
        .then(user => a.user.set({
          displayName: user.displayName,
          photoURL: user.providerData[0].photoURL,
          uid: user.uid,
          fbid: user.providerData[0].uid,
        }))
    },
  },
  subscriptions: [
    (m,a) => a.user.auth(),
  ],
})
