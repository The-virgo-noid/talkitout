import firebase from "firebase/app";
import "firebase/auth";

 export const auth =  firebase.initializeApp ({
    apiKey: "AIzaSyAfnjvhJ6xvQpPmgqe1kLaBitgKHo_Jkv4",
    authDomain: "talk-93619.firebaseapp.com",
    projectId: "talk-93619",
    storageBucket: "talk-93619.appspot.com",
    messagingSenderId: "897602640984",
    appId: "1:897602640984:web:3418a87b816649053d7e2d"
  }).auth();