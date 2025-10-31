import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyAbkILI5qQXkYPA8IVf5IgZQ1b8MO8Q-KQ',
  authDomain: 'freedom-punch-card.firebaseapp.com',
  databaseURL: 'https://freedom-punch-card-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'freedom-punch-card',
  storageBucket: 'freedom-punch-card.firebasestorage.app',
  messagingSenderId: '426797316051',
  appId: '1:426797316051:web:2bb17a55263ec900a5e126',
  measurementId: 'G-P5FPLGZCTC',
  databseURL: 'https://freedom-punch-card-default-rtdb.asia-southeast1.firebasedatabase.app/',
}

const firebaseApp = initializeApp(firebaseConfig)
const database = getDatabase(firebaseApp)
const auth = getAuth(firebaseApp)

export { firebaseApp, database, auth }
