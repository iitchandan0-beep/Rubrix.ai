
import firebase from "firebase/compat/app";
import "firebase/compat/database";
import "firebase/compat/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDBlShBoifWQGGyrUf-xDmma6mL-Ipvh94",
  authDomain: "backend-133ae.firebaseapp.com",
  databaseURL: "https://backend-133ae-default-rtdb.firebaseio.com",
  projectId: "backend-133ae",
  storageBucket: "backend-133ae.firebasestorage.app",
  messagingSenderId: "1006128169609",
  appId: "1:1006128169609:web:8584b531bc740be1277c58"
};

// Initialize Firebase using the compat pattern.
const app = firebase.initializeApp(firebaseConfig);

// Export instances for the rest of the application using the compat methods.
export const db = firebase.database();
export const auth = firebase.auth();
