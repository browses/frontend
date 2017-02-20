import firebase from 'firebase';
import FBSDK from 'fb-sdk';

import './index.scss';

firebase.initializeApp({
  apiKey: 'AIzaSyDf0B5peKIIXbamijhyJjqtJtv6LsYiQIQ',
  authDomain: 'browses-ef3f0.firebaseapp.com',
  databaseURL: 'https://browses-ef3f0.firebaseio.com',
  storageBucket: 'browses-ef3f0.appspot.com',
  messagingSenderId: '685716734453'
});

const Facebook = FBSDK({
  appId: '1659456037715738',
  status: true,
  version: 'v2.7',
});

const database = firebase.database();
const storage = firebase.storage().ref();

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

export const getBrowse = (id) =>
  database.ref('browses')
  .orderByKey()
  .equalTo(id)
  .once('value');

export const getUserBrowses = (id) =>
  database.ref('browses')
  .orderByChild('browser')
  .equalTo(id)
  .limitToLast(5)
  .once('value');

export const getUsersLastBrowse = (id) =>
  database.ref('browses')
  .orderByChild('browser')
  .equalTo(id)
  .limitToLast(1)
  .once('value');

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

export const getPopularBrowses = () =>
  database.ref('browses')
  .orderByChild('views')
  .limitToLast(5)
  .once('value');

export const deleteBrowse = (browser, browse) =>
  database.ref(`browses/${browse}`).remove()
  .then(() => storage.child(`${browser}/${browse}`).delete())
  .catch(console.log);

export const putBrowseView = (browse) =>
  database.ref(`browses/${browse}/views`)
  .transaction(views => views ? views + 1 : 1)
  .catch(console.log);

export const putBrowseBrowser = (browser, browse) =>
  database.ref(`browses/${browse}/browsers`)
  .transaction(browsers => Object.assign({}, browsers, { [browser]: true }))
  .catch(console.log);


/*
// Test Calls
*/

// const print = xs => xs.forEach(x => console.log(x.val()));
// getBrowsesUser().then(x => console.log('getBrowsesUser', x.uid));
// getBrowse('99492c54-8b59-4ba1-9a15-68cb2bbadbea').then(print);
// getUserBrowses('10157368805735201').then(print);
// getUsersLastBrowse('10157368805735201').then(print);
// getLatestBrowses().then(print);
// getPopularBrowses().then(print);
// putBrowseView('f8af0b13-72c5-48ef-8f6c-8b7d92d0cb74').then(console.log);
// putBrowseBrowser('f8af0b13-72c5-48ef-8f6c-8b7d92d0cb74').then(console.log);
// deleteBrowse('f8af0b13-72c5-48ef-8f6c-8b7d92d0cb74').then(console.log);
