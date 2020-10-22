import firebase from "firebase";

var firebaseConfig = {
  apiKey: "AIzaSyAdCNisr9iq2ysllpIEwoPrFs0mEFstsaA",
  authDomain: "elibrary-team10.firebaseapp.com",
  databaseURL: "https://elibrary-team10.firebaseio.com",
  projectId: "elibrary-team10",
  storageBucket: "elibrary-team10.appspot.com",
  messagingSenderId: "164507500484",
  appId: "1:164507500484:web:9f979660338edfeec5ee91",
};

const fire = firebase.initializeApp(firebaseConfig);

export default fire;
