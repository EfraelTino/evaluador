// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCgaUbzniLLQHzn_iJHPrFkGvUkIWfbR4U",
  authDomain: "landinglab-6c669.firebaseapp.com",
  projectId: "landinglab-6c669",
  storageBucket: "landinglab-6c669.firebasestorage.app",
  messagingSenderId: "269011588390",
  appId: "1:269011588390:web:8c0dd28c9cede538465de7",
  measurementId: "G-8ZEWZ3B6PN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
