// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBLkYIQdFuNx2X1Q3jx1UWVNCT38NTh7cM",
  authDomain: "inventory-management-fdc2a.firebaseapp.com",
  projectId: "inventory-management-fdc2a",
  storageBucket: "inventory-management-fdc2a.appspot.com",
  messagingSenderId: "860978366796",
  appId: "1:860978366796:web:d750e3fc955de7a020a7e9",
  measurementId: "G-Z5YJZEVG42"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { firestore };
