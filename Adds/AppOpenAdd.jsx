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
    {
      requestNonPersonalizedAdsOnly: true,
    },
  );

  const isAdShowing = useRef(false); // Tracks whether an ad is currently being shown
  const isAppActive = useRef(false); // Tracks app activity to prevent unnecessary triggers

  // Load the ad when the component mounts
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
      if (loadedAppOpen && !isAdShowing.current) {
        isAdShowing.current = true; // Lock to prevent multiple calls
        try {
          showAppOpen()
            .then(() => {
              // console.log('Ad shown successfully');
            })
            .catch(error => {
              // console.error('Failed to show App Open Ad:', error);
            })
            .finally(() => {
              isAdShowing.current = false; // Reset after the ad is handled
            });
        } catch (error) {
          // console.error('Unexpected error while showing ad:', error);
          isAdShowing.current = false;
        }
      } else if (!loadedAppOpen) {
        loadAppOpen(); // Reload the ad if not loaded
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

  // Reload the ad when it is closed
  useEffect(() => {
    if (closedAppOpen && !loadedAppOpen) {
      loadAppOpen();
    }
  }, [closedAppOpen, loadedAppOpen, loadAppOpen]);

  return null; // This component doesn't render UI
};

export default AppOpenAd;
