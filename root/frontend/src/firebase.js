// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyCJirSZFQq36rNkwU58e5bkX8d2Skccd0Q",
  authDomain: "sampleapp-730c8.firebaseapp.com",
  projectId: "sampleapp-730c8",
  storageBucket: "sampleapp-730c8.appspot.com",
  messagingSenderId: "211085904761",
  appId: "1:211085904761:web:6cb1833e1d8589d8c43da8",
  measurementId: "G-4W20HT24YH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);