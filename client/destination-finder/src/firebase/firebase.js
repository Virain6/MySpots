// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBx_p5ASzXwhccFDiBWrzbD0fNsQyqL4-I",
  authDomain: "lab4-88757.firebaseapp.com",
  projectId: "lab4-88757",
  storageBucket: "lab4-88757.firebasestorage.app",
  messagingSenderId: "769649000317",
  appId: "1:769649000317:web:64768e96dc2a6fd1ab1614",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
