import {AppState} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useAppOpenAd, TestIds} from 'react-native-google-mobile-ads';

const AppOpenAd = () => {
  const {
    show: showAppOpen,
    isLoaded: loadedAppOpen,
    isClosed: closedAppOpen,
    load: loadAppOpen,
  } = useAppOpenAd(
    __DEV__ ? TestIds.APP_OPEN : 'ca-app-pub-3257747925516984/6520210341',
    {requestNonPersonalizedAdsOnly: true},
  );

  const lastAdShownTime = useRef(0);
  const [isAdShowing, setIsAdShowing] = useState(false);

  useEffect(() => {
    loadAppOpen(); // Ensure ad is loaded on component mount
  }, []);

  const showAdIfAvailable = () => {
    const currentTime = Date.now();
    if (currentTime - lastAdShownTime.current < 60000) {
      console.log('Ad skipped: Less than 1 min since last ad.');
      return;
    }

    if (loadedAppOpen && !isAdShowing) {
      setIsAdShowing(true);
      showAppOpen()
        .then(() => {
          lastAdShownTime.current = Date.now();
          setIsAdShowing(false);
        })
        .catch(error => {
          console.error('Ad Show Error:', error);
          setIsAdShowing(false);
        });
    } else if (!loadedAppOpen) {
      console.log('Ad not loaded yet, reloading...');
      loadAppOpen();
    }
  };

  useEffect(() => {
    const handleAppStateChange = state => {
      if (state === 'active') {
        setTimeout(() => showAdIfAvailable(), 500);
      }
    };

    const appStateListener = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => appStateListener.remove();
  }, []);

  useEffect(() => {
    if (closedAppOpen) {
      console.log('Ad closed, reloading...');
      loadAppOpen();
    }
  }, [closedAppOpen]);

  return null;
};

export default AppOpenAd;
