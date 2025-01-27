import {AppState} from 'react-native';
import React, {useEffect} from 'react';
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

  // Load the ad when the component mounts
  useEffect(() => {
    loadAppOpen();
  }, [loadAppOpen]);

  // Handle app state changes
  useEffect(() => {
    const handleAppStateChange = state => {
      if (state === 'active') {
        if (loadedAppOpen) {
          try {
            showAppOpen();
          } catch (error) {
            console.error('Failed to show App Open Ad:', error);
          }
        } else {
          loadAppOpen(); // Reload the ad
        }
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
