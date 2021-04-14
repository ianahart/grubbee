import { firebase } from '@firebase/app';
import '@firebase/firestore';
import '@firebase/auth';






// firebase init - add your own config here
const firebaseConfig = {
  apiKey: process.env.VUE_APP_API_KEY,
  authDomain: process.env.VUE_APP_AUTH_DOMAIN,
  databaseURL: process.env.VUE_APP_DATABASE_URL,
  projectId: process.env.VUE_APP_PROJECT_ID,
  storageBucket: process.env.VUE_APP_STORAGE_BUCKET_URL,

}
firebase.initializeApp(firebaseConfig)




const db = firebase.firestore()
const auth = firebase.auth()



const usersCollection = db.collection('users')



export {
  db,
  auth,
  usersCollection,
}