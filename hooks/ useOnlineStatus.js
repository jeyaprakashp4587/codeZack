import React, {useEffect, useCallback} from 'react';
import {AppState} from 'react-native';
import axios from 'axios';
import {profileApi} from '../Api';
import {useData} from '../Context/Contexter';

const useOnlineStatus = () => {
  const {user} = useData();
  const updateOnlineStatus = useCallback(async onlinestatus => {
    try {
      await axios.post(`${profileApi}/Profile/setOnlineStatus/${user?._id}`, {
        status: onlinestatus,
      });

      console.log(`Online status updated to: ${onlinestatus}`);
    } catch (error) {
      console.error('Error updating online status:', error);
    }
  }, []);

  useEffect(() => {
    const handleAppStateChange = nextAppState => {
      console.log(`AppState changed to: ${nextAppState}`);
      if (nextAppState === 'active') {
        updateOnlineStatus(true);
      } else if (nextAppState === 'background' || nextAppState === 'inactive') {
        updateOnlineStatus(false);
      }
    };

    // Add event listener
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    // Call the function initially to ensure the correct status
    (async () => {
      const initialAppState = AppState.currentState;
      console.log(`Initial AppState: ${initialAppState}`);
      if (initialAppState === 'active') {
        updateOnlineStatus(true);
      } else {
        updateOnlineStatus(false);
      }
    })();

    return () => {
      subscription.remove(); // Cleanup on unmount
    };
  }, [updateOnlineStatus]);

  return null;
};

export default useOnlineStatus;
