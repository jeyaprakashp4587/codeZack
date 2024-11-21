import {useEffect, useState, useRef} from 'react';
import {AppState} from 'react-native';
import {AppOpenAd, TestIds, AdEventType} from 'react-native-google-mobile-ads';

const useAppOpenAd = () => {
  const adUnitId = __DEV__
    ? TestIds.APP_OPEN
    : 'ca-app-pub-3257747925516984/6520210341';

  const [adLoaded, setAdLoaded] = useState(false);
  const [isShowingAd, setIsShowingAd] = useState(false);
  const appOpenAd = useRef(AppOpenAd.createForAdRequest(adUnitId)).current;
  const appState = useRef(AppState.currentState);
  const lastAdShownTime = useRef(null);

  const MINIMUM_AD_INTERVAL = 40000; // 1 minute between ad displays

  // Load the ad
  const loadAd = () => {
    if (!adLoaded && !isShowingAd) {
      console.log('Loading App Open Ad...');
      appOpenAd.load({requestNonPersonalizedAdsOnly: true});
    }
  };

  useEffect(() => {
    const handleAppStateChange = async nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        const now = Date.now();

        // Check if enough time has passed since the last ad was shown
        if (
          adLoaded &&
          (!lastAdShownTime.current ||
            now - lastAdShownTime.current >= MINIMUM_AD_INTERVAL)
        ) {
          try {
            setIsShowingAd(true);
            await appOpenAd.show();
            lastAdShownTime.current = now; // Update last shown time
            setAdLoaded(false);
            loadAd(); // Load a new ad after showing
          } catch (error) {
            console.error('Error showing App Open Ad:', error);
          } finally {
            setIsShowingAd(false);
          }
        }
      }
      appState.current = nextAppState;
    };

    // Add listeners
    const onAdLoaded = () => {
      console.log('App Open Ad Loaded');
      setAdLoaded(true);
    };

    const onAdFailedToLoad = error => {
      console.error('Error loading App Open Ad:', error);
      setAdLoaded(false);
    };

    appOpenAd.addAdEventListener(AdEventType.LOADED, onAdLoaded);
    appOpenAd.addAdEventListener(AdEventType.ERROR, onAdFailedToLoad);

    // Initial load
    loadAd();

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      appOpenAd.removeAllListeners();
      subscription.remove();
    };
  }, [adLoaded, isShowingAd]);

  return null; // No UI to render
};

export default useAppOpenAd;
