import {AppState} from 'react-native';
import React, {useEffect, useRef} from 'react';
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

  const isAdShowing = useRef(false);
  const isAppActive = useRef(false);
  const lastAdShownTime = useRef(0);

  useEffect(() => {
    loadAppOpen();
  }, [loadAppOpen]);

  // Handle app state changes
  useEffect(() => {
    const handleAppStateChange = state => {
      if (state === 'active') {
        if (!isAppActive.current) {
          isAppActive.current = true; // Mark app as active
          showAdIfAvailable();
        }
      } else {
        isAppActive.current = false; // Reset app state when inactive
      }
    };

    const showAdIfAvailable = () => {
      const currentTime = Date.now();
      if (currentTime - lastAdShownTime.current < 60000) {
        return;
      }

      if (loadedAppOpen && !isAdShowing.current) {
        isAdShowing.current = true;
        try {
          showAppOpen()
            .then(() => {
              lastAdShownTime.current = Date.now();
            })
            .catch(() => {})
            .finally(() => {
              isAdShowing.current = false;
            });
        } catch {
          isAdShowing.current = false;
        }
      } else if (!loadedAppOpen) {
        loadAppOpen();
      }
    };

    const appStateListener = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      appStateListener.remove();
    };
  }, [loadedAppOpen, showAppOpen, loadAppOpen]);

  useEffect(() => {
    if (closedAppOpen && !loadedAppOpen) {
      loadAppOpen();
    }
  }, [closedAppOpen, loadedAppOpen, loadAppOpen]);

  return null;
};

export default AppOpenAd;
