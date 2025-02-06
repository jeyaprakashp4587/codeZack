import React, {useEffect, useCallback} from 'react';
import {AppState} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {profileApi} from '../Api';
import {useData} from '../Context/Contexter';

const useOnlineStatus = () => {
  const {setUser} = useData();
  const updateOnlineStatus = useCallback(async onlinestatus => {
    // console.log('app state', onlinestatus);

    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) return;
      const {data, status} = await axios.post(
        `${profileApi}/Profile/setOnlineStatus/${userId}`,
        {
          status: onlinestatus,
        },
      );
    } catch (error) {
      console.error('Error updating online status:', error);
    }
  }, []);

  useEffect(() => {
    const handleAppStateChange = nextAppState => {
      if (nextAppState === 'active') {
        updateOnlineStatus(true); // App opened → Set online
      } else if (nextAppState === 'background' || nextAppState === 'inactive') {
        updateOnlineStatus(false); // App closed → Set offline
      }
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );
    return () => subscription.remove(); // Cleanup on unmount
  }, [updateOnlineStatus]);

  return null;
};

export default useOnlineStatus;
