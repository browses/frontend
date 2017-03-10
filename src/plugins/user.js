import FBSDK from 'fb-sdk';
import firebase from 'firebase'

const Facebook = FBSDK({
  appId: '1659456037715738',
  status: true,
  version: 'v2.7',
});

export const getFacebookUser = () =>
new Promise((resolve, reject) => {
  Facebook.getLoginStatus(response => {
    if (response.status === 'connected') resolve(response);
    else reject(response);
  });
});

export const getFirebaseUser = fbUser =>
new Promise((resolve, reject) => {
  const credential = firebase.auth.FacebookAuthProvider.credential(fbUser.authResponse.accessToken);
  firebase.auth()
  .signInWithCredential(credential)
  .then(resolve)
  .catch(reject);
});

export const getBrowsesUser = () =>
  getFacebookUser()
  .then(getFirebaseUser);

export default (options) => ({
  model: {
    user: {}
  },
  actions: {
    user: {
      set: (m,d) => ({
        user: d,
      }),
      auth: (m,d,a) => getBrowsesUser()
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
  hooks: {
    onUpdate: (oldm, newm) => console.log(newm)
  }
})
