// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAQ5N4gb8_wY2A6skjcYoySJ9tBv7-YSXw",
  authDomain: "savelinks-a6d31.firebaseapp.com",
  projectId: "savelinks-a6d31",
  storageBucket: "savelinks-a6d31.appspot.com",
  messagingSenderId: "814089111799",
  appId: "1:814089111799:web:2e8b2cbfb9b9dfdb8b6bf2",
  measurementId: "G-2SCYQRBBYQ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
