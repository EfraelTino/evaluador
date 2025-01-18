// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCm-gPfz9R22XK86-TEO5Kg6JAx0jXNzHc",
  authDomain: "landinglab-ai.firebaseapp.com",
  projectId: "landinglab-ai",
  storageBucket: "landinglab-ai.firebasestorage.app",
  messagingSenderId: "393568607089",
  appId: "1:393568607089:web:da47ebb5228ca65f5bb4d0",
  measurementId: "G-9HJ1XGDN6R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
