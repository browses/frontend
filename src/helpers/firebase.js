import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

const app = firebase.initializeApp({
  apiKey: 'AIzaSyDf0B5peKIIXbamijhyJjqtJtv6LsYiQIQ',
  authDomain: 'browses-ef3f0.firebaseapp.com',
  databaseURL: 'https://browses-ef3f0.firebaseio.com',
  storageBucket: 'browses-ef3f0.appspot.com',
  messagingSenderId: '685716734453'
})

export const database = app.database()
