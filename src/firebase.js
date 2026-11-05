
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAQLdrKyJl0Ef5K6b4zmCq6P3dGl1TaIWs",
    authDomain: "studentstay-79003.firebaseapp.com",
    projectId: "studentstay-79003",
    storageBucket: "studentstay-79003.firebasestorage.app",
    messagingSenderId: "378107873461",
    appId: "1:378107873461:web:a489dc1e9adaaf7e3916fc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
