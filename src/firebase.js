import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInAnonymously } from "firebase/auth";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDRmmbL1btAKpXqoIUXRVck88VvHAiEHwY",
  authDomain: "teacher-pedro-aulas-de-ingles.firebaseapp.com",
  projectId: "teacher-pedro-aulas-de-ingles",
  storageBucket: "teacher-pedro-aulas-de-ingles.firebasestorage.app",
  messagingSenderId: "240027873878",
  appId: "1:240027873878:web:89a623f94aa2555d5641f7",
  measurementId: "G-P2DGEQQPWE"
};

const app = initializeApp(firebaseConfig);

export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Faz login anônimo se ainda não houver usuário
export const garantirLogin = async () => {
  if (!auth.currentUser) {
    await signInAnonymously(auth);
  }
  return auth.currentUser;
};