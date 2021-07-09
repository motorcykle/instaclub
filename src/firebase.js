import firebase from 'firebase';
import firebaseConfig from './firebaseConfig';

const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

const db = app.firestore();
const auth = app.auth();
const storage = app.storage();
//export const provider = new firebase.auth.GoogleAuthProvider();

export { auth, storage };

export default db;