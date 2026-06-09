import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBvqGjoLBFvsa0ByA5HVB1enrlGJSeqSZw",
  authDomain: "victorian-luxuries.firebaseapp.com",
  projectId: "victorian-luxuries",
  storageBucket: "victorian-luxuries.firebasestorage.app",
  messagingSenderId: "233370412520",
  appId: "1:233370412520:web:09a6b9ae3744509d6cf05d",
  measurementId: "G-4844DH54K6"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;