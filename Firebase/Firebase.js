import {initializeApp} from 'firebase/app';
import {getMessaging} from 'firebase/messaging';
import {getStorage} from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyBhsaau-Xa0qe6QCMOvxUKqh2ety4mC6H0',
  authDomain: 'codecampus-99fad.firebaseapp.com',
  projectId: 'codecampus-99fad',
  storageBucket: 'codecampus-99fad.appspot.com',
  messagingSenderId: '1029306297228',
  appId: '1:1029306297228:web:f148c83413487f86a2c4a9',
  measurementId: 'G-GTLM1WS0FE',
};

// Initialize Firebase
initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const storage = getStorage();
export {storage};
