import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyD6Fh04WuYI2p2cKTJ8u5-nKtDIKHBRO1Y",
  authDomain: "instagram-clone-6dc8b.firebaseapp.com",
  projectId: "instagram-clone-6dc8b",
  storageBucket: "instagram-clone-6dc8b.appspot.com",
  messagingSenderId: "331329578200",
  appId: "1:331329578200:web:3925d2a4184935bfe823ad",
  measurementId: "G-VJ6N59LDCQ",
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
