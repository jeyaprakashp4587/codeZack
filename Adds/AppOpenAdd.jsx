import {AppState} from 'react-native';
import React, {useEffect, useRef} from 'react';
import {useAppOpenAd, TestIds} from 'react-native-google-mobile-ads';

const AppOpenAd = () => {
  const {
    show: showAppOpen,
    isLoaded: loadedAppOpen,
    isClosed: closedAppOpen,
    load: loadAppOpen,
    isShowing: isAdShowing, // Fix: Use correct state to track ad display
  } = useAppOpenAd(
    __DEV__ ? TestIds.APP_OPEN : 'ca-app-pub-3257747925516984/6520210341',
    {requestNonPersonalizedAdsOnly: true},
  );

  const lastAdShownTime = useRef(0);

  useEffect(() => {
    loadAppOpen(); // Ensure ad is loaded on component mount
  }, []);

  // Function to show ad with a time limit (1-minute gap)
  const showAdIfAvailable = () => {
    const currentTime = Date.now();
    if (currentTime - lastAdShownTime.current < 60000) {
      console.log('Ad skipped: Less than 1 min since last ad.');
      return;
    }

    if (loadedAppOpen && !isAdShowing) {
      showAppOpen()
        .then(() => {
          lastAdShownTime.current = Date.now();
        })
        .catch(error => {
          console.error('Ad Show Error:', error);
        });
    } else if (!loadedAppOpen) {
      console.log('Ad not loaded yet, reloading...');
      loadAppOpen();
    }
  };

  // Handle app state changes
  useEffect(() => {
    const handleAppStateChange = state => {
      if (state === 'active') {
        showAdIfAvailable();
      }
    };

    const appStateListener = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      appStateListener.remove();
    };
  }, []);

  // Reload ad when closed
  useEffect(() => {
    if (closedAppOpen) {
      console.log('Ad closed, reloading...');
      loadAppOpen();
    }
  }, [closedAppOpen]);

  return null;
};

export default AppOpenAd;
