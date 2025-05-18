// firebase/config.js
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore'; // 👈 Import Firestore

// Your Firebase Web Config
const firebaseConfig = {
  apiKey: "AIzaSyBtGjLuarVyOrtX7DTz6_cOJcU8gjJYPKE",
  authDomain: "pizza-cafeapp.firebaseapp.com",
  projectId: "pizza-cafeapp",
  storageBucket: "pizza-cafeapp.appspot.com", 
  messagingSenderId: "376359866282",
  appId: "1:376359866282:web:05721d3429c7ddd43225d3"
};

// Initialize Firebase only once
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore(); // 👈 Initialize Firestore

export { auth, db };
