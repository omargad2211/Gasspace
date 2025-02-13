import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC6FefHEDuYqa9Txjv_eY8EtQW5m0bOQXI",
  authDomain: "metromingle-47cc5.firebaseapp.com",
  projectId: "metromingle-47cc5",
  storageBucket: "metromingle-47cc5.appspot.com",
  messagingSenderId: "467744747424",
  appId: "1:467744747424:web:79d28648dc0002def67ec5",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

export const storage = getStorage();
export const db = getFirestore(app);
// export {auth, storage,db};