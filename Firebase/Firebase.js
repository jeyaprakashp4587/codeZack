import {initializeApp} from 'firebase/app';
import {getMessaging} from 'firebase/messaging';
import {getStorage} from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDCTmSaOOdCOpAAgbZ2L6182v3_Oe6nz94',
  authDomain: 'codezack-83869.firebaseapp.com',
  projectId: 'codezack-83869',
  storageBucket: 'codezack-83869.firebasestorage.app',
  messagingSenderId: '132569783886',
  appId: '1:132569783886:web:dca9c6bd318248db9c2d1f',
  measurementId: 'G-FM1PMLTFNE',
};

// Initialize Firebase
initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const storage = getStorage();
export {storage};
