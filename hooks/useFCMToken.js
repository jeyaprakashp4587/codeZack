import {useEffect, useCallback} from 'react';
import messaging from '@react-native-firebase/messaging';
// import PushNotification from 'react-native-push-notification';
import axios from 'axios';
import {profileApi} from '../Api';
import {useData} from '../Context/Contexter';

const useFCMToken = () => {
  const {user} = useData();

  // Save FCM token
  const getTokenAndSave = useCallback(async () => {
    try {
      const authStatus = await messaging().requestPermission();
      if (
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL
      ) {
        const token = await messaging().getToken();
        // console.log('FCM Token:', token);

        // Save token to the backend
        await axios.post(`${profileApi}/Profile/saveFcmToken`, {
          userId: user?._id,
          FcmToken: token,
        });
      }
    } catch (error) {
      // console.error('Error getting FCM token:', error);
    }
  }, [user]);

  // Setup foreground notification listener
  const setupForegroundListener = useCallback(() => {
    return messaging().onMessage(async remoteMessage => {
      console.log('Notification received in foreground:', remoteMessage);
      // Display local notification
      //   PushNotification.localNotification({
      //     channelId: 'default-channel-id', // Must match with the created channel on Android
      //     title: remoteMessage.notification?.title || 'Notification',
      //     message: remoteMessage.notification?.body || 'You have a new message!',
      //     data: remoteMessage.data, // Attach custom data payload
      //   });
    });
  }, []);

  useEffect(() => {
    const checkPermission = async () => {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        // console.log('Notification permission granted');
      } else {
        console.log('Notification permission denied');
      }
    };

    checkPermission();
    getTokenAndSave();

    const unsubscribeOnMessage = setupForegroundListener();

    return () => {
      unsubscribeOnMessage();
    };
  }, [getTokenAndSave, setupForegroundListener]);
};

export default useFCMToken;
