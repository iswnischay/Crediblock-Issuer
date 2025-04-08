import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 


const firebaseConfig = {
    apiKey: "AIzaSyB7co7v87wbZTuacsTQUso7ujGdnVwupEg",
    authDomain: "crediblock-xyz.firebaseapp.com",
    projectId: "crediblock-xyz",
    storageBucket: "crediblock-xyz.firebasestorage.app",
    messagingSenderId: "879006897557",
    appId: "1:879006897557:web:62e0e2593becfdc026129c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Get the authentication instance
export const db = getFirestore(app); // Ensure 'app' is passed here
export { auth }; // Export the auth instance